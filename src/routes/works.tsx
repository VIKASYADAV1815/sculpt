import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import SiteFooter from "@/components/SiteFooter";
import { Kicker, RevealHeading, RevealText } from "@/components/AnimatedText";
import work1 from "@/assets/work1.jpg.asset.json";
import work2 from "@/assets/work2.jpg.asset.json";
import work3 from "@/assets/work3.jpg.asset.json";
import work4 from "@/assets/work4.jpg.asset.json";

export const Route = createFileRoute("/works")({
  head: () => ({
    meta: [
      { title: "Works — Sculpt & Crown Plaster Reliefs" },
      {
        name: "description",
        content:
          "Available lime-plaster bas-relief panels and editions from the Sculpt & Crown atelier, with dimensions, materials and enquiry details.",
      },
      { property: "og:title", content: "Works — Sculpt & Crown Plaster Reliefs" },
      {
        property: "og:description",
        content: "Available lime-plaster bas-relief panels and editions from the atelier.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WorksPage,
});

const EASE = [0.16, 1, 0.3, 1] as const;

const PIECES = [
  {
    src: work1.url,
    title: "Vesper Wing",
    year: "2026",
    medium: "Lime plaster, marble dust",
    size: "120 × 90 cm",
    edition: "Edition of 3",
    price: "€ 8,400",
    status: "Available",
    note: "A single wing caught mid-fold, cut low so the room's evening light does the rest.",
  },
  {
    src: work2.url,
    title: "Rose Ledger",
    year: "2025",
    medium: "Lime plaster on oak panel",
    size: "100 × 100 cm",
    edition: "Unique",
    price: "€ 11,200",
    status: "Reserved",
    note: "Seven roses recorded at different hours of opening, pressed in one continuous session.",
  },
  {
    src: work3.url,
    title: "Quiet Profile",
    year: "2025",
    medium: "Lime plaster, pigment wash",
    size: "140 × 95 cm",
    edition: "Edition of 2",
    price: "€ 9,600",
    status: "Available",
    note: "The face sits barely 6 mm proud of the ground — presence without announcement.",
  },
  {
    src: work4.url,
    title: "Crown Fragment",
    year: "2024",
    medium: "Lime plaster, gesso ground",
    size: "80 × 60 cm",
    edition: "Edition of 5",
    price: "€ 5,200",
    status: "Available",
    note: "A study piece from the crown series, scaled for a hallway or a narrow return wall.",
  },
];

function WorksPage() {
  return (
    <main className="min-h-screen bg-background text-ink">
      <section className="px-6 pb-[10vh] pt-[22vh] sm:px-10">
        <div className="mx-auto max-w-6xl">
          <Kicker label="Catalogue — MMXXVI" />
          <RevealHeading
            as="h1"
            text="Works held in the atelier"
            className="mt-6 max-w-4xl font-display text-[12vw] font-light leading-[0.92] tracking-[-0.035em] sm:text-[5.4vw]"
          />
          <RevealText delay={0.15} className="mt-8 max-w-lg text-[13px] font-light leading-[1.9] text-ink-soft">
            Every panel is pressed by hand in lime and marble dust, cured for six weeks, then finished for the
            light of the room it will live in. Prices include crating; installation is quoted separately.
          </RevealText>
        </div>
      </section>

      <section className="px-6 pb-[12vh] sm:px-10">
        <div className="mx-auto grid max-w-6xl gap-x-10 gap-y-20 sm:grid-cols-2">
          {PIECES.map((p, i) => (
            <motion.article
              key={p.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-12%" }}
              transition={{ duration: 1, ease: EASE, delay: (i % 2) * 0.08 }}
              className={i % 2 === 1 ? "sm:mt-24" : ""}
            >
              <div className="group relative overflow-hidden border border-ink/10">
                <img
                  src={p.src}
                  alt={`${p.title} — plaster bas-relief panel`}
                  loading="lazy"
                  className="h-[52vh] w-full object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.045]"
                />
                <span className="absolute left-4 top-4 rounded-full border border-ink/20 bg-background/80 px-4 py-1.5 text-[9px] font-light uppercase tracking-[0.3em] text-ink-soft backdrop-blur-sm">
                  {p.status}
                </span>
              </div>

              <div className="mt-6 flex items-baseline justify-between gap-6 border-b border-ink/10 pb-4">
                <h2 className="font-display text-3xl font-light tracking-[-0.02em]">{p.title}</h2>
                <p className="text-[11px] font-light uppercase tracking-[0.28em] text-ink-soft">{p.price}</p>
              </div>
              <dl className="mt-4 grid grid-cols-2 gap-y-2 text-[10px] font-light uppercase tracking-[0.26em] text-ink-soft/85">
                <dt className="text-ink-soft/60">Year</dt>
                <dd className="text-right">{p.year}</dd>
                <dt className="text-ink-soft/60">Medium</dt>
                <dd className="text-right">{p.medium}</dd>
                <dt className="text-ink-soft/60">Dimensions</dt>
                <dd className="text-right">{p.size}</dd>
                <dt className="text-ink-soft/60">Edition</dt>
                <dd className="text-right">{p.edition}</dd>
              </dl>
              <p className="mt-5 max-w-md text-[13px] font-light leading-[1.9] text-ink-soft">{p.note}</p>
              <Link
                to="/commissions"
                className="mt-6 inline-block text-[10px] font-light uppercase tracking-[0.32em] text-ink underline-offset-8 hover:underline"
              >
                Enquire about this piece ↗
              </Link>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="border-t border-ink/10 px-6 py-[12vh] text-center sm:px-10">
        <Kicker label="Not listed here" className="justify-center" />
        <RevealHeading
          text="Ask for the private catalogue"
          className="mx-auto mt-6 max-w-3xl font-display text-[9vw] font-light leading-[0.95] tracking-[-0.03em] sm:text-[4.2vw]"
        />
        <Link
          to="/commissions"
          className="group relative mt-10 inline-flex items-center gap-4 overflow-hidden rounded-full border border-ink/25 px-11 py-4"
        >
          <span className="absolute inset-0 origin-bottom scale-y-0 bg-ink transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100" />
          <span className="relative text-[11px] font-light uppercase tracking-[0.34em] text-ink transition-colors duration-500 group-hover:text-background">
            Begin a commission
          </span>
        </Link>
      </section>

      <SiteFooter />
    </main>
  );
}
