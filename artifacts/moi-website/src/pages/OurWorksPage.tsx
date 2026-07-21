import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion"; 
import { X, Play, ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CustomCursor from "@/components/ui/CustomCursor";
import LoadingScreen from "@/components/ui/LoadingScreen";

gsap.registerPlugin(ScrollTrigger);

const brandDeals = [
  {
    id: 1,
    brand: "Airtel",
    category: "Telecom",
    tag: "Awareness",
    accent: "#FF0099",
    description: "Protecting users from online scams through authentic creator storytelling for Airtel's digital safety initiative.",
    videoSrc: "/videos/airtel-brand-deal.mp4",
  },
  {
    id: 16,
    brand: "TCL P8L",
    category: "Tech",
    tag: "Product Launch",
    accent: "#FF5500",
    description: "TCL's latest P8L launch — creator-native content making the upgrade decision effortless with a punchy, relatable hook.",
    videoSrc: "/videos/tcl-p8l.mp4",
  },
  {
    id: 3,
    brand: "Avimee Herbal",
    category: "Beauty",
    tag: "Brand Awareness",
    accent: "#7755FF",
    description: "Before-after creator content for Avimee Herbal's hair care range driving organic discovery and trust.",
    videoSrc: "/videos/avimee-herbal.mp4",
  },
  {
    id: 4,
    brand: "Swiggy",
    category: "Food",
    tag: "Engagement",
    accent: "#FF0099",
    description: "Emotional storytelling reel featuring a delivery partner's journey — driving massive engagement and brand recall.",
    videoSrc: "/videos/delivery-partner.mp4",
  },
  {
    id: 5,
    brand: "Vodafone-Idea",
    category: "Telecom",
    tag: "Brand Content",
    accent: "#0066FF",
    description: "High-concept cinematic reel — premium content that blends storytelling with brand aesthetics.",
    videoSrc: "/videos/ending-beginning.mp4",
  },
  {
    id: 6,
    brand: "Kavipa",
    category: "Fitness",
    tag: "Performance",
    accent: "#7755FF",
    description: "30-day fitness challenge series promoting muscle gain supplements with health-focused audiences.",
    videoSrc: "/videos/muscle-gains.mp4",
  },
  {
    id: 7,
    brand: "Licious",
    category: "Food",
    tag: "Brand Story",
    accent: "#FF0099",
    description: "Marketing case study reel for Licious breaking down their campaign strategy through creator storytelling.",
    videoSrc: "/videos/licious-campaign.mp4",
  },
  {
    id: 8,
    brand: "Airtel × BTS",
    category: "Entertainment",
    tag: "Viral Content",
    accent: "#0066FF",
    description: "BTS ARMY creator moment — blending K-pop fandom culture with telecom brand recall for massive organic reach.",
    videoSrc: "/videos/airtel-bts.mp4",
  },
  {
    id: 9,
    brand: "Domino's",
    category: "Food",
    tag: "Product Launch",
    accent: "#FF5500",
    description: "Cheese burst product reveal with a twist ending — driving cravings and purchase intent through satisfying content.",
    videoSrc: "/videos/cheese-burst.mp4",
  },
  {
    id: 10,
    brand: "Vodafone-Idea",
    category: "Telecom",
    tag: "Creator Content",
    accent: "#7755FF",
    description: "Polished creator spotlight reel elevating personal brands and driving engagement for top-tier creators.",
    videoSrc: "/videos/creator-video-400.mp4",
  },
  {
    id: 11,
    brand: "Hyphen",
    category: "Beauty",
    tag: "Brand Awareness",
    accent: "#0066FF",
    description: "Pados wali aunty ki borrowing list mein ab @letshyphen Bi-Phasic Serum bhi — relatable creator content driving organic discovery for Hyphen.",
    videoSrc: "/videos/Hyphen.mp4",
  },
  {
    id: 12,
    brand: "Gillette",
    category: "Grooming",
    tag: "Engagement",
    accent: "#FF0099",
    description: "Friend-group relatable reel for Gill — tapping into shared social moments to drive brand recall and aspirational positioning with a young audience.",
    videoSrc: "/videos/gill-brand.mp4",
  },
  {
    id: 13,
    brand: "Zee Marathi",
    category: "Comedy",
    tag: "Viral Content",
    accent: "#7755FF",
    description: "High-engagement Marathi content for Zee Marathi — 'Kunda Aatya is Back' series delivering massive reach through culturally resonant storytelling.",
    videoSrc: "/videos/kunda-aatya.mp4",
  },
  {
    id: 14,
    brand: "Flipkart",
    category: "E-Commerce",
    tag: "Performance",
    accent: "#FF5500",
    description: "High-quality brand integration reel — seamlessly weaving product storytelling into creator content for authentic, non-intrusive brand promotion.",
    videoSrc: "/videos/brand-deal-v1.mp4",
  },
  {
    id: 15,
    brand: "Britannia",
    category: "Food",
    tag: "Brand Awareness",
    accent: "#0066FF",
    description: "In a noisy nutrition landscape, Britannia NutriChoice champions honest marketing — creator-led content cutting through misleading food claims to build real consumer trust.",
    videoSrc: "/videos/Britannia.mp4",
    previewTime: 1.5,
  },
  {
    id: 2,
    brand: "RYZE",
    category: "Wellness",
    tag: "Performance",
    accent: "#0066FF",
    description: "High-energy creator campaign targeting UP audience with relatable regional content and Amazon CTA.",
    videoSrc: "/videos/ryze-brand-deal.mp4",
  },
];



function VideoModal({ deal, onClose }: { deal: typeof brandDeals[0]; onClose: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  useEffect(() => {
    videoRef.current?.play().catch(() => {});
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 flex items-center justify-center z-[9000] p-4 md:p-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="absolute inset-0 bg-black/95 backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />

        <motion.div
          className="relative w-full max-w-xs sm:max-w-sm z-10"
          initial={{ scale: 0.94, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.94, opacity: 0, y: 10 }}
          transition={{ type: "spring", damping: 28, stiffness: 320 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Video */}
          <div
            className="rounded-2xl overflow-hidden relative"
            style={{ boxShadow: `0 0 80px ${deal.accent}30, 0 0 0 1px ${deal.accent}20` }}
          >
            {/* Close button — inside the card */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 z-20 flex items-center justify-center gap-1.5 w-8 h-8 lg:w-auto lg:h-auto lg:px-3 lg:py-1.5 rounded-full bg-black/60 backdrop-blur-sm text-white/70 hover:text-white hover:bg-black/80 transition-all text-xs font-semibold tracking-wider border border-white/10"
            >
              <X size={12} /> <span className="hidden lg:inline">ESC</span>
            </button>

            <video
              ref={videoRef}
              src={`${deal.videoSrc}#t=0.001`}
              className="w-full h-auto block max-h-[80vh]"
              controls
              playsInline
              preload="metadata"
            />

            {/* Bottom bar */}
            <div className="bg-[#0a0a0a] px-5 py-4 flex items-center justify-between border-t border-white/5">
              <div>
                <span
                  className="text-[10px] font-bold tracking-[0.2em] uppercase"
                  style={{ color: deal.accent }}
                >
                  {deal.category} · {deal.tag}
                </span>
                <h3 className="text-base font-black text-white mt-0.5">{deal.brand}</h3>
              </div>
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                style={{ background: `${deal.accent}20`, border: `1px solid ${deal.accent}30` }}
              >
                <Play size={12} fill={deal.accent} color={deal.accent} />
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function useInView(rootMargin = "200px") {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (inView) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.disconnect(); } },
      { rootMargin }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin, inView]);
  return { ref, inView };
}

function VideoCard({
  deal,
  onClick,
  index,
  featured = false,
}: {
  deal: typeof brandDeals[0];
  onClick: () => void;
  index: number;
  featured?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const { ref: cardRef, inView } = useInView("200px");

  // Seek to previewTime after metadata loads to avoid black first frame
  const handleMetadataLoaded = () => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = (deal as typeof deal & { previewTime?: number }).previewTime ?? 0.1;
  };

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (isHovered) {
      v.currentTime = 0;
      v.play().catch(() => {});
    } else {
      v.pause();
      v.currentTime = (deal as typeof deal & { previewTime?: number }).previewTime ?? 0.1;
    }
  }, [isHovered]);

  const num = String(index + 1).padStart(2, "0");

  return (
    <motion.div
      ref={cardRef}
      className="group relative overflow-hidden rounded-2xl cursor-pointer"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: (index % 3) * 0.1, ease: [0.22, 1, 0.36, 1] }}
      style={{ boxShadow: isHovered ? `0 20px 60px ${deal.accent}20` : "none" }}
    >
      {/* Accent border on hover */}
      <div
        className="absolute inset-0 rounded-2xl z-20 pointer-events-none transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          boxShadow: `inset 0 0 0 1px ${deal.accent}50`,
        }}
      />

      {/* Video */}
      <div className={`relative bg-[#0a0a0a] overflow-hidden ${featured ? "aspect-[4/3]" : "aspect-[9/16]"}`}>
        <video
          ref={videoRef}
          src={inView ? `${deal.videoSrc}#t=0.001` : undefined}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          muted
          playsInline
          preload="metadata"
          loop
          onLoadedMetadata={handleMetadataLoaded}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent transition-opacity duration-300" />

        {/* Hover glow overlay */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: `radial-gradient(ellipse at 50% 100%, ${deal.accent}20 0%, transparent 70%)` }}
        />

        {/* Top row */}
          <div className="absolute top-2 left-2 right-2 sm:top-3 sm:left-3 sm:right-3 md:top-4 md:left-4 md:right-4 z-10 flex items-center justify-between gap-1">
          <span
            className="text-[7px] sm:text-[10px] font-bold tracking-[0.06em] sm:tracking-[0.08em] uppercase px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full backdrop-blur-sm whitespace-nowrap shrink-0 max-w-[70%] truncate"
            style={{
              background: `${deal.accent}30`,
              color: deal.accent,
              border: `1px solid ${deal.accent}55`,
              textShadow: `0 0 10px ${deal.accent}40`,
            }}
          >
            {deal.category}
          </span>
          <span className="text-[8px] font-bold text-white/20 tabular-nums shrink-0 hidden sm:block">{num}</span>
        </div>

        {/* Play button — center */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
          <motion.div
            className="w-7 h-7 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-full flex items-center justify-center backdrop-blur-sm"
            style={{
              background: `${deal.accent}30`,
              border: `1.5px solid ${deal.accent}60`,
              boxShadow: isHovered ? `0 0 30px ${deal.accent}50` : `0 0 12px ${deal.accent}20`,
            }}
            animate={{ scale: isHovered ? 1.12 : 1 }}
            transition={{ type: "spring", stiffness: 380, damping: 22 }}
          >
            <Play size={10} className="ml-0.5 sm:hidden" fill="white" color="white" />
            <Play size={16} className="ml-0.5 hidden sm:block" fill="white" color="white" />
          </motion.div>
        </div>

        {/* Bottom info */}
          <div className="absolute bottom-0 left-0 right-0 z-10 p-1.5 sm:p-3 lg:p-5">
          <div className="flex items-end justify-between gap-2">
            <div className="min-w-0">
              <p
                className="text-[9px] sm:text-[10px] font-semibold tracking-widest uppercase mb-0.5 opacity-70 truncate"
                style={{ color: deal.accent }}
              >
                {deal.tag}
              </p>
              <h3 className="text-xs sm:text-lg font-black text-white leading-tight line-clamp-2">{deal.brand}</h3>
            </div>
            <motion.div
              className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-white/10 backdrop-blur flex items-center justify-center shrink-0 border border-white/10"
              animate={{ rotate: isHovered ? 45 : 0 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <ArrowUpRight size={11} className="text-white/60" />
            </motion.div>
          </div>

          {/* Description — always visible on mobile, hover-only on desktop */}
          <p className="text-white/50 text-xs leading-relaxed mt-2 line-clamp-2 sm:hidden">
            {deal.description}
          </p>
          <motion.p
            className="hidden sm:block text-white/50 text-xs leading-relaxed mt-2 line-clamp-2"
            initial={false}
            animate={{ opacity: isHovered ? 1 : 0, height: isHovered ? "auto" : 0 }}
            transition={{ duration: 0.25 }}
          >
            {deal.description}
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
}

export default function OurWorksPage() {
  const [, navigate] = useLocation();
  const [activeModal, setActiveModal] = useState<typeof brandDeals[0] | null>(null);
  
  const [loaded, setLoaded] = useState(() => {
    // If true, it's the initial load, so skip React loader (loaded = true).
    // If false, it's a navigation, so show React loader (loaded = false).
    return !!(window as any).IS_INITIAL_LOAD;
  });

  useEffect(() => {
    if ((window as any).IS_INITIAL_LOAD) {
      const finishLoader = () => {
        const staticLoader = document.getElementById("static-loader");
        if (staticLoader) {
          staticLoader.dataset.done = "true";
          staticLoader.style.transition = "opacity 0.6s ease-in-out, transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)";
          staticLoader.style.opacity = "0";
          staticLoader.style.transform = "translateY(-100%)";
          setTimeout(() => {
            staticLoader.remove();
            (window as any).IS_INITIAL_LOAD = false;
          }, 600);
        } else {
          (window as any).IS_INITIAL_LOAD = false;
        }
      };

      if ((window as any).MIN_LOADER_DONE) {
        finishLoader();
      } else {
        (window as any).ON_MIN_LOADER_DONE = finishLoader;
      }
    }
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-[#050505] min-h-screen text-foreground selection:bg-[#0066FF] selection:text-white">
      {!loaded && <LoadingScreen onComplete={() => setLoaded(true)} />}
      <CustomCursor />
      <Navbar isStaticPage />

      <main className="pt-20 sm:pt-28 pb-16 sm:pb-24">

        {/* ── Hero ── */}
        <div className="container mx-auto px-4 md:px-8 mb-10 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-6 md:mb-8">
              <div className="w-6 h-[1.5px] bg-[#FF0099]" />
              <span className="text-[11px] font-bold tracking-[0.3em] uppercase text-[#FF0099]">
                Our Works
              </span>
            </div>

            <h1 className="text-3xl sm:text-6xl md:text-8xl font-black leading-[1.0] tracking-tight text-white mb-6">
              Work That
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0066FF] via-[#7755FF] to-[#FF0099]">
                Speaks Louder.
              </span>
            </h1>

            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mt-8 pt-8 border-t border-white/5">
              <p className="text-white/35 text-sm sm:text-base max-w-sm leading-relaxed font-light">
                Real campaigns. Real creators. Real results — every frame tells a story of influence.
              </p>
              <div className="flex gap-6 sm:gap-10 shrink-0">
                {[
                  { value: "80M+", label: "Total Views" },
                  { value: "45+", label: "Brands" },
                  { value: "100+", label: "Creators" },
                ].map((s) => (
                  <div key={s.label}>
                    <div className="text-xl sm:text-3xl font-black text-white">{s.value}</div>
                    <div className="text-[9px] sm:text-[10px] text-white/25 uppercase tracking-widest mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── Brand Ticker ── */}
        <div className="relative overflow-hidden border-y border-white/5 py-4 mb-10 md:mb-16">
          <div className="flex animate-marquee whitespace-nowrap">
            {[...Array(3)].flatMap(() => [
              "Airtel", "·", "Licious", "·", "RYZE", "·", "Avimee Herbal", "·",
              "Airtel × BTS", "·", "Fitness Brand", "·", "Food Brand", "·", "Creator Collab", "·",
            ]).map((item, i) => (
              <span
                key={i}
                className={
                  item === "·"
                    ? "mx-4 text-white/10 text-sm"
                    : "mx-6 text-[11px] font-bold tracking-[0.25em] uppercase text-white/20 hover:text-white/60 transition-colors duration-300"
                }
              >
                {item}
              </span>
            ))}
          </div>
          {/* Fade edges */}
          <div className="absolute inset-y-0 left-0 w-20 pointer-events-none" style={{ background: "linear-gradient(90deg, #050505, transparent)" }} />
          <div className="absolute inset-y-0 right-0 w-20 pointer-events-none" style={{ background: "linear-gradient(270deg, #050505, transparent)" }} />
        </div>

        {/* ── Grid ── */}
        <div className="container mx-auto px-4 md:px-8">
          {/* Ambient glows */}
          <div className="relative">
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(0,102,255,0.04) 0%, transparent 70%)" }} />
            <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(255,0,153,0.04) 0%, transparent 70%)" }} />

            <div className="columns-3 gap-1.5 md:gap-3 lg:gap-5 space-y-1.5 md:space-y-3 lg:space-y-5">
              {brandDeals.map((deal, i) => (
                <div key={deal.id} className="break-inside-avoid">
                  <VideoCard
                    deal={deal}
                    index={i}
                    onClick={() => setActiveModal(deal)}
                    featured={i === 0 || deal.id === 6}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Campaign & Impact ── */}
        <div className="container mx-auto px-4 md:px-8 mt-20 md:mt-32">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mb-12 text-center"
          >
            <p className="text-[11px] font-bold tracking-[0.35em] uppercase text-[#0066FF]/70 mb-3">Numbers That Matter</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white">
              Campaign{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0066FF] to-[#FF0099]">
                Impact
              </span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[
              { brand: "Vi Network",    reach: "40M+",   engagement: "13M+",  accent: "#FF0099" },
              { brand: "Airtel",        reach: "1.5M",   engagement: "25K+",  accent: "#0066FF" },
              { brand: "Jar App",       reach: "4M+",    engagement: "171K+", accent: "#0099FF" },
              { brand: "Unicorn Store", reach: "8.3M+",  engagement: "394K+", accent: "#7755FF" },
            ].map((item, i) => (
              <motion.div
                key={item.brand}
                custom={i}
                initial={{ opacity: 0, y: 50, scale: 0.92, filter: "blur(8px)" }}
                whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                whileHover={{ y: -8, scale: 1.02, transition: { type: "spring", stiffness: 280, damping: 22 } }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.65, delay: i * 0.13, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-2xl p-6 md:p-8 border border-white/5 relative overflow-hidden group cursor-default"
                style={{ background: "linear-gradient(135deg, #0d0d0d 0%, #111111 100%)" }}
              >
                {/* Base radial glow */}
                <div className="absolute inset-0 pointer-events-none transition-opacity duration-300" style={{ background: `radial-gradient(ellipse at top left, ${item.accent}10 0%, transparent 60%)` }} />

                {/* Hover — enhanced bottom glow */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
                  style={{ background: `radial-gradient(ellipse at 50% 110%, ${item.accent}22 0%, transparent 65%)` }}
                />

                {/* Hover — accent border */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{ boxShadow: `inset 0 0 0 1px ${item.accent}50, 0 20px 60px ${item.accent}18` }}
                />

                <p className="relative text-xs font-bold tracking-[0.25em] uppercase mb-5 transition-colors duration-300" style={{ color: item.accent }}>{item.brand}</p>
                <div className="relative grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-2xl md:text-3xl font-black text-white leading-none group-hover:text-white transition-colors duration-300">{item.reach}</p>
                    <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-white/30 mt-2 group-hover:text-white/50 transition-colors duration-300">Campaign Reach</p>
                  </div>
                  <div>
                    <p className="text-2xl md:text-3xl font-black text-white leading-none group-hover:text-white transition-colors duration-300">{item.engagement}</p>
                    <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-white/30 mt-2 group-hover:text-white/50 transition-colors duration-300">Total Engagement</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── CTA strip ── */}
        <div className="container mx-auto px-4 md:px-8 mt-16 md:mt-28">
          <motion.div
            className="relative rounded-2xl md:rounded-3xl overflow-hidden border border-white/5 p-8 sm:p-12 md:p-16 text-center"
            style={{ background: "linear-gradient(135deg, #0a0a0a 0%, #0d0a18 50%, #0a0a0a 100%)" }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 0%, #7755FF15 0%, transparent 60%)" }} />
            <p className="text-[11px] font-bold tracking-[0.3em] uppercase text-white/30 mb-4">Ready to create impact?</p>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-white mb-6 sm:mb-8">
              Let's Build Your
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0066FF] to-[#FF0099]">
                Next Campaign.
              </span>
            </h2>
            <button
              onClick={() => {
                navigate("/");
                setTimeout(() => {
                  document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
                }, 300);
              }}
              className="inline-flex items-center gap-2 h-13 px-8 py-3.5 rounded-full bg-white text-[#050505] text-sm font-black tracking-wide hover:bg-white/90 transition-colors"
            >
              Work With MOI <ArrowUpRight size={15} />
            </button>
          </motion.div>
        </div>
      </main>

      <Footer />

      {activeModal && (
        <VideoModal deal={activeModal} onClose={() => setActiveModal(null)} />
      )}
    </div>
  );
}
