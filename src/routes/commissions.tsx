import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import SiteFooter from "@/components/SiteFooter";
import { Kicker, RevealHeading, RevealText } from "@/components/AnimatedText";
import work4 from "@/assets/work4.jpg.asset.json";

export const Route = createFileRoute("/commissions")({
  head: () => ({
    meta: [
      { title: "Commissions — Bespoke Plaster Reliefs by Sculpt & Crown" },
      {
        name: "description",
        content:
          "Commission a bespoke lime-plaster bas-relief. Three scales of work, transparent pricing, timelines and an enquiry form for the Lisbon atelier.",
      },
      {
        property: "og:title",
        content: "Commissions — Bespoke Plaster Reliefs by Sculpt & Crown",
      },
      {
        property: "og:description",
        content:
          "Three scales of bespoke relief work, with transparent pricing and timelines.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CommissionsPage,
});

const EASE = [0.16, 1, 0.3, 1] as const;

const TIERS = [
  {
    name: "Panel",
    from: "from € 5,200",
    lead: "8 – 10 weeks",
    scope:
      "Up to 1 m². A single framed relief on oak or lime board, crated and hung by us.",
    includes: [
      "One charcoal study",
      "Two finish samples",
      "Crating & delivery in Europe",
    ],
  },
  {
    name: "Wall",
    from: "from € 14,000",
    lead: "12 – 16 weeks",
    scope:
      "1 – 6 m² pressed in situ, drawn around the room's existing light and joinery.",
    includes: [
      "Site visit & full-scale drawing",
      "Three finish samples",
      "On-site pressing & curing care",
    ],
    featured: true,
  },
  {
    name: "Room",
    from: "on request",
    lead: "6 – 9 months",
    scope:
      "Ceilings, cornices, whole interiors. Developed with your architect from the plans onward.",
    includes: [
      "Design development with architect",
      "Bespoke pigment palette",
      "Ten-year maintenance covenant",
    ],
  },
];

const FAQ = [
  {
    q: "How do we begin?",
    a: "Send the room — photographs at three hours of the day, rough dimensions, and what you keep looking at. We answer with a drawing before we quote.",
  },
  {
    q: "Do you ship outside Europe?",
    a: "Panels, yes, in braced crates. In-situ walls we travel for, with travel and lodging quoted at cost.",
  },
  {
    q: "What holds up over time?",
    a: "Cured lime hardens for decades. A dry cloth is the whole maintenance routine; we repair any hairline settling free in the first five years.",
  },
];

function CommissionsPage() {
  const [sent, setSent] = useState(false);

  return (
    <main className="min-h-screen bg-background text-ink">
      <section className="px-6 pb-[8vh] pt-[22vh] sm:px-10">
        <div className="mx-auto max-w-6xl">
          <Kicker label="Commissions — four a year" />
          <RevealHeading
            as="h1"
            text="Let us carve your quiet"
            className="mt-6 max-w-4xl font-display text-[12vw] font-light leading-[0.92] tracking-[-0.035em] sm:text-[5.4vw]"
          />
          <RevealText
            delay={0.14}
            className="mt-8 max-w-lg text-[13px] font-light leading-[1.9] text-ink-soft"
          >
            We take on four commissions each year so every wall gets the full
            arc — listening, drawing, pressing, settling. Below is what each
            scale of work costs and how long it honestly takes.
          </RevealText>
        </div>
      </section>

      <section className="px-6 py-[6vh] sm:px-10">
        <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-3">
          {TIERS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 34 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.95, ease: EASE, delay: i * 0.08 }}
              className={`flex flex-col border p-8 transition-colors duration-500 ${
                t.featured
                  ? "border-ink/30 bg-ink/[0.035]"
                  : "border-ink/12 hover:border-ink/25"
              }`}
            >
              <div className="flex items-baseline justify-between">
                <h2 className="font-display text-3xl font-light tracking-[-0.02em]">
                  {t.name}
                </h2>
                <span className="text-[10px] font-light uppercase tracking-[0.28em] text-ink-soft">
                  {t.lead}
                </span>
              </div>
              <p className="mt-3 text-[11px] font-light uppercase tracking-[0.3em] text-ink-soft">
                {t.from}
              </p>
              <p className="mt-6 text-[13px] font-light leading-[1.9] text-ink-soft">
                {t.scope}
              </p>
              <ul className="mt-6 flex flex-col gap-3 border-t border-ink/10 pt-6">
                {t.includes.map((inc) => (
                  <li
                    key={inc}
                    className="flex gap-3 text-[11px] font-light uppercase tracking-[0.22em] text-ink-soft/85"
                  >
                    <span className="text-ink-soft/50">—</span>
                    {inc}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="px-6 py-[10vh] sm:px-10">
        <div className="mx-auto grid max-w-6xl gap-14 sm:grid-cols-[1fr_1fr]">
          <div>
            <Kicker label="Enquiry" />
            <h2 className="mt-6 font-display text-[8vw] font-light leading-[0.95] tracking-[-0.03em] sm:text-[3.4vw]">
              Send us the room
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
              className="mt-10 flex flex-col gap-7"
            >
              {[
                { id: "name", label: "Name", type: "text" },
                { id: "email", label: "Email", type: "email" },
                { id: "place", label: "Where is the wall?", type: "text" },
              ].map((f) => (
                <div key={f.id} className="flex flex-col gap-2">
                  <label
                    htmlFor={f.id}
                    className="text-[10px] font-light uppercase tracking-[0.3em] text-ink-soft/70"
                  >
                    {f.label}
                  </label>
                  <input
                    id={f.id}
                    type={f.type}
                    required
                    className="border-b border-ink/20 bg-transparent pb-2 text-[15px] font-light text-ink outline-none transition-colors focus:border-ink"
                  />
                </div>
              ))}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="brief"
                  className="text-[10px] font-light uppercase tracking-[0.3em] text-ink-soft/70"
                >
                  The brief
                </label>
                <textarea
                  id="brief"
                  rows={4}
                  required
                  className="resize-none border-b border-ink/20 bg-transparent pb-2 text-[15px] font-light text-ink outline-none transition-colors focus:border-ink"
                />
              </div>
              <button
                type="submit"
                className="group relative mt-2 self-start overflow-hidden rounded-full border border-ink/25 px-11 py-4"
              >
                <span className="absolute inset-0 origin-bottom scale-y-0 bg-ink transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100" />
                <span className="relative text-[11px] font-light uppercase tracking-[0.34em] text-ink transition-colors duration-500 group-hover:text-background">
                  {sent ? "Thank you — we will write back" : "Send enquiry"}
                </span>
              </button>
              <p className="text-[10px] font-light uppercase tracking-[0.26em] text-ink-soft/60">
                Or write directly to studio@sculptandcrown.com
              </p>
            </form>
          </div>

          <div>
            <img
              src={work4.url}
              alt="Crown fragment relief in cured lime plaster"
              loading="lazy"
              className="h-[58vh] w-full border border-ink/10 object-cover"
            />
            <div className="mt-10 divide-y divide-ink/10 border-t border-ink/10">
              {FAQ.map((f) => (
                <div key={f.q} className="py-6">
                  <h3 className="font-display text-xl font-light tracking-[-0.01em]">
                    {f.q}
                  </h3>
                  <p className="mt-3 text-[13px] font-light leading-[1.9] text-ink-soft">
                    {f.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
