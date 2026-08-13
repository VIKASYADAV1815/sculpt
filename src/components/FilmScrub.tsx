import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Kicker, RevealText } from "./AnimatedText";

/** 05 — In motion: a framed film panel that widens as you scroll, with a marquee caption rail. */
export default function FilmScrub({ src }: { src: string }) {
  const ref = useRef<HTMLElement>(null);
  const vidRef = useRef<HTMLVideoElement>(null);
  const { scrollYProgress } = useScroll({ 
    target: ref, 
    offset: ["start start", "end end"]
  });

  useEffect(() => {
    const el = vidRef.current;
    if (!el) return;
    
    // Preload and play video
    el.load();
    el.play().catch(() => {});
  }, []);

  // Simplified transforms without spring for better performance
  const width = useTransform(scrollYProgress, [0, 0.55], ["34vw", "92vw"]);
  const height = useTransform(scrollYProgress, [0, 0.55], ["46vh", "76vh"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.08, 1]);
  const capX = useTransform(scrollYProgress, [0, 1], ["6vw", "-34vw"]);
  const bar = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const grain = useTransform(scrollYProgress, [0, 0.4], [0.5, 0]);

  return (
    <section ref={ref} className="relative h-[300vh] border-t border-ink/10">
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-x-0 top-8 flex items-start justify-between gap-6 px-6 sm:px-10">
          <Kicker label="05 — In motion" />
          <RevealText className="max-w-[15rem] text-right text-[10px] font-light uppercase leading-relaxed tracking-[0.28em] text-ink-soft">
            Ivory / 24fps — a single pass of raking light across a cured panel.
          </RevealText>
        </div>

        <motion.div
          style={{ width, height }}
          className="relative overflow-hidden rounded-sm border border-ink/12 bg-background will-change-transform"
        >
          <motion.video
            ref={vidRef}
            src={src}
            muted
            loop
            autoPlay
            playsInline
            preload="auto"
            style={{ scale }}
            className="h-full w-full object-cover will-change-transform"
          />
          <div className="pointer-events-none absolute inset-0 bg-background/10" />
          <motion.div 
            style={{ opacity: grain }} 
            className="pointer-events-none absolute inset-0 bg-background/45" 
          />
        </motion.div>

        <motion.p
          style={{ x: capX }}
          className="mt-10 whitespace-nowrap font-display text-[9vw] font-light italic leading-none text-ink/70 will-change-transform sm:text-[3vw]"
        >
          light moves — the plaster answers — light moves — the plaster answers
        </motion.p>

        <div className="absolute inset-x-6 bottom-8 h-px bg-ink/12 sm:inset-x-10">
          <motion.div style={{ width: bar }} className="h-px bg-ink/50" />
        </div>
      </div>
    </section>
  );
}
