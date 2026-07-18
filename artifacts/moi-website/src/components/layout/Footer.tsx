const moiLogo = "/moi-logo-transparent.png";
import { Instagram, Linkedin, Mail, Phone } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="bg-[#030303] border-t border-white/5 pt-12 sm:pt-16 md:pt-20 pb-8 sm:pb-10">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Main grid: 1 col mobile, 2 col tablet, 12-col desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 sm:gap-10 md:gap-12 mb-10 sm:mb-14 md:mb-16">

          {/* Brand col */}
          <div className="md:col-span-2 lg:col-span-5 lg:col-start-1">
            <img src={moiLogo} alt="MOI Logo" className="h-8 sm:h-10 mb-4 sm:mb-6" data-testid="img-footer-logo" />
            <p className="text-white/40 max-w-sm font-light leading-relaxed text-xs sm:text-sm mb-6 sm:mb-8">
              A creator-first talent management and influencer marketing agency built to scale long-term creator careers not just close one-off campaigns.
            </p>
            <div className="flex items-center gap-3 sm:gap-4">
              <a
                href="https://www.instagram.com/madeoverinfluence"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-[#FF0099] hover:border-[#FF0099]/30 hover:bg-[#FF0099]/5 transition-all"
                data-testid="link-footer-instagram"
                aria-label="Instagram"
              >
                <Instagram size={15} />
              </a>
              <a
                href="https://www.linkedin.com/company/madeoverinfluence/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-[#0066FF] hover:border-[#0066FF]/30 hover:bg-[#0066FF]/5 transition-all"
                data-testid="link-footer-linkedin"
                aria-label="LinkedIn"
              >
                <Linkedin size={15} />
              </a>
              <a
                href="https://wa.me/918828031506"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-[#25D366] hover:border-[#25D366]/30 hover:bg-[#25D366]/5 transition-all"
                data-testid="link-footer-whatsapp"
                aria-label="WhatsApp"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 lg:col-span-3 md:col-start-7 lg:col-start-7">
            <h4 className="text-white font-bold mb-4 sm:mb-6 text-xs sm:text-sm tracking-widest uppercase">Quick Links</h4>
            <ul className="space-y-3 sm:space-y-4">
              {[
                { label: "About Us", id: "#about" },
                { label: "Services", id: "#services" },
                { label: "Creators", id: "#creators" },
                { label: "Our Works", id: "#our-works" },
                { label: "Partners", id: "#partners" },
                { label: "Contact", id: "#contact" },
              ].map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => scrollTo(link.id)}
                    className="text-white/40 hover:text-white transition-colors text-xs sm:text-sm cursor-pointer"
                    data-testid={`link-footer-${link.label.toLowerCase().replace(/\s/g, '-')}`}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-3 lg:col-span-3 md:col-start-10 lg:col-start-10">
            <h4 className="text-white font-bold mb-4 sm:mb-6 text-xs sm:text-sm tracking-widest uppercase">Contact</h4>
            <ul className="space-y-4 sm:space-y-5">
              <li>
                <a
                  href="mailto:surajsaboji@madeoverinfluence.com"
                  className="flex items-start gap-3 text-white/40 hover:text-white transition-colors group"
                  data-testid="link-footer-email"
                >
                  <Mail size={14} className="shrink-0 mt-0.5 group-hover:text-[#0066FF] transition-colors" />
                  <span className="text-xs sm:text-sm leading-relaxed break-all">surajsaboji@madeoverinfluence.com</span>
                </a>
              </li>
              <li>
                <a
                  href="tel:+918828031506"
                  className="flex items-center gap-3 text-white/40 hover:text-white transition-colors group"
                  data-testid="link-footer-phone"
                >
                  <Phone size={14} className="shrink-0 group-hover:text-[#FF0099] transition-colors" />
                  <span className="text-xs sm:text-sm">+91 88280 31506</span>
                </a>
              </li>
              <li className="text-white/40 text-xs sm:text-sm">
                Mumbai, India
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          <p className="text-[10px] sm:text-xs text-white/25 text-center sm:text-left">
            &copy; {currentYear} MadeOverInfluence (MOI). All rights reserved.
          </p>
          <p className="text-[10px] sm:text-xs text-white/20">
            Suraj Saboji — Founder
          </p>
        </div>
      </div>
    </footer>
  );
}
