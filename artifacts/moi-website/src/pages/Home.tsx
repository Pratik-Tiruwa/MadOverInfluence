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
