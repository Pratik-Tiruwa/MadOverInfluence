import { Router } from "express";
import rateLimit from "express-rate-limit";
import { Resend } from "resend";
import { z } from "zod";

// ── Rate limiter: 5 requests per 15 minutes per IP ─────────────────────────────
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: "Too many requests. Please try again after 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
});

// ── Zod schema for contact form ────────────────────────────────────────────────
const ContactSchema = z.object({
  name: z
    .string({ required_error: "Name is required." })
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(100, "Name must be under 100 characters."),

  email: z
    .string({ required_error: "Email is required." })
    .trim()
    .email("Please enter a valid email address."),

  interest: z.enum(["creator", "brand", "other"], {
    errorMap: () => ({ message: "Please select a valid inquiry type." }),
  }),

  message: z
    .string({ required_error: "Message is required." })
    .trim()
    .min(10, "Message must be at least 10 characters.")
    .max(2000, "Message must be under 2000 characters."),
});

// ── HTML escape helper ─────────────────────────────────────────────────────────
const escapeHtml = (str: string): string =>
  str
    .replace(/&/g, "&")
    .replace(/</g, "<")
    .replace(/>/g, ">")
    .replace(/"/g, "\"")
    .replace(/'/g, "&#039;");

const router = Router();

router.post("/contact", contactLimiter, async (req, res) => {
  // ── Zod validation ──────────────────────────────────────────────────────────
  const result = ContactSchema.safeParse(req.body);

  if (!result.success) {
    const issues = result.error.issues.map((i) => ({
      field: i.path[0],
      message: i.message,
    }));
    res.status(400).json({ error: "Validation failed.", issues });
    return;
  }

  const { name, email, interest, message } = result.data;

  const resendApiKey = process.env["RESEND_API_KEY"];
  const fromEmail = process.env["RESEND_FROM_EMAIL"] || "contact@madeoverinfluence.com";
  const receiverEmail = process.env["CONTACT_RECEIVER_EMAIL"] || "info.madeoverinfluence@gmail.com";

  if (!resendApiKey) {
    req.log.error("Resend API key not configured");
    res.status(500).json({ error: "Email service not configured." });
    return;
  }

  const resend = new Resend(resendApiKey);

  const interestLabel =
    interest === "creator"
      ? "Creator seeking management"
      : interest === "brand"
        ? "Brand seeking partnerships"
        : "Other inquiry";

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message);

  const htmlBody = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#ffffff;color:#111111;padding:32px;border:1px solid #e0e0e0;border-radius:8px">
      <h2 style="margin:0 0 24px;font-size:20px;color:#111111">New Contact Form Submission</h2>
      <table style="width:100%;border-collapse:collapse">
        <tr style="border-bottom:1px solid #eeeeee">
          <td style="padding:10px 0;color:#666666;font-size:13px;width:130px">Name</td>
          <td style="padding:10px 0;color:#111111;font-size:15px">${safeName}</td>
        </tr>
        <tr style="border-bottom:1px solid #eeeeee">
          <td style="padding:10px 0;color:#666666;font-size:13px">Email</td>
          <td style="padding:10px 0;color:#111111;font-size:15px"><a href="mailto:${safeEmail}" style="color:#0066FF">${safeEmail}</a></td>
        </tr>
        <tr style="border-bottom:1px solid #eeeeee">
          <td style="padding:10px 0;color:#666666;font-size:13px">Inquiry Type</td>
          <td style="padding:10px 0;color:#111111;font-size:15px">${interestLabel}</td>
        </tr>
      </table>
      <div style="margin-top:24px">
        <p style="color:#666666;font-size:13px;margin-bottom:8px">Message</p>
        <p style="color:#111111;font-size:15px;line-height:1.7;white-space:pre-wrap">${safeMessage}</p>
      </div>
      <hr style="border:none;border-top:1px solid #eeeeee;margin:24px 0"/>
      <p style="color:#999999;font-size:12px;margin:0">Sent from MOI Agency Website</p>
    </div>
  `;

  try {
    await resend.emails.send({
      from: fromEmail,
      to: receiverEmail,
      subject: `New Contact: ${interestLabel} - ${safeName}`,
      html: htmlBody,
    });
    res.status(200).json({ success: true });
  } catch (err) {
    req.log.error({ err }, "Failed to send contact email");
    res.status(500).json({ error: "Failed to send message. Please try again later." });
  }
});

export default router;
