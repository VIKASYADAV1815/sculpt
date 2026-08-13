import { useEffect, useId, useRef, useState } from "react";

/**
 * Liquid hover: an animated SVG turbulence + displacement filter that
 * "wakes up" under the cursor, like water disturbed on a plaster surface.
 */
export default function WaterImage({
  src,
  alt,
  className = "",
  strength = 34,
}: {
  src: string;
  alt: string;
  className?: string;
  strength?: number;
}) {
  const uid = useId().replace(/[:]/g, "");
  const turbRef = useRef<SVGFETurbulenceElement>(null);
  const dispRef = useRef<SVGFEDisplacementMapElement>(null);
  const target = useRef(0);
  const value = useRef(0);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = (now - start) / 1000;
      value.current += (target.current - value.current) * 0.06;
      const v = value.current;
      if (turbRef.current) {
        const bx = 0.006 + Math.sin(t * 0.35) * 0.0018 + v * 0.004;
        const by = 0.011 + Math.cos(t * 0.27) * 0.0022 + v * 0.006;
        turbRef.current.setAttribute("baseFrequency", `${bx.toFixed(5)} ${by.toFixed(5)}`);
      }
      if (dispRef.current) {
        dispRef.current.setAttribute("scale", (6 + v * strength).toFixed(2));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [strength]);

  useEffect(() => {
    target.current = hovered ? 1 : 0;
  }, [hovered]);

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <svg aria-hidden="true" className="pointer-events-none absolute h-0 w-0">
        <filter id={`water-${uid}`} x="-12%" y="-12%" width="124%" height="124%">
          <feTurbulence ref={turbRef} type="fractalNoise" baseFrequency="0.006 0.011" numOctaves="3" seed="11" result="n" />
          <feDisplacementMap ref={dispRef} in="SourceGraphic" in2="n" scale="6" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        width={1024}
        height={1280}
        style={{ filter: `url(#water-${uid})` }}
        className="h-full w-full scale-110 object-cover transition-transform duration-[1400ms] ease-out"
      />
      <div className="pointer-events-none absolute inset-0 bg-background/30 mix-blend-screen transition-opacity duration-700" />
    </div>
  );
}
