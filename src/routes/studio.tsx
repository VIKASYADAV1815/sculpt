import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import SiteFooter from "@/components/SiteFooter";
import { Kicker, RevealHeading, RevealText } from "@/components/AnimatedText";
import work3 from "@/assets/work3.jpg.asset.json";
import work2 from "@/assets/work2.jpg.asset.json";

export const Route = createFileRoute("/studio")({
  head: () => ({
    meta: [
      { title: "The Studio — Sculpt & Crown Lime Plaster Atelier" },
      {
        name: "description",
        content:
          "Inside the Sculpt & Crown atelier in Lisbon: lime, marble dust and full-scale drawing, and the four-stage method behind every relief.",
      },
      {
        property: "og:title",
        content: "The Studio — Sculpt & Crown Lime Plaster Atelier",
      },
      {
        property: "og:description",
        content:
          "Lime, marble dust and full-scale drawing — the method behind every relief.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: StudioPage,
});

const EASE = [0.16, 1, 0.3, 1] as const;

const METHOD = [
  {
    n: "I",
    t: "Listening",
    d: "A visit or a long call. Light, room, ritual, and the silence a wall is meant to hold.",
  },
  {
    n: "II",
    t: "Drawing",
    d: "Charcoal studies at full scale, pinned to the wall and lived with until the line stops arguing.",
  },
  {
    n: "III",
    t: "Pressing",
    d: "Lime and marble dust worked wet, layer over layer, each pass thinner than the last.",
  },
  {
    n: "IV",
    t: "Settling",
    d: "Six weeks of curing. The surface pales, hardens, and finally takes the light we designed for.",
  },
];

const FACTS = [
  { k: "Founded", v: "2016, Lisbon" },
  { k: "Hands", v: "Three, no more" },
  { k: "Commissions", v: "Four a year" },
  { k: "Materials", v: "Lime, marble dust, pigment" },
];

function StudioPage() {
  return (
    <main className="min-h-screen bg-background text-ink">
      <section className="px-6 pb-[8vh] pt-[22vh] sm:px-10">
        <div className="mx-auto max-w-6xl">
          <Kicker label="The Studio" />
          <RevealHeading
            as="h1"
            text="We work slowly, on purpose."
            className="mt-6 max-w-4xl font-display text-[12vw] font-light leading-[0.92] tracking-[-0.035em] sm:text-[5.4vw]"
          />
          <div className="mt-12 grid gap-10 sm:grid-cols-[1.1fr_1fr]">
            <RevealText className="max-w-lg text-[13px] font-light leading-[2] text-ink-soft">
              Sculpt &amp; Crown began with a single wall in a Lisbon apartment
              and a bag of lime that refused to behave. Ten years on, the method
              has barely changed: draw it at full scale, press it wet, and let
              time do the finishing. Nothing is cast, nothing is printed,
              nothing is rushed.
            </RevealText>
            <RevealText
              delay={0.12}
              className="max-w-lg text-[13px] font-light leading-[2] text-ink-soft"
            >
              We keep the studio small — three pairs of hands — because a relief
              carries the rhythm of whoever pressed it. Four commissions a year
              is not scarcity marketing; it is simply how many walls three
              people can answer honestly.
            </RevealText>
          </div>
        </div>
      </section>

      <section className="px-6 py-[8vh] sm:px-10">
        <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-[1.4fr_1fr]">
          <motion.img
            src={work3.url}
            alt="Plaster relief profile in raking studio light"
            loading="lazy"
            initial={{ opacity: 0, scale: 1.06 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 1.3, ease: EASE }}
            className="h-[60vh] w-full border border-ink/10 object-cover"
          />
          <motion.img
            src={work2.url}
            alt="Detail of pressed roses in lime plaster"
            loading="lazy"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 1.1, ease: EASE, delay: 0.1 }}
            className="mt-0 h-[60vh] w-full border border-ink/10 object-cover sm:mt-16"
          />
        </div>
      </section>

      <section className="border-t border-ink/10 px-6 py-[12vh] sm:px-10">
        <div className="mx-auto max-w-6xl">
          <Kicker label="Method — four stages" />
          <div className="mt-12 divide-y divide-ink/10 border-y border-ink/10">
            {METHOD.map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.9, ease: EASE, delay: i * 0.06 }}
                className="grid gap-4 py-8 sm:grid-cols-[80px_260px_1fr]"
              >
                <span className="font-display text-sm font-light tracking-[0.3em] text-ink-soft">
                  {s.n}
                </span>
                <h2 className="font-display text-3xl font-light tracking-[-0.02em]">
                  {s.t}
                </h2>
                <p className="max-w-xl text-[13px] font-light leading-[1.9] text-ink-soft">
                  {s.d}
                </p>
              </motion.div>
            ))}
          </div>

          <dl className="mt-16 grid gap-8 sm:grid-cols-4">
            {FACTS.map((f) => (
              <div key={f.k}>
                <dt className="text-[10px] font-light uppercase tracking-[0.3em] text-ink-soft/60">
                  {f.k}
                </dt>
                <dd className="mt-3 font-display text-2xl font-light tracking-[-0.01em]">
                  {f.v}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="border-t border-ink/10 px-6 py-[12vh] text-center sm:px-10">
        <RevealHeading
          text="Come and see the wet work"
          className="mx-auto max-w-3xl font-display text-[9vw] font-light leading-[0.95] tracking-[-0.03em] sm:text-[4.2vw]"
        />
        <RevealText
          delay={0.12}
          className="mx-auto mt-6 max-w-md text-[13px] font-light leading-[1.9] text-ink-soft"
        >
          Studio visits are by appointment, usually on Thursdays when a panel is
          still open and workable.
        </RevealText>
        <Link
          to="/commissions"
          className="group relative mt-10 inline-flex items-center gap-4 overflow-hidden rounded-full border border-ink/25 px-11 py-4"
        >
          <span className="absolute inset-0 origin-bottom scale-y-0 bg-ink transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100" />
          <span className="relative text-[11px] font-light uppercase tracking-[0.34em] text-ink transition-colors duration-500 group-hover:text-background">
            Request a visit
          </span>
        </Link>
      </section>

      <SiteFooter />
    </main>
  );
}
