import { useEffect, useLayoutEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import video1 from "@localassets/homepage_video_1.mp4";
import video2 from "@localassets/homepage_video_2.mp4";
import video3 from "@localassets/homepage_video_3.mp4";

gsap.registerPlugin(ScrollTrigger);

// ─── Stats data (unchanged) ───────────────────────────────────────────────────
const stats = [
  {
    value: "70M+",
    label: "Reach",
    accent: "#0066FF",
    desc: "Combined audience across all creator platforms",
  },
  {
    value: "40+",
    label: "Brands",
    accent: "#FF0099",
    desc: "Trusted brand partners we've collaborated with",
  },
  {
    value: "70+",
    label: "Creators Empowered",
    accent: "#7755FF",
    desc: "Talented creators growing under our management",
  },
];

// ─── Card content (same 3 videos) ────────────────────────────────────────────
const CARDS = [
  { id: 0, video: video1, accent: "#0066FF", glow: "rgba(0,102,255,0.35)" },
  { id: 1, video: video2, accent: "#7755FF", glow: "rgba(119,85,255,0.35)" },
  { id: 2, video: video3, accent: "#FF0099", glow: "rgba(255,0,153,0.35)" },
];

// ─── Slot types & style configs ───────────────────────────────────────────────
type SlotName = "leftNear" | "center" | "rightNear";

interface SlotStyle {
  x: number;
  scale: number;
  rotate: number;
  zIndex: number;
  opacity: number;
  brightness: number;
}

const SLOT_STYLES_DESKTOP: Record<SlotName, SlotStyle> = {
  leftNear:  { x: -130, scale: 1.0, rotate: -10, zIndex: 30, opacity: 0.85, brightness: 0.6  },
  center:    { x: 0,    scale: 1.0, rotate: 0,   zIndex: 50, opacity: 1,    brightness: 1.0  },
  rightNear: { x: 130,  scale: 1.0, rotate: 10,  zIndex: 30, opacity: 0.85, brightness: 0.6  },
};

const SLOT_STYLES_MOBILE: Record<SlotName, SlotStyle> = {
  leftNear:  { x: -50,  scale: 1.0, rotate: -7, zIndex: 30, opacity: 0.85, brightness: 0.6  },
  center:    { x: 0,    scale: 1.0, rotate: 0,  zIndex: 50, opacity: 1,    brightness: 1.0  },
  rightNear: { x: 50,   scale: 1.0, rotate: 7,  zIndex: 30, opacity: 0.85, brightness: 0.6  },
};

// Initial slot assignment: card id → slot
const INITIAL_SLOT_ASSIGNMENT: Record<SlotName, number> = {
  leftNear:  0,
  center:    1,
  rightNear: 2,
};

// ─── VideoCard component ──────────────────────────────────────────────────────
interface VideoCardProps {
  card: (typeof CARDS)[0];
  slot: SlotName;
  cardH: number;
  cardW: number;
  slotStyles: Record<SlotName, SlotStyle>;
  isMobile: boolean;
  onClick: () => void;
}

function VideoCard({ card, slot, cardH, cardW, slotStyles, isMobile, onClick }: VideoCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const isCenter = slot === "center";
  const s = slotStyles[slot];

  // Play / pause based on center state
  useEffect(() => {
    if (!videoRef.current) return;
    if (isCenter) {
      videoRef.current.play().catch(() => {});
    } else {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [isCenter]);

  return (
    <div
      role="button"
      tabIndex={isCenter ? -1 : 0}
      aria-label={isCenter ? "Currently focused video" : "Click to bring this video to focus"}
      onClick={isCenter ? undefined : onClick}
      onKeyDown={(e) => {
        if (!isCenter && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onClick();
        }
      }}
      style={{
        // Centering: placed at left:50%, offset by half card width
        position: "absolute",
        left: "50%",
        top: 0,
        width: cardW,
        height: cardH,
        marginLeft: -cardW / 2,
        // Animated transform driven by slot
        transform: `translateX(${s.x}px) scale(${s.scale}) rotate(${s.rotate}deg)`,
        transformOrigin: isMobile ? "center" : "bottom center",
        zIndex: s.zIndex,
        opacity: s.opacity,
        filter: `brightness(${s.brightness})`,
        // Smooth transition
        transition:
          "transform 0.52s cubic-bezier(0.34, 1.4, 0.64, 1), opacity 0.45s ease, filter 0.45s ease, z-index 0s",
        cursor: isCenter ? "default" : "pointer",
        outline: "none",
      }}
    >
      {/* Card shell */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 24,
          overflow: "hidden",
          background: "linear-gradient(160deg, #141418 0%, #0c0c10 100%)",
          border: `1.5px solid ${card.accent}${isCenter ? "55" : "30"}`,
          boxShadow: isCenter
            ? `0 24px 70px rgba(0,0,0,0.85), 0 0 0 1px ${card.accent}18, inset 0 1px 0 rgba(255,255,255,0.08), 0 0 90px ${card.glow}`
            : `0 12px 40px rgba(0,0,0,0.65), 0 0 0 1px ${card.accent}10, inset 0 1px 0 rgba(255,255,255,0.04)`,
          transition: "border-color 0.45s ease, box-shadow 0.45s ease",
        }}
      >
        {/* Video */}
        <video
          ref={videoRef}
          src={card.video}
          muted
          loop
          playsInline
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />

        {/* Glow radial overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            borderRadius: 24,
            background: `radial-gradient(ellipse at 50% -10%, ${card.glow} 0%, transparent 60%)`,
            opacity: isCenter ? 1 : 0.5,
            transition: "opacity 0.45s ease",
          }}
        />

        {/* Top shimmer line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 20,
            right: 20,
            height: 1.5,
            borderRadius: 999,
            background: `linear-gradient(90deg, transparent, ${card.accent}90, transparent)`,
          }}
        />

        {/* Play icon on side cards */}
        {!isCenter && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(0,0,0,0.12)",
              borderRadius: 24,
              transition: "background 0.3s ease",
            }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.12)",
                backdropFilter: "blur(6px)",
                border: "1px solid rgba(255,255,255,0.22)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: `0 4px 16px rgba(0,0,0,0.4)`,
              }}
            >
              <svg width="13" height="15" viewBox="0 0 13 15" fill="none">
                <path d="M1 1.5L12 7.5L1 13.5V1.5Z" fill="white" />
              </svg>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Impact section ──────────────────────────────────────────────────────
export default function Impact() {
  const sectionRef  = useRef<HTMLDivElement>(null);
  const leftRef     = useRef<HTMLDivElement>(null);
  const rightRef    = useRef<HTMLDivElement>(null);
  const statsRef    = useRef<(HTMLDivElement | null)[]>([]);
  const carouselRef = useRef<HTMLDivElement>(null);

  const [slotAssignment, setSlotAssignment] =
    useState<Record<SlotName, number>>(INITIAL_SLOT_ASSIGNMENT);
  // Lazy initializers — correct on first render, avoids isMobile re-render flash
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );
  const [screenW, setScreenW] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth : 390
  );
  const isAnimating = useRef(false);

  // Responsive detection
  useEffect(() => {
    const check = () => {
      setIsMobile(window.innerWidth < 768);
      setScreenW(window.innerWidth);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // ── Swap logic ──────────────────────────────────────────────────────────────
  const handleCardClick = useCallback((clickedSlot: SlotName) => {
    if (clickedSlot === "center" || isAnimating.current) return;

    isAnimating.current = true;

    setSlotAssignment((prev) => {
      const next = { ...prev };
      const clickedCardId = prev[clickedSlot];
      const centerCardId  = prev["center"];
      next["center"]      = clickedCardId;
      next[clickedSlot]   = centerCardId;
      return next;
    });

    // Release lock after transition completes
    setTimeout(() => { isAnimating.current = false; }, 580);
  }, []);

  // ── GSAP entry animation (useLayoutEffect → runs before paint, no flash) ────
  useLayoutEffect(() => {
    if (!sectionRef.current) return;

    gsap.set(leftRef.current,    { x: -40, opacity: 0 });
    gsap.set(rightRef.current,   { x: 60,  opacity: 0 });
    statsRef.current.forEach((el) => el && gsap.set(el, { y: 40, opacity: 0 }));
    if (carouselRef.current) gsap.set(carouselRef.current, { y: 50, opacity: 0, scale: 0.9 });

    const tl = gsap.timeline({
      scrollTrigger: { trigger: sectionRef.current, start: "top 70%", once: true },
    });

    tl
      .to(leftRef.current, { x: 0, opacity: 1, duration: 0.9, ease: "power3.out" }, 0.1)
      .to(
        statsRef.current.filter(Boolean),
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.15, ease: "power3.out" },
        0.25,
      )
      .to(rightRef.current, { x: 0, opacity: 1, duration: 0.9, ease: "power3.out" }, 0.3)
      .to(
        carouselRef.current,
        { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.3)" },
        0.5,
      );

    return () => { tl.kill(); };
  }, []);

  // ── Derived values ────────────────────────────────────────────────────────────
  // Invert slotAssignment → cardId : slotName
  const cardSlots: Record<number, SlotName> = {};
  (Object.keys(slotAssignment) as SlotName[]).forEach((slot) => {
    cardSlots[slotAssignment[slot]] = slot;
  });

  const slotStyles = isMobile ? SLOT_STYLES_MOBILE : SLOT_STYLES_DESKTOP;
  const sideOffset = Math.abs(slotStyles.leftNear.x);
  // Mobile: fit card width to available screen width (px-4 = 16px each side)
  const mobileCardW = Math.max(140, screenW - 32 - sideOffset * 2 - 32);
  const CARD_H = isMobile ? Math.round(mobileCardW * 16 / 9) : 520;
  const CARD_W = isMobile ? mobileCardW : Math.round(520 * 9 / 16);
  const containerW = sideOffset * 2 + CARD_W + 32;
  const containerH = CARD_H + (isMobile ? 40 : 72); // extra room for rotation overflow

  return (
    <section
      id="impact"
      ref={sectionRef}
      className="py-16 sm:py-20 md:py-28 lg:py-36 bg-[#0a0a0a] relative overflow-hidden"
    >
      {/* Ambient glows */}
      <div
        className="absolute top-0 left-0 w-[600px] h-[600px] bg-[#0066FF] rounded-full mix-blend-screen pointer-events-none"
        style={{ filter: "blur(160px)", opacity: 0.05 }}
      />
      <div
        className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#7755FF] rounded-full mix-blend-screen pointer-events-none"
        style={{ filter: "blur(140px)", opacity: 0.06 }}
      />

      {/* Background watermark */}
      <div
        className="absolute inset-0 flex items-center justify-center select-none pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        <span
          style={{
            color: "rgba(255,255,255,0.025)",
            fontSize: "clamp(80px,16vw,220px)",
            fontWeight: 900,
            lineHeight: 1,
            letterSpacing: "-0.02em",
          }}
        >
          IMPACT
        </span>
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="flex flex-col md:flex-row gap-10 md:gap-10 lg:gap-20 md:items-start">

          {/* ── Left col: stats (unchanged) ─────────────────────────────────── */}
          <div ref={leftRef} className="md:w-1/2 w-full">
            <p className="text-xs font-semibold tracking-[0.3em] uppercase text-[#0066FF] mb-6">
              Our Impact
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-black leading-[1.05] mb-6 text-white">
              Numbers That<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0066FF] to-[#7755FF]">
                Speak
              </span>
            </h2>
            <div
              className="w-16 h-[3px] rounded-full mb-8 md:mb-10"
              style={{ background: "linear-gradient(90deg, #0066FF, #7755FF)" }}
            />

            <div className="space-y-4">
              {stats.map((stat, i) => (
                <div
                  key={i}
                  ref={(el) => { statsRef.current[i] = el; }}
                  className="flex items-center gap-4 md:gap-6 bg-[#0d0d0d] border border-white/5 rounded-2xl p-4 md:p-6 hover:border-white/10 transition-all duration-300"
                >
                  <div
                    className="shrink-0 w-1 h-12 md:h-14 rounded-full"
                    style={{ background: stat.accent }}
                  />
                  <div>
                    <div
                      className="text-3xl md:text-4xl lg:text-5xl font-black leading-none mb-1"
                      style={{ color: stat.accent }}
                    >
                      {stat.value}
                    </div>
                    <div className="text-white font-semibold text-base md:text-lg mb-0.5">
                      {stat.label}
                    </div>
                    <div className="text-white/40 text-xs md:text-sm font-light">
                      {stat.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right col: interactive carousel ─────────────────────────────── */}
          <div
            ref={rightRef}
            className="md:w-1/2 w-full flex items-center justify-center lg:pt-[220px]"
          >
            <div
              ref={carouselRef}
              style={{
                position: "relative",
                width: containerW,
                height: containerH,
                // opacity intentionally NOT set here — GSAP owns opacity
              }}
            >
              {CARDS.map((card) => {
                const slot = cardSlots[card.id];
                return (
                  <VideoCard
                    key={card.id}
                    card={card}
                    slot={slot}
                    cardH={CARD_H}
                    cardW={CARD_W}
                    slotStyles={slotStyles}
                    isMobile={isMobile}
                    onClick={() => handleCardClick(slot)}
                  />
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
