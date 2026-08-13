import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import { Kicker } from "./AnimatedText";

const EASE = [0.16, 1, 0.3, 1] as const;

const CARDS = [
  { cap: "Wings, held still", sub: "Lime plaster · Lisbon stair" },
  { cap: "Roses, in low relief", sub: "Gypsum · four depths" },
  { cap: "The profile, unhurried", sub: "Stucco veneziano · satin" },
  { cap: "Crown of stillness", sub: "Cast plaster · three sections" },
];

function CharCaption({ text, progress, a }: { text: string; progress: MotionValue<number>; a: number }) {
  return (
    <span className="flex overflow-hidden">
      {text.split("").map((c, i) => (
        <Char key={`${c}-${i}`} c={c} progress={progress} a={Math.max(0, a - 0.16) + i * 0.004} />
      ))}
    </span>
  );
}

function Char({ c, progress, a }: { c: string; progress: MotionValue<number>; a: number }) {
  const y = useTransform(progress, [a, a + 0.06], ["105%", "0%"]);
  const o = useTransform(progress, [a, a + 0.06], [0, 1]);
  return (
    <motion.span style={{ y, opacity: o }} className="inline-block whitespace-pre will-change-transform">
      {c}
    </motion.span>
  );
}

function Card({
  src,
  cap,
  sub,
  i,
  total,
  progress,
}: {
  src: string;
  cap: string;
  sub: string;
  i: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const a = i / total;
  const b = (i + 1) / total;
  const start = Math.max(0, a - 0.22);

  const y = useTransform(progress, [start, a], ["66vh", "0vh"]);
  const scale = useTransform(progress, [a, b], [1, 1 - (total - i) * 0.035]);
  const rotate = useTransform(progress, [start, a, b], [i % 2 ? 4 : -4, 0, i % 2 ? -1.8 : 1.8]);
  const dim = useTransform(progress, [a, b], [0, 0.55]);
  const imgScale = useTransform(progress, [start, b], [1.18, 1]);
  const imgY = useTransform(progress, [start, b], ["-4%", "2%"]);
  const blur = useTransform(progress, [a, b], [0, 3]);
  const filter = useTransform(blur, (v) => `blur(${v}px)`);
  const lineW = useTransform(progress, [start, a + 0.06], ["0%", "100%"]);

  return (
    <motion.figure
      style={{ y, scale, rotate, zIndex: i, filter }}
      className="absolute inset-0 m-auto h-[62vh] w-[86vw] overflow-hidden rounded-[2px] border border-ink/12 bg-background will-change-transform sm:w-[54vw] lg:w-[38vw]"
    >
      <motion.img
        src={src}
        alt={cap}
        loading="lazy"
        style={{ scale: imgScale, y: imgY }}
        className="h-full w-full object-cover will-change-transform"
      />
      <motion.div style={{ opacity: dim }} className="absolute inset-0 bg-background" />
      <div className="pointer-events-none absolute inset-0 border border-ink/10" />

      <span className="absolute left-5 top-5 font-display text-xs font-light tracking-[0.34em] text-ink-soft">
        0{i + 1}
      </span>

      <figcaption className="absolute inset-x-0 bottom-0 border-t border-ink/10 bg-background/72 px-5 py-4 backdrop-blur-[2px]">
        <motion.div style={{ width: lineW }} className="mb-3 h-px bg-ink/35" />
        <div className="flex items-baseline justify-between gap-4">
          <span className="font-display text-base font-light italic tracking-tight text-ink sm:text-xl">
            <CharCaption text={cap} progress={progress} a={a} />
          </span>
          <span className="shrink-0 text-[10px] font-light uppercase tracking-[0.32em] text-ink-soft">
            0{i + 1} / 04
          </span>
        </div>
        <p className="mt-2 text-[10px] font-light uppercase tracking-[0.26em] text-ink-soft/70">{sub}</p>
      </figcaption>
    </motion.figure>
  );
}

export default function StackDeck({ images }: { images: string[] }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 80, damping: 28, mass: 0.45 });
  const count = useTransform(p, (v) => `0${Math.min(4, Math.floor(v * 4) + 1)}`);
  const bar = useTransform(p, [0, 1], ["0%", "100%"]);

  return (
    <section ref={ref} className="relative h-[400vh] border-t border-ink/10">
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="absolute inset-x-6 top-8 z-30 flex items-start justify-between gap-6 sm:inset-x-10">
          <div>
            <Kicker label="06 — The deck" />
            <motion.h2
              initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: EASE }}
              className="mt-4 max-w-md font-display text-[6vw] font-light leading-[1.05] tracking-[-0.02em] text-ink sm:text-[2.1vw]"
            >
              Four plates, laid down one over the other.
            </motion.h2>
          </div>
          <motion.span className="font-display text-4xl font-light leading-none text-ink/25 sm:text-6xl">
            {count}
          </motion.span>
        </div>

        <div className="relative h-full w-full">
          {images.slice(0, 4).map((src, i) => (
            <Card key={src} src={src} cap={CARDS[i]!.cap} sub={CARDS[i]!.sub} i={i} total={4} progress={p} />
          ))}
        </div>

        <div className="absolute inset-x-6 bottom-8 z-30 h-px bg-ink/12 sm:inset-x-10">
          <motion.div style={{ width: bar }} className="h-px bg-ink/50" />
        </div>
      </div>
    </section>
  );
}
