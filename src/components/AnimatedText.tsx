import { motion } from "motion/react";

const EASE = [0.16, 1, 0.3, 1] as const;

/** Word-by-word mask rise, triggered on view. */
export function RevealHeading({
  text,
  className = "",
  delay = 0,
  as: As = "h2",
}: {
  text: string;
  className?: string;
  delay?: number;
  as?: "h1" | "h2" | "h3" | "p";
}) {
  const words = text.split(" ");
  const MotionAs = motion[As] as typeof motion.h2;
  return (
    <MotionAs
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-12%" }}
      transition={{ staggerChildren: 0.055, delayChildren: delay }}
      className={className}
    >
      {words.map((w, i) => (
        <span key={`${w}-${i}`} className="mr-[0.26em] inline-block overflow-hidden py-[0.06em] align-bottom">
          <motion.span
            variants={{ hidden: { y: "110%" }, show: { y: "0%" } }}
            transition={{ duration: 0.9, ease: EASE }}
            className="inline-block will-change-transform"
          >
            {w}
          </motion.span>
        </span>
      ))}
    </MotionAs>
  );
}

/** Soft blur-rise paragraph. */
export function RevealText({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.p
      initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 1, ease: EASE, delay }}
      className={className}
    >
      {children}
    </motion.p>
  );
}

/** Small uppercase label with a drawing rule. */
export function Kicker({ label, className = "" }: { label: string; className?: string }) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <motion.span
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: EASE }}
        className="block h-px w-10 origin-left bg-ink/40"
      />
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: EASE, delay: 0.12 }}
        className="text-[10px] font-light uppercase tracking-[0.42em] text-ink-soft"
      >
        {label}
      </motion.p>
    </div>
  );
}
