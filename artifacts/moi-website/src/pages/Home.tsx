import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Services from "@/components/sections/Services";
import Impact from "@/components/sections/Impact";
import Creators from "@/components/sections/Creators";
import Partners from "@/components/sections/Partners";
import Contact from "@/components/sections/Contact";
import OurWorks from "@/components/sections/OurWorks";
import CustomCursor from "@/components/ui/CustomCursor";
import LoadingScreen from "@/components/ui/LoadingScreen";

export default function Home() {
  const [loaded, setLoaded] = useState(() => {
    // If true, it's the initial load, so skip React loader (loaded = true).
    // If false, it's a navigation, so show React loader (loaded = false).
    return !!(window as any).IS_INITIAL_LOAD;
  });

  useEffect(() => {
    if ((window as any).IS_INITIAL_LOAD) {
      const staticLoader = document.getElementById("static-loader");
      if (staticLoader) {
        staticLoader.dataset.done = "true";
        const percent = staticLoader.querySelector('.static-percent');
        const fill = staticLoader.querySelector('.static-progress-fill') as HTMLElement;
        if (percent) percent.innerHTML = '100<span>%</span>';
        if (fill) fill.style.width = '100%';

        // Smoothly exit the static loader (similar to custom loader's slide up)
        setTimeout(() => {
          staticLoader.style.transition = "opacity 0.6s ease-in-out, transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)";
          staticLoader.style.opacity = "0";
          staticLoader.style.transform = "translateY(-100%)";
          setTimeout(() => {
            staticLoader.remove();
            (window as any).IS_INITIAL_LOAD = false;
          }, 600);
        }, 100);
      } else {
        (window as any).IS_INITIAL_LOAD = false;
      }
    }
  }, []);

  return (
    <div className="bg-[#050505] min-h-screen text-foreground selection:bg-[#0066FF] selection:text-white">
      {!loaded && <LoadingScreen onComplete={() => setLoaded(true)} />}
      <CustomCursor />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Services />
        <Impact />
        <Creators />
        <Partners />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
