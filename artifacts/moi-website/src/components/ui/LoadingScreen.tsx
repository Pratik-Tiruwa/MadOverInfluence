import { useEffect, useRef } from "react";
import gsap from "gsap";
const moiLogo = "/moi-logo-transparent.png";

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const counterNumberRef = useRef<HTMLSpanElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // We use a dummy object to tween a value from 0 to 100
    const progress = { value: 0 };

    const tl = gsap.timeline({
      onComplete: () => {
        // Wait a tiny bit after reaching 100%, then slide up
        gsap.to(containerRef.current, {
          yPercent: -100,
          duration: 0.6,
          ease: "power4.inOut",
          delay: 0.1,
          onComplete: () => {
            onComplete();
          }
        });
      }
    });

    tl.to(progress, {
      value: 100,
      duration: 0.8,
      ease: "power2.inOut", // smooth easing for the loading bar
      onUpdate: () => {
        const currentValue = Math.floor(progress.value);
        if (counterNumberRef.current) {
          counterNumberRef.current.textContent = currentValue.toString();
        }
        if (progressBarRef.current) {
          progressBarRef.current.style.width = `${currentValue}%`;
        }
      }
    });

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-x-0 top-0 z-[9999] bg-[#050505] flex flex-col items-center justify-center overflow-hidden will-change-transform"
      style={{ height: '100dvh' }}
      data-testid="loading-screen"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Optimized glows without heavy blur filters */}
        <div 
          className="absolute top-1/3 -left-1/4 w-[120vw] max-w-[800px] aspect-square rounded-full opacity-10" 
          style={{ background: 'radial-gradient(circle, #0066FF 0%, transparent 60%)' }}
        />
        <div 
          className="absolute bottom-1/3 -right-1/4 w-[120vw] max-w-[800px] aspect-square rounded-full opacity-10" 
          style={{ background: 'radial-gradient(circle, #FF0099 0%, transparent 60%)' }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center w-full max-w-lg px-8">
        <img
          src={moiLogo}
          alt="MOI"
          className="h-14 mb-16 opacity-90"
        />

        <div className="w-full mb-6">
          <div className="h-[1px] w-full bg-white/10 relative overflow-hidden rounded-full">
            <div
              ref={progressBarRef}
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-[#0066FF] to-[#FF0099] rounded-full"
              style={{ width: "0%" }}
            />
          </div>
        </div>

        <div className="flex items-end justify-between w-full">
          <span className="text-xs text-white/30 tracking-[0.3em] uppercase font-medium">Loading</span>
          <span className="text-4xl font-black text-white tabular-nums">
            <span ref={counterNumberRef}>0</span><span className="text-[#0066FF]">%</span>
          </span>
        </div>

        <p className="mt-12 text-white/20 text-xs tracking-[0.5em] uppercase">
          MadeOverInfluence
        </p>
      </div>
    </div>
  );
}
