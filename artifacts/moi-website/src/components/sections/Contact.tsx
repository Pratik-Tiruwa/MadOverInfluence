import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// ── Zod schema (mirrors backend) ──────────────────────────────────────────────
const ContactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(100, "Name must be under 100 characters."),
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address."),
  interest: z.enum(["creator", "brand", "other"]),
  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters.")
    .max(2000, "Message must be under 2000 characters."),
});

type ContactFields = z.infer<typeof ContactSchema>;
type FieldErrors = Partial<Record<keyof ContactFields, string>>;

export default function Contact() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const clearError = (field: keyof ContactFields) =>
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFieldErrors({});

    const form = e.target as HTMLFormElement;
    const raw = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      interest: (form.elements.namedItem("interest") as HTMLSelectElement).value as ContactFields["interest"],
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
    };

    // ── Client-side Zod validation ────────────────────────────────────────────
    const parsed = ContactSchema.safeParse(raw);
    if (!parsed.success) {
      const errs: FieldErrors = {};
      parsed.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof ContactFields;
        if (!errs[field]) errs[field] = issue.message;
      });
      setFieldErrors(errs);
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({})) as { error?: string; issues?: { field: string; message: string }[] };

        // Map backend field-level errors back to inline messages
        if (err.issues && err.issues.length > 0) {
          const errs: FieldErrors = {};
          err.issues.forEach(({ field, message }) => {
            errs[field as keyof ContactFields] = message;
          });
          setFieldErrors(errs);
          setIsSubmitting(false);
          return;
        }

        throw new Error(err.error ?? "Something went wrong.");
      }

      toast({
        title: "Message Sent!",
        description: "We'll get back to you within 24 hours.",
      });
      form.reset();
    } catch (err) {
      toast({
        title: "Failed to send",
        description: err instanceof Error ? err.message : "Please try again or email us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <section id="contact" className="py-16 sm:py-20 md:py-24 lg:py-32 bg-[#0a0a0a] relative">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row gap-10 sm:gap-14 lg:gap-24">
          
          {/* Info */}
          <div className="md:w-5/12 lg:w-5/12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
              Let's Build <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0066FF] to-[#FF0099]">
                Something Bigger
              </span>
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-foreground/70 mb-8 sm:mb-12 font-light">
              Whether you're a creator looking for representation or a brand seeking impactful partnerships, we're ready to talk.
            </p>

            <div className="space-y-5 sm:space-y-8">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-[#0066FF]" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-foreground/50 mb-1">Email Us</p>
                  <a href="mailto:surajsaboji@madeoverinfluence.com" className="text-sm sm:text-base md:text-lg font-medium text-white hover:text-[#0066FF] transition-colors break-all">
                    surajsaboji@madeoverinfluence.com
                  </a>
                </div>
              </div>
              


              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-foreground/50 mb-1">Location</p>
                  <p className="text-base sm:text-lg font-medium text-white">
                    Mumbai, India
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 sm:mt-12 p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-[#0066FF]/10 to-[#FF0099]/10 border border-white/5">
              <p className="text-xs sm:text-sm font-medium text-white mb-1 sm:mb-2">Direct Contact:</p>
              <p className="text-base sm:text-lg font-bold">Suraj Saboji</p>
              <p className="text-foreground/60 text-xs sm:text-sm">Founder &amp; CEO</p>
            </div>
          </div>

          {/* Form */}
          <div className="md:w-7/12 lg:w-7/12">
            <div className="bg-[#111111] p-5 sm:p-8 md:p-12 rounded-2xl sm:rounded-3xl border border-white/5">
              <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-xs sm:text-sm font-medium text-foreground/80">Full Name</label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      onChange={() => clearError("name")}
                      className={`bg-[#0a0a0a] h-11 sm:h-12 text-sm transition-colors ${
                        fieldErrors.name
                          ? "border-red-500 focus:border-red-500"
                          : "border-white/10 focus:border-[#0066FF]"
                      }`}
                    />
                    {fieldErrors.name && (
                      <p className="text-xs text-red-400 mt-1">{fieldErrors.name}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-xs sm:text-sm font-medium text-foreground/80">Email Address</label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      onChange={() => clearError("email")}
                      className={`bg-[#0a0a0a] h-11 sm:h-12 text-sm transition-colors ${
                        fieldErrors.email
                          ? "border-red-500 focus:border-red-500"
                          : "border-white/10 focus:border-[#0066FF]"
                      }`}
                    />
                    {fieldErrors.email && (
                      <p className="text-xs text-red-400 mt-1">{fieldErrors.email}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="interest" className="text-xs sm:text-sm font-medium text-foreground/80">I am a...</label>
                  <select
                    id="interest"
                    onChange={() => clearError("interest")}
                    className="flex h-11 sm:h-12 w-full items-center justify-between rounded-md border border-white/10 bg-[#0a0a0a] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent text-white"
                  >
                    <option value="creator">Creator seeking management</option>
                    <option value="brand">Brand seeking partnerships</option>
                    <option value="other">Other inquiry</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-xs sm:text-sm font-medium text-foreground/80">Message</label>
                  <Textarea
                    id="message"
                    placeholder="Tell us about your goals..."
                    onChange={() => clearError("message")}
                    className={`bg-[#0a0a0a] min-h-[120px] sm:min-h-[150px] resize-none text-sm transition-colors ${
                      fieldErrors.message
                        ? "border-red-500 focus:border-red-500"
                        : "border-white/10 focus:border-[#0066FF]"
                    }`}
                  />
                  {fieldErrors.message && (
                    <p className="text-xs text-red-400 mt-1">{fieldErrors.message}</p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full h-12 sm:h-14 bg-gradient-to-r from-[#0066FF] to-[#FF0099] text-white font-bold text-base sm:text-lg hover:opacity-90 transition-opacity mt-2 sm:mt-4 group"
                  data-testid="button-submit-contact"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                  {!isSubmitting && <Send className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />}
                </Button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
