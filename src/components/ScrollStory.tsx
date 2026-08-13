import { useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import WordVeil from "./WordVeil";
import FilmScrub from "./FilmScrub";
import StackDeck from "./StackDeck";
import WaveGallery, { type WaveSlide } from "./WaveGallery";
import { Kicker, RevealHeading, RevealText } from "./AnimatedText";

const EASE = [0.16, 1, 0.3, 1] as const;

/* ---------- 01 · Ethos: sticky label + line-by-line curtain reveal ---------- */
function CurtainLine({ text, progress, a, b }: { text: string; progress: MotionValue<number>; a: number; b: number }) {
  const y = useTransform(progress, [a, b], ["108%", "0%"]);
  const o = useTransform(progress, [a, b], [0, 1]);
  return (
    <span className="block overflow-hidden py-[0.06em]">
      <motion.span style={{ y, opacity: o }} className="block will-change-transform">
        {text}
      </motion.span>
    </span>
  );
}

function Ethos() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.9", "end 0.6"] });
  const p = useSpring(scrollYProgress, { stiffness: 60, damping: 22, mass: 0.5 });
  const lines = [
    "We work in the slow",
    "language of plaster —",
    "pressing light into surface",
    "until form remembers the hand.",
  ];
  return (
    <section ref={ref} id="about" className="mx-auto grid max-w-6xl gap-14 px-6 py-[20vh] sm:px-10 md:grid-cols-[auto_1fr] md:gap-24">
      <div className="md:sticky md:top-[38vh] md:h-fit">
        <p className="font-display text-[13vw] font-light leading-none text-ink/12 md:text-[7vw]">01</p>
        <p className="mt-2 text-[10px] font-light uppercase tracking-[0.42em] text-ink-soft">Ethos</p>
      </div>
      <div>
        <h2 className="font-display text-[8.4vw] font-light leading-[1.06] tracking-[-0.02em] sm:text-[5vw] lg:text-[3.2vw]">
          {lines.map((l, i) => (
            <CurtainLine key={l} text={l} progress={p} a={i * 0.16} b={i * 0.16 + 0.34} />
          ))}
        </h2>
        <div className="mt-14 grid gap-10 border-t border-ink/12 pt-10 sm:grid-cols-2">
          <RevealText className="max-w-sm text-sm font-light leading-relaxed text-ink-soft">
            Founded on a single stubborn belief — that a wall can be quiet and still say something. Every panel begins
            as lime, marble dust and water, and ends as a surface that changes character with the hour.
          </RevealText>
          <RevealText
            delay={0.12}
            className="max-w-sm text-sm font-light leading-relaxed text-ink-soft"
          >
            We keep the studio small on purpose. One relief at a time, drawn at full scale, pressed by hand, then left
            alone for weeks while the lime cures and the shadows settle into place.
          </RevealText>
        </div>
      </div>
    </section>
  );
}

/* ---------- 02 · Works: horizontally pinned gallery with liquid hover ---------- */
const WORKS = [
  {
    title: "Chorus of Wings",
    year: "MMXXIII",
    medium: "Lime plaster · 180 × 240",
    note: "A private stair in Lisbon; wings kept shallow so morning light does the carving.",
  },
  {
    title: "The Quiet Bloom",
    year: "MMXXIV",
    medium: "Gypsum relief · 210 × 260",
    note: "Roses pressed at four depths, the deepest barely a fingernail below the field.",
  },
  {
    title: "Reverie in Relief",
    year: "MMXXV",
    medium: "Stucco veneziano · 160 × 200",
    note: "A profile polished to satin, left unsigned so the room reads as the author.",
  },
  {
    title: "Crown of Stillness",
    year: "MMXXVI",
    medium: "Cast plaster · 190 × 230",
    note: "Cast in three sections and rejoined wet, the seams healed by hand over nine days.",
  },
];

function Gallery({ images }: { images: string[] }) {
  const slides = useMemo<WaveSlide[]>(
    () =>
      WORKS.map((w, i) => ({
        src: images[i % images.length]!,
        title: w.title,
        index: `0${i + 1}`,
        medium: `${w.medium} · ${w.year}`,
        aspect: [0.72, 0.78, 0.68, 0.8][i % 4]!,
        yOffset: [0.16, -0.22, 0.2, -0.14][i % 4]!,
        rot: [-0.035, 0.028, -0.02, 0.042][i % 4]!,
      })),
    [images],
  );
  return <WaveGallery slides={slides} />;
}

/* ---------- 03 · Process: hover-expanding index rows ---------- */
const STEPS = [
  { n: "I", t: "Listening", d: "We begin in conversation — light, room, ritual, the silence a wall should hold." },
  { n: "II", t: "Drawing", d: "Charcoal studies at full scale, pinned and lived with until the line stops arguing." },
  { n: "III", t: "Pressing", d: "Lime and marble dust worked wet, layer over layer, each pass thinner than the last." },
  { n: "IV", t: "Settling", d: "Weeks of curing. The surface pales, hardens, and finally takes the light we designed for." },
];

function StepTitle({ text, active }: { text: string; active: boolean }) {
  return (
    <span className="relative block overflow-hidden">
      <span className="flex">
        {text.split("").map((c, i) => (
          <motion.span
            key={`${c}-${i}`}
            animate={{ y: active ? "-100%" : "0%" }}
            transition={{ duration: 0.5, ease: EASE, delay: i * 0.022 }}
            className="inline-block will-change-transform"
          >
            {c}
          </motion.span>
        ))}
      </span>
      <span className="absolute inset-0 flex text-ink-soft">
        {text.split("").map((c, i) => (
          <motion.span
            key={`b-${c}-${i}`}
            animate={{ y: active ? "-100%" : "0%" }}
            transition={{ duration: 0.5, ease: EASE, delay: i * 0.022 }}
            className="inline-block translate-y-full italic will-change-transform"
          >
            {c}
          </motion.span>
        ))}
      </span>
    </span>
  );
}

function Process({ images }: { images: string[] }) {
  const [open, setOpen] = useState<number | null>(0);
  const [hover, setHover] = useState<number | null>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const px = useSpring(mx, { stiffness: 260, damping: 32, mass: 0.5 });
  const py = useSpring(my, { stiffness: 260, damping: 32, mass: 0.5 });
  const rotate = useTransform(px, [-400, 400], [-7, 7]);

  return (
    <section
      className="relative mx-auto max-w-6xl px-6 py-[16vh] sm:px-10"
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set(e.clientX - r.left - r.width / 2);
        my.set(e.clientY - r.top);
      }}
      onPointerLeave={() => setHover(null)}
    >
      <Kicker label="03 — Process" />
      <RevealHeading
        text="Four movements, none of them hurried."
        className="mt-5 max-w-2xl font-display text-[8vw] font-light leading-[1.05] tracking-[-0.02em] text-ink sm:text-[3vw]"
      />
      <RevealText delay={0.1} className="mb-14 mt-5 max-w-md text-sm font-light leading-relaxed text-ink-soft">
        A commission takes between nine and twenty weeks. Most of that time nothing visibly happens — the lime is
        simply learning the room.
      </RevealText>

      {/* cursor-tracked plaster chip */}
      <AnimatePresence>
        {hover !== null && (
          <motion.div
            key="chip"
            initial={{ opacity: 0, scale: 0.86, filter: "blur(12px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.9, filter: "blur(12px)" }}
            transition={{ duration: 0.45, ease: EASE }}
            style={{ x: px, y: py, rotate, left: "50%", top: 0 }}
            className="pointer-events-none absolute z-20 hidden h-[15vw] w-[11vw] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[2px] border border-ink/10 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.35)] lg:block"
          >
            <motion.img
              key={hover}
              src={images[hover % images.length]}
              alt=""
              aria-hidden="true"
              initial={{ scale: 1.25 }}
              animate={{ scale: 1.05 }}
              transition={{ duration: 1.1, ease: EASE }}
              className="h-full w-full object-cover"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="border-t border-ink/12">
        {STEPS.map((s, i) => {
          const active = hover === i;
          return (
            <motion.div
              key={s.t}
              onMouseEnter={() => {
                setOpen(i);
                setHover(i);
              }}
              animate={{ opacity: hover === null || active ? 1 : 0.34 }}
              transition={{ duration: 0.45, ease: EASE }}
              className="group relative cursor-default overflow-hidden border-b border-ink/12 py-7"
            >
              <motion.span
                aria-hidden="true"
                initial={false}
                animate={{ scaleY: active ? 1 : 0 }}
                transition={{ duration: 0.6, ease: EASE }}
                className="absolute inset-0 origin-bottom bg-ink/[0.035]"
              />
              <motion.div
                animate={{ x: active ? 18 : 0 }}
                transition={{ duration: 0.6, ease: EASE }}
                className="relative flex items-baseline gap-6"
              >
                <span className="w-10 shrink-0 font-display text-sm font-light tracking-[0.2em] text-ink-soft">{s.n}</span>
                <h3 className="font-display text-[7vw] font-light leading-none tracking-[-0.02em] text-ink sm:text-[3.4vw] lg:text-[2.4vw]">
                  <StepTitle text={s.t} active={active} />
                </h3>
                <motion.span
                  animate={{ opacity: active ? 1 : 0, x: active ? 0 : -12 }}
                  transition={{ duration: 0.5, ease: EASE }}
                  className="ml-auto hidden text-[10px] font-light uppercase tracking-[0.34em] text-ink-soft sm:block"
                >
                  0{i + 1} / 04
                </motion.span>
              </motion.div>
              <motion.div
                initial={false}
                animate={{ height: open === i ? "auto" : 0, opacity: open === i ? 1 : 0 }}
                transition={{ duration: 0.55, ease: EASE }}
                className="relative overflow-hidden"
              >
                <p className="ml-16 mt-4 max-w-lg text-sm font-light leading-relaxed text-ink-soft">{s.d}</p>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

/* ---------- 04 · Closing: unmasking plate ---------- */
function MagneticCTA() {
  const ref = useRef<HTMLAnchorElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 180, damping: 18, mass: 0.4 });
  const y = useSpring(my, { stiffness: 180, damping: 18, mass: 0.4 });
  const lx = useTransform(x, (v) => v * 0.45);
  const ly = useTransform(y, (v) => v * 0.45);

  const onMove = (e: React.MouseEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    mx.set((e.clientX - (r.left + r.width / 2)) * 0.35);
    my.set((e.clientY - (r.top + r.height / 2)) * 0.5);
  };
  const reset = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.a
      ref={ref}
      href="mailto:studio@sculptandcrown.com"
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ x, y }}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
      className="group relative mt-12 inline-flex items-center gap-4 overflow-hidden rounded-full border border-ink/25 px-11 py-4"
    >
      <span className="absolute inset-0 origin-bottom scale-y-0 bg-ink transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100" />
      <motion.span style={{ x: lx, y: ly }} className="relative flex items-center gap-4">
        <span className="text-[11px] font-light uppercase tracking-[0.36em] text-ink transition-colors duration-500 group-hover:text-background">
          Begin a commission
        </span>
        <span className="text-[11px] text-ink transition-all duration-500 group-hover:translate-x-1.5 group-hover:text-background">
          ↗
        </span>
      </motion.span>
    </motion.a>
  );
}

function Closing({ image }: { image: string }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 90, damping: 26, mass: 0.5 });
  const clip = useTransform(p, [0, 1], ["inset(42% 38% 42% 38% round 2px)", "inset(0% 0% 0% 0% round 0px)"]);
  const scale = useTransform(p, [0, 1], [1.34, 1]);
  const veil = useTransform(p, [0, 0.75], [0.86, 0.18]);
  const curtain = useTransform(p, [0.05, 0.85], ["0%", "-102%"]);
  const blur = useTransform(p, [0, 0.6], ["blur(14px)", "blur(0px)"]);
  const lift = useTransform(p, [0, 1], ["10vh", "0vh"]);
  const rule = useTransform(p, [0.1, 0.9], ["0%", "100%"]);

  return (
    <section ref={ref} className="relative overflow-hidden border-t border-ink/10 px-6 py-[14vh] sm:px-10">
      <motion.div
        style={{ clipPath: clip, y: lift }}
        className="relative mx-auto h-[62vh] max-w-5xl overflow-hidden will-change-transform"
      >
        <motion.img
          src={image}
          alt="Plaster bas-relief detail"
          loading="lazy"
          style={{ scale, filter: blur }}
          className="h-full w-full object-cover"
        />
        <motion.div style={{ opacity: veil }} className="absolute inset-0 bg-background" />
        {/* lifting veil */}
        <motion.div
          style={{ y: curtain }}
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background via-background to-background/70"
        />
        <div className="pointer-events-none absolute inset-0 border border-ink/10" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background to-transparent" />
      </motion.div>

      <div className="relative mt-[10vh] text-center">
        <motion.div style={{ width: rule }} className="mx-auto mb-14 h-px max-w-5xl bg-ink/20" />
        <Kicker label="07 — Commissions" className="justify-center" />
        <motion.h2
          initial={{ opacity: 0, y: 32, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 1.1, ease: EASE }}
          className="mx-auto mt-6 max-w-3xl font-display text-[10vw] font-light leading-[0.92] tracking-[-0.035em] sm:text-[4.9vw]"
        >
          Let us carve <em className="italic text-ink-soft">your</em> quiet.
        </motion.h2>
        <RevealText delay={0.15} className="mx-auto mt-7 max-w-md text-[13px] font-light leading-[1.9] tracking-[0.01em] text-ink-soft">
          We take four commissions a year. Send the room — its light, its hours, the thing you keep looking at — and we
          will answer with a drawing before we ever mix lime.
        </RevealText>
        <MagneticCTA />

        <div className="mx-auto mt-[14vh] flex max-w-5xl flex-col items-center gap-6 border-t border-ink/12 pt-8 sm:flex-row sm:justify-between">
          <p className="text-[10px] font-light uppercase tracking-[0.3em] text-ink-soft">Sculpt &amp; Crown — Studio</p>
          <p className="text-[10px] font-light uppercase tracking-[0.3em] text-ink-soft/70">
            Lisbon · Four commissions a year · MMXXVI
          </p>
        </div>
        <p className="pointer-events-none mt-10 select-none font-display text-[17vw] font-light leading-[0.8] tracking-[-0.05em] text-ink/[0.055]">
          SCULPT
        </p>
      </div>
    </section>
  );
}

export default function ScrollStory({ images, video }: { images: string[]; video: string }) {
  return (
    <div className="relative bg-background text-ink">
      <Ethos />
      <Gallery images={images} />
      <Process images={images} />
      <WordVeil />
      <FilmScrub src={video} />
      <StackDeck images={images} />
      <Closing image={(images[2] ?? images[0])!} />
    </div>
  );
}
