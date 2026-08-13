import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { Kicker, RevealText } from "./AnimatedText";

const TEXT =
  "Plaster remembers everything — the hand, the hour, the hesitation. We do not decorate walls. We teach them how to hold light.";

function Word({ word, progress, a, b }: { word: string; progress: MotionValue<number>; a: number; b: number }) {
  const opacity = useTransform(progress, [a, b], [0.12, 1]);
  const y = useTransform(progress, [a, b], ["0.18em", "0em"]);
  const blur = useTransform(progress, [a, b], ["6px", "0px"]);
  const filter = useTransform(blur, (v) => `blur(${v})`);
  return (
    <motion.span style={{ opacity, y, filter }} className="mr-[0.28em] inline-block will-change-transform">
      {word}
    </motion.span>
  );
}

export default function WordVeil() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const words = TEXT.split(" ");
  const step = 1 / words.length;
  const line = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section ref={ref} className="relative h-[280vh] border-t border-ink/10">
      <div className="sticky top-0 flex h-screen flex-col justify-center px-6 sm:px-10">
        <Kicker label="04 — Manifesto" className="mb-10" />
        <p className="mx-auto max-w-4xl font-display text-[7.4vw] font-light leading-[1.12] tracking-[-0.02em] text-ink sm:text-[3.4vw]">
          {words.map((w, i) => (
            <Word
              key={`${w}-${i}`}
              word={w}
              progress={scrollYProgress}
              a={i * step * 0.82}
              b={i * step * 0.82 + step * 2.4}
            />
          ))}
        </p>
        <RevealText delay={0.1} className="mx-auto mt-10 max-w-xl text-sm font-light leading-relaxed text-ink-soft">
          Written in the studio in 2019 and pinned above the mixing bench ever since. It is the only brief we never
          revise.
        </RevealText>
        <div className="mx-auto mt-14 h-px w-full max-w-4xl bg-ink/10">
          <motion.div style={{ width: line }} className="h-px bg-ink/45" />
        </div>
      </div>
    </section>
  );
}
