import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";
import { z } from "zod";

// ── Config ────────────────────────────────────────────────────────────────────
const TARGET_EMAIL =
  process.env["CONTACT_RECEIVER_EMAIL"] ||
  "info.madeoverinfluence@gmail.com";

const FROM_EMAIL =
  process.env["RESEND_FROM_EMAIL"] || "contact@madoverinfluence.com";

const ALLOWED_ORIGINS = [
  "https://madeoverinfluence.com",
  "https://www.madeoverinfluence.com",
  "http://localhost:5173",
  "http://localhost:3000",
];

// ── Rate Limiter (in-memory, per-IP) ──────────────────────────────────────────
// Works within a single Vercel serverless instance. For stricter guarantees
// across all instances, swap this for Upstash Redis or similar.
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60_000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  // Sweep stale entries
  if (rateLimitMap.size > 100) {
    for (const [key, entry] of rateLimitMap) {
      if (now > entry.resetAt) rateLimitMap.delete(key);
    }
  }

  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  entry.count++;
  return entry.count > RATE_LIMIT_MAX;
}

// ── HTML Escape ───────────────────────────────────────────────────────────────
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// ── Schema ────────────────────────────────────────────────────────────────────
const ContactSchema = z.object({
  name: z
    .string({ required_error: "Name is required." })
    .trim()
    .min(2)
    .max(100),
  email: z.string({ required_error: "Email is required." }).trim().email(),
  interest: z.enum(["creator", "brand", "other"]),
  message: z
    .string({ required_error: "Message is required." })
    .trim()
    .min(10)
    .max(2000),
});

// ── Handler ───────────────────────────────────────────────────────────────────
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS — restrict to known origins
  const origin = req.headers.origin ?? "";
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed." });

  // Rate limit by IP
  const clientIp =
    (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
    req.socket.remoteAddress ||
    "unknown";

  if (isRateLimited(clientIp)) {
    return res
      .status(429)
      .json({ error: "Too many requests. Please try again later." });
  }

  // Validate input
  const result = ContactSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      error: "Validation failed.",
      issues: result.error.issues.map((i) => ({
        field: i.path[0],
        message: i.message,
      })),
    });
  }

  const { name, email, interest, message } = result.data;
  const resendApiKey = process.env["RESEND_API_KEY"];

  if (!resendApiKey) {
    return res.status(500).json({ error: "Email service not configured." });
  }

  const resend = new Resend(resendApiKey);

  const interestLabel =
    interest === "creator"
      ? "Creator seeking management"
      : interest === "brand"
        ? "Brand seeking partnerships"
        : "Other inquiry";

  // Escape all user input before interpolating into HTML
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message);

  try {
    const { data, error } = await resend.emails.send({
      from: `MOI Website <${FROM_EMAIL}>`,
      to: [TARGET_EMAIL],
      reply_to: email,
      subject: `Contact Form: ${name} (${interestLabel})`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:32px;border:1px solid #e0e0e0;border-radius:8px;background:#ffffff">
          <div style="text-align:center;margin-bottom:24px">
            <h2 style="color:#1a1a1a;margin:0">New Contact Form Submission</h2>
            <p style="color:#666;font-size:14px">MOI Website - Made Over Influence</p>
          </div>
          <table style="width:100%;border-collapse:collapse;margin-bottom:20px">
            <tr>
              <td style="padding:10px;border-bottom:1px solid #eee;color:#888;width:100px"><strong>Name</strong></td>
              <td style="padding:10px;border-bottom:1px solid #eee;color:#333">${safeName}</td>
            </tr>
            <tr>
              <td style="padding:10px;border-bottom:1px solid #eee;color:#888"><strong>Email</strong></td>
              <td style="padding:10px;border-bottom:1px solid #eee"><a href="mailto:${safeEmail}" style="color:#2563eb">${safeEmail}</a></td>
            </tr>
            <tr>
              <td style="padding:10px;border-bottom:1px solid #eee;color:#888"><strong>Type</strong></td>
              <td style="padding:10px;border-bottom:1px solid #eee;color:#333">${escapeHtml(interestLabel)}</td>
            </tr>
          </table>
          <div style="background:#f9fafb;padding:16px;border-radius:6px;border-left:4px solid #2563eb">
            <p style="margin:0 0 8px 0;color:#888;font-size:13px"><strong>Message:</strong></p>
            <p style="margin:0;color:#333;white-space:pre-wrap;line-height:1.6">${safeMessage}</p>
          </div>
          <hr style="border:none;border-top:1px solid #eee;margin:24px 0" />
          <p style="color:#aaa;font-size:12px;text-align:center;margin:0">
            This email was sent via the MOI Website contact form.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend API Error:", error);
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({ success: true, data });
  } catch (err) {
    console.error("Resend email failed with exception:", err);
    return res
      .status(500)
      .json({ error: "Failed to send email. Please try again." });
  }
}
