import { Link } from "@tanstack/react-router";

export default function SiteFooter() {
  return (
    <footer className="border-t border-ink/10 px-6 py-16 sm:px-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-10">
        <div className="flex flex-col justify-between gap-8 sm:flex-row">
          <div className="max-w-sm">
            <p className="font-display text-3xl font-light leading-tight tracking-[-0.02em] text-ink">
              Sculpt &amp; Crown
            </p>
            <p className="mt-4 text-[13px] font-light leading-[1.9] text-ink-soft">
              A lime-plaster atelier in Lisbon. Four commissions a year, each drawn at full scale before a
              single hand touches the wall.
            </p>
          </div>
          <div className="flex gap-14">
            <div className="flex flex-col gap-3">
              <p className="text-[10px] font-light uppercase tracking-[0.3em] text-ink-soft/70">Pages</p>
              <Link to="/" className="text-[11px] font-light uppercase tracking-[0.28em] text-ink-soft hover:text-ink">Home</Link>
              <Link to="/works" className="text-[11px] font-light uppercase tracking-[0.28em] text-ink-soft hover:text-ink">Works</Link>
              <Link to="/studio" className="text-[11px] font-light uppercase tracking-[0.28em] text-ink-soft hover:text-ink">Studio</Link>
              <Link to="/commissions" className="text-[11px] font-light uppercase tracking-[0.28em] text-ink-soft hover:text-ink">Commissions</Link>
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-[10px] font-light uppercase tracking-[0.3em] text-ink-soft/70">Studio</p>
              <a href="mailto:studio@sculptandcrown.com" className="text-[11px] font-light uppercase tracking-[0.28em] text-ink-soft hover:text-ink">
                studio@sculptandcrown.com
              </a>
              <p className="text-[11px] font-light uppercase tracking-[0.28em] text-ink-soft/70">Rua da Boavista, Lisboa</p>
              <p className="text-[11px] font-light uppercase tracking-[0.28em] text-ink-soft/70">By appointment</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3 border-t border-ink/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[10px] font-light uppercase tracking-[0.3em] text-ink-soft/70">© MMXXVI Sculpt &amp; Crown</p>
          <p className="text-[10px] font-light uppercase tracking-[0.3em] text-ink-soft/70">Lime · Marble dust · Patience</p>
        </div>
      </div>
    </footer>
  );
}
