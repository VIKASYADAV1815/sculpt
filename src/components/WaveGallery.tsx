import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import * as THREE from "three";
import { Kicker, RevealText } from "./AnimatedText";

export type WaveSlide = {
  src: string;
  title: string;
  index: string;
  medium: string;
  aspect: number;
  yOffset: number;
  rot: number;
};

const vertexShader = /* glsl */ `
  uniform float uVelocity;
  uniform float uTime;
  uniform float uFocus;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec3 pos = position;
    float wave = sin(pos.y * 2.2 + uTime * 0.6) * uVelocity * 0.16;
    pos.x += wave;
    pos.y += sin(pos.x * 1.4 + uTime * 0.8) * uVelocity * 0.055;
    pos.z += uFocus * 0.05 * (1.0 - abs(uv.x - 0.5) * 2.0);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform sampler2D uTex;
  uniform float uVelocity;
  uniform float uFocus;
  uniform vec2 uImgAspect;
  varying vec2 vUv;

  vec2 coverUv(vec2 uv, float planeAspect, float texAspect) {
    vec2 ratio = vec2(min(planeAspect / texAspect, 1.0), min(texAspect / planeAspect, 1.0));
    return vec2(uv.x * ratio.x + (1.0 - ratio.x) * 0.5, uv.y * ratio.y + (1.0 - ratio.y) * 0.5);
  }

  void main() {
    vec2 uv = coverUv(vUv, uImgAspect.x, uImgAspect.y);
    uv += vec2(0.0, uVelocity * 0.005 * sin(vUv.x * 3.14159));
    // restrained chromatic split, strongest at the edges of the plate
    float split = uVelocity * 0.006 * (0.35 + 0.65 * abs(vUv.x - 0.5) * 2.0);
    float r = texture2D(uTex, uv + vec2(split, 0.0)).r;
    float g = texture2D(uTex, uv).g;
    float b = texture2D(uTex, uv - vec2(split, 0.0)).b;
    vec3 col = vec3(r, g, b);

    // --- plaster & ivory grade ---
    float lum = dot(col, vec3(0.299, 0.587, 0.114));
    // desaturate toward lime plaster, keep a touch of the original body
    vec3 plaster = mix(vec3(0.815, 0.800, 0.772), vec3(0.995, 0.988, 0.972), smoothstep(0.05, 0.95, lum));
    col = mix(plaster, col, 0.30);

    // sculpt contrast: deepen the shadow shelves, protect the highlights
    col = (col - 0.5) * 1.16 + 0.5;
    col = mix(col, col * col * (3.0 - 2.0 * col), 0.22);
    // warm highlight / cool shadow duotone lift
    col += vec3(0.030, 0.020, 0.004) * smoothstep(0.55, 1.0, lum);
    col -= vec3(0.012, 0.010, 0.000) * (1.0 - smoothstep(0.0, 0.45, lum));

    // soft vignette + focus lift
    float edge = smoothstep(0.5, 0.06, abs(vUv.x - 0.5));
    col *= 0.93 + 0.07 * edge;
    col = mix(col * 0.90, col, 0.45 + uFocus * 0.55);

    // fine plaster grain
    float grain = fract(sin(dot(vUv * 900.0, vec2(12.9898, 78.233))) * 43758.5453);
    col += (grain - 0.5) * 0.018;
    col = clamp(col, 0.0, 1.0);

    gl_FragColor = vec4(col, 1.0);
  }
`;

const EASE = [0.16, 1, 0.3, 1] as const;

/** Caption that re-letters itself, kerning open, whenever the active slide changes. */
function KernedTitle({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  return (
    <span className={`flex flex-wrap overflow-hidden ${className}`}>
      {text.split("").map((c, i) => (
        <motion.span
          key={`${text}-${i}`}
          initial={{
            y: "105%",
            opacity: 0,
            letterSpacing: "0.16em",
            filter: "blur(6px)",
          }}
          animate={{
            y: "0%",
            opacity: 1,
            letterSpacing: "-0.02em",
            filter: "blur(0px)",
          }}
          transition={{ duration: 0.85, ease: EASE, delay: i * 0.032 }}
          className="inline-block will-change-transform"
        >
          {c === " " ? "\u00A0" : c}
        </motion.span>
      ))}
    </span>
  );
}

function FadeSwap({
  text,
  className = "",
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.span
      key={text}
      initial={{ opacity: 0, y: 8, filter: "blur(5px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.7, ease: EASE, delay }}
      className={`block ${className}`}
    >
      {text}
    </motion.span>
  );
}

export default function WaveGallery({ slides }: { slides: WaveSlide[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const mountRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [active, setActive] = useState(0);
  const progressMV = useMotionValue(0);
  const smoothProgress = useSpring(progressMV, {
    stiffness: 90,
    damping: 26,
    mass: 0.5,
  });
  const progressWidth = useTransform(
    smoothProgress,
    (v) => `${Math.min(100, Math.max(0, v * 100))}%`,
  );

  useEffect(() => {
    const mount = mountRef.current;
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!mount || !section || !canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);

    const loader = new THREE.TextureLoader();
    const meshes: { mesh: THREE.Mesh; x0: number; def: WaveSlide }[] = [];
    const GAP = 0.55;
    let cursor = 0;

    slides.forEach((def, i) => {
      const baseHeight = 2.5 + (i % 3) * 0.16;
      const baseWidth = baseHeight * def.aspect;

      const material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          uTex: { value: null },
          uVelocity: { value: 0 },
          uTime: { value: 0 },
          uFocus: { value: 0 },
          uImgAspect: {
            value: new THREE.Vector2(baseWidth / baseHeight, def.aspect),
          },
        },
        transparent: true,
      });

      const tex = loader.load(def.src, (t) => {
        t.colorSpace = THREE.SRGBColorSpace;
        (material.uniforms["uImgAspect"]!.value as THREE.Vector2).set(
          baseWidth / baseHeight,
          t.image.width / t.image.height,
        );
        material.uniforms["uTex"]!.value = t;
      });
      tex.colorSpace = THREE.SRGBColorSpace;

      const geo = new THREE.PlaneGeometry(baseWidth, baseHeight, 36, 36);
      const mesh = new THREE.Mesh(geo, material);
      const x = cursor + baseWidth / 2;
      mesh.position.set(x, def.yOffset, 0);
      mesh.rotation.z = def.rot;
      cursor += baseWidth + GAP;
      scene.add(mesh);
      meshes.push({ mesh, x0: x, def });
    });

    const totalWidth = cursor;

    const resize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      const scale = Math.min(1, w / 1100);
      scene.scale.setScalar(0.78 + scale * 0.22);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    let scrollX = 0;
    let targetScrollX = 0;
    let smoothVel = 0;
    let dragging = false;
    let lastPointerX = 0;
    let focus = 0;

    const readScroll = () => {
      const rect = section.getBoundingClientRect();
      const span = rect.height - window.innerHeight;
      const p = span > 0 ? Math.min(1, Math.max(0, -rect.top / span)) : 0;
      progressMV.set(p);
      return p * totalWidth * 0.92;
    };
    let scrollBase = readScroll();
    let dragOffset = 0;
    const onScroll = () => {
      scrollBase = readScroll();
      targetScrollX = scrollBase + dragOffset;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const onDown = (e: PointerEvent) => {
      // Don't capture touch pointer so native mobile scroll works without interference
      if (e.pointerType === "touch") return;
      dragging = true;
      lastPointerX = e.clientX;
      mount.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      dragOffset -= (e.clientX - lastPointerX) * 0.007;
      lastPointerX = e.clientX;
      targetScrollX = scrollBase + dragOffset;
    };
    const onUp = () => {
      dragging = false;
    };
    mount.addEventListener("pointerdown", onDown);
    mount.addEventListener("pointermove", onMove);
    mount.addEventListener("pointerup", onUp);
    mount.addEventListener("pointerleave", onUp);

    const t0 = performance.now();
    let raf = 0;
    let lastActive = -1;
    let running = false;

    const render = () => {
      if (!running) return;
      raf = requestAnimationFrame(render);
      const t = (performance.now() - t0) / 1000;

      const prev = scrollX;
      scrollX += (targetScrollX - scrollX) * 0.17;
      const velocity = scrollX - prev;
      smoothVel += (velocity - smoothVel) * 0.2;
      const clampedVel = Math.max(-0.8, Math.min(0.8, smoothVel * 2.6));
      focus += ((dragging ? 1 : 0) - focus) * 0.08;
      // planes hang straight at rest; tilt only emerges with motion
      const tilt = Math.min(1, Math.abs(clampedVel) * 2.2);

      let nearest = 0;
      let nearestDist = Infinity;
      meshes.forEach((m, i) => {
        let x = m.x0 - scrollX;
        x =
          ((((x + totalWidth / 2) % totalWidth) + totalWidth) % totalWidth) -
          totalWidth / 2;
        m.mesh.position.x = x;
        m.mesh.position.y = m.def.yOffset + Math.sin(t * 0.55 + i) * 0.03;
        m.mesh.rotation.z = m.def.rot * tilt + clampedVel * 0.012;

        const d = Math.abs(x);
        const near = 1 - Math.min(1, d / 2.2);
        const mat = m.mesh.material as THREE.ShaderMaterial;
        mat.uniforms["uVelocity"]!.value = clampedVel;
        mat.uniforms["uTime"]!.value = t;
        mat.uniforms["uFocus"]!.value = near * 0.7 + focus * 0.3;
        if (d < nearestDist) {
          nearestDist = d;
          nearest = i;
        }
      });

      if (nearest !== lastActive) {
        lastActive = nearest;
        setActive(nearest);
      }
      renderer.render(scene, camera);
    };

    const startLoop = () => {
      if (!running) {
        running = true;
        raf = requestAnimationFrame(render);
      }
    };

    const stopLoop = () => {
      if (running) {
        running = false;
        cancelAnimationFrame(raf);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        const visible = entry?.isIntersecting ?? false;
        if (visible) {
          startLoop();
        } else {
          stopLoop();
        }
      },
      { threshold: 0.02 },
    );
    observer.observe(section);

    return () => {
      stopLoop();
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      mount.removeEventListener("pointerdown", onDown);
      mount.removeEventListener("pointermove", onMove);
      mount.removeEventListener("pointerup", onUp);
      mount.removeEventListener("pointerleave", onUp);
      ro.disconnect();
      meshes.forEach((m) => {
        m.mesh.geometry.dispose();
        const mat = m.mesh.material as THREE.ShaderMaterial;
        const tex = mat.uniforms["uTex"]!.value as THREE.Texture | null;
        tex?.dispose();
        mat.dispose();
      });
      renderer.dispose();
    };
  }, [slides, progressMV]);

  const current = slides[active]!;

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative h-[200vh] border-t border-ink/10"
    >
      <div className="sticky top-0 h-[100dvh] w-full overflow-hidden">
        {/* giant background wordmark */}
        <p className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none font-display text-[26vw] font-light leading-none tracking-[-0.04em] text-ink/[0.045]">
          ATELIER
        </p>

        <div
          ref={mountRef}
          className="absolute inset-0 cursor-grab active:cursor-grabbing touch-pan-y"
          style={{ touchAction: "pan-y" }}
        >
          <canvas
            ref={canvasRef}
            className="block h-full w-full"
            style={{ touchAction: "pan-y" }}
          />
        </div>

        <div className="pointer-events-none absolute inset-x-6 top-8 flex items-start justify-between gap-6 sm:inset-x-10">
          <div>
            <Kicker label="02 — Selected works" />
            <RevealText className="mt-3 max-w-xs text-[10px] font-light uppercase leading-relaxed tracking-[0.26em] text-ink-soft">
              Scroll to travel — drag to disturb the surface.
            </RevealText>
          </div>
          <p className="text-[10px] font-light uppercase tracking-[0.28em] text-ink-soft">
            Index / MMXXVI
          </p>
        </div>

        <div className="pointer-events-none absolute inset-x-6 bottom-14 flex items-end justify-between gap-8 sm:inset-x-10">
          <div className="flex items-baseline gap-4">
            <FadeSwap
              text={current.index}
              className="font-display text-xs font-light tracking-[0.3em] text-ink-soft"
            />
            <div>
              <h3 className="font-display text-[9vw] font-light leading-none text-ink sm:text-[3.4vw]">
                <KernedTitle text={current.title} />
              </h3>
              <FadeSwap
                delay={0.14}
                text={current.medium}
                className="mt-2 text-[10px] font-light uppercase tracking-[0.26em] text-ink-soft/80"
              />
            </div>
          </div>
          <p className="hidden text-[10px] font-light uppercase tracking-[0.26em] text-ink-soft sm:block">
            {String(active + 1).padStart(2, "0")} /{" "}
            {String(slides.length).padStart(2, "0")}
          </p>
        </div>

        <div className="absolute inset-x-6 bottom-8 h-px bg-ink/12 sm:inset-x-10">
          <motion.div
            style={{ width: progressWidth }}
            className="relative h-px bg-ink/50"
          >
            <span className="absolute -right-px -top-[2px] h-[5px] w-[5px] rounded-full bg-ink/70" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
