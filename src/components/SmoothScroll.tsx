import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function SmoothScroll() {
  useEffect(() => {
    // Register GSAP ScrollTrigger only
    gsap.registerPlugin(ScrollTrigger);

    // Handle anchor link clicks with smooth scroll
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement)?.closest?.('a[href^="#"]') as HTMLAnchorElement | null;
      if (!el) return;
      const id = el.getAttribute("href")!.slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
    };
  }, []);

  return null;
}
