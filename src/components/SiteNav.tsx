import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";

const LINKS = [
  { to: "/works", label: "Works" },
  { to: "/studio", label: "Studio" },
  { to: "/commissions", label: "Commissions" },
] as const;

export function Monogram({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`flex min-w-0 items-center gap-3 ${className}`}>
      <span className="grid h-10 w-10 shrink-0 place-items-center whitespace-nowrap rounded-full border border-ink/25 font-display text-[14px] leading-none tracking-[0.04em] text-ink">
        S<span className="text-[9px] text-ink-soft">&amp;</span>C
      </span>
      <span className="truncate text-[11px] font-light uppercase tracking-[0.42em] text-ink">
        Sculpt &amp; Crown
      </span>
    </Link>
  );
}

export default function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        scrolled
          ? "border-b border-ink/10 bg-background/80 backdrop-blur-md"
          : "border-b border-transparent"
      }`}
    >
      <nav className="flex items-center justify-between gap-6 px-6 py-4 sm:px-10">
        <Monogram />

        <div className="hidden items-center gap-9 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeProps={{ className: "text-ink after:scale-x-100" }}
              className="relative text-[11px] font-light uppercase tracking-[0.34em] text-ink-soft transition-colors after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-ink after:transition-transform after:duration-500 hover:text-ink hover:after:scale-x-100"
            >
              {l.label}
            </Link>
          ))}
          <Link
            to="/commissions"
            className="group relative overflow-hidden rounded-full border border-ink/25 px-6 py-2.5"
          >
            <span className="absolute inset-0 origin-bottom scale-y-0 bg-ink transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100" />
            <span className="relative text-[10px] font-light uppercase tracking-[0.34em] text-ink transition-colors duration-500 group-hover:text-background">
              Enquire
            </span>
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          className="text-[10px] font-light uppercase tracking-[0.34em] text-ink md:hidden"
        >
          {open ? "Close" : "Menu"}
        </button>
      </nav>

      {open ? (
        <div className="border-t border-ink/10 bg-background/95 px-6 py-6 backdrop-blur-md md:hidden">
          <div className="flex flex-col gap-5">
            {LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="font-display text-3xl font-light tracking-[-0.02em] text-ink"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}
