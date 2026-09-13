import { createFileRoute, Link } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import relief from "@/assets/relief.png.asset.json";
import plaster from "@/assets/plaster.png.asset.json";
import work1 from "@/assets/work1.jpg.asset.json";
import work2 from "@/assets/work2.jpg.asset.json";
import work3 from "@/assets/work3.jpg.asset.json";
import work4 from "@/assets/work4.jpg.asset.json";

const PlasterRevealCanvas = lazy(
  () => import("@/components/PlasterRevealCanvas"),
);
const ScrollStory = lazy(() => import("@/components/ScrollStory"));
const SmoothScroll = lazy(() => import("@/components/SmoothScroll"));

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sculpt & Crown — The Delicate Art of Crafted Dreams" },
      {
        name: "description",
        content:
          "Sculpt & Crown creates bespoke bas-relief plaster artistry. Move your cursor to reveal beauty carved from intention.",
      },
      {
        property: "og:title",
        content: "Sculpt & Crown — The Delicate Art of Crafted Dreams",
      },
      {
        property: "og:description",
        content:
          "Bespoke bas-relief plaster artistry. Beauty carved from intention.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="w-full bg-background text-ink">
      <Suspense fallback={null}>
        <SmoothScroll />
      </Suspense>
      <section className="relative h-[100dvh] min-h-[540px] w-full overflow-hidden">
        {/* Layer 1: Background relief image (always visible behind) */}
        <div className="absolute inset-0 z-0">
          <img
            src={relief.url}
            alt=""
            aria-hidden="true"
            loading="eager"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Layer 2: WebGL canvas that reveals the background */}
        <div className="absolute inset-0 z-10">
          <Suspense
            fallback={
              <div className="h-full w-full bg-plaster/20 backdrop-blur-sm" />
            }
          >
            <PlasterRevealCanvas topUrl={plaster.url} backUrl={relief.url} />
          </Suspense>
        </div>

        {/* Layer 3: UI */}
        <div className="pointer-events-none relative z-20 flex h-full w-full flex-col justify-between p-6 pt-24 sm:p-10 sm:pt-28">
          <div />

          <div className="flex items-center justify-between gap-6">
            <Link
              to="/works"
              className="pointer-events-auto rise hidden shrink-0 whitespace-nowrap text-[11px] font-light uppercase tracking-[0.34em] text-ink-soft transition-colors hover:text-ink md:block"
              style={{
                writingMode: "vertical-rl",
                rotate: "180deg",
                animationDelay: "320ms",
              }}
            >
              See all projects
            </Link>

            <div className="mx-auto max-w-3xl text-center">
              <h1
                className="rise font-display text-[13vw] font-light leading-[0.95] tracking-[-0.02em] text-ink sm:text-[8vw] lg:text-[5.6vw]"
                style={{ animationDelay: "180ms" }}
              >
                The Delicate Art
                <br />
                <em className="italic text-ink-soft">of Crafted Dreams</em>
              </h1>
              <p
                className="rise mx-auto mt-7 max-w-md text-[11px] font-light uppercase leading-relaxed tracking-[0.28em] text-ink"
                style={{ animationDelay: "420ms" }}
              >
                Revealing beauty carved from intention.
              </p>
            </div>

            <span
              className="rise hidden shrink-0 whitespace-nowrap text-[11px] font-light uppercase tracking-[0.34em] text-ink-soft md:block"
              style={{ writingMode: "vertical-rl", animationDelay: "320ms" }}
            >
              Scroll down
            </span>
          </div>

          <footer className="flex items-end justify-between gap-4">
            <span
              className="rise text-[10px] font-light uppercase tracking-[0.3em] text-ink-soft/70"
              style={{ animationDelay: "560ms" }}
            >
              Move cursor to reveal
            </span>
            <span
              className="rise text-[10px] font-light uppercase tracking-[0.3em] text-ink-soft/70"
              style={{ animationDelay: "560ms" }}
            >
              MMXXVI
            </span>
          </footer>
        </div>
      </section>
      <Suspense fallback={<div className="min-h-screen bg-background" />}>
        <ScrollStory images={[work1.url, work2.url, work3.url, work4.url]} />
      </Suspense>
    </main>
  );
}
