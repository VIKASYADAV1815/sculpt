import { useEffect, useRef } from "react";

const VERT = `attribute vec2 p;varying vec2 v;void main(){v=p*0.5+0.5;gl_Position=vec4(p,0.,1.);}`;

const STROKE_FRAG = `precision highp float;
varying vec2 v;
uniform sampler2D uPrev;
uniform vec2 uA, uB;      // aspect-corrected mouse positions
uniform vec2 uAspect;
uniform vec2 uTexel;
uniform float uRadius, uDecay, uActive, uTime;

float h21(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }
float vnoise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  f = f*f*(3.-2.*f);
  return mix(mix(h21(i), h21(i+vec2(1,0)), f.x), mix(h21(i+vec2(0,1)), h21(i+vec2(1,1)), f.x), f.y);
}
float fbm2(vec2 p){
  float a = 0.5, s = 0.0;
  for(int i=0;i<4;i++){ s += a*vnoise(p); p *= 2.11; p += 11.7; a *= 0.5; }
  return s;
}

float seg(vec2 p, vec2 a, vec2 b){
  vec2 pa = p-a, ba = b-a;
  float h = clamp(dot(pa,ba)/max(dot(ba,ba),1e-6),0.,1.);
  return length(pa-ba*h);
}
void main(){
  vec2 q = v*uAspect;

  // --- liquid diffusion: the mask slowly bleeds outward like wet plaster ---
  vec2 flow = vec2(fbm2(q*2.3 + uTime*0.06), fbm2(q*2.3 + 51.7 - uTime*0.05)) - 0.5;
  vec2 suv = v + flow * uTexel * 6.0;
  float c = texture2D(uPrev, suv).r;
  float n1 = texture2D(uPrev, suv + vec2(uTexel.x, 0.0)*1.6).r;
  float n2 = texture2D(uPrev, suv - vec2(uTexel.x, 0.0)*1.6).r;
  float n3 = texture2D(uPrev, suv + vec2(0.0, uTexel.y)*1.6).r;
  float n4 = texture2D(uPrev, suv - vec2(0.0, uTexel.y)*1.6).r;
  float blur = (c*2.0 + n1 + n2 + n3 + n4) / 6.0;
  float prev = mix(c, blur, 0.55) * uDecay;

  // soft, wandering brush — gentle warp so the front stays fluid, not circular
  vec2 w1 = vec2(fbm2(q*3.4 + 2.7 + uTime*0.08), fbm2(q*3.4 + 19.3 - uTime*0.07)) - 0.5;
  vec2 w2 = vec2(fbm2(q*9.0 + 41.1), fbm2(q*9.0 + 77.9)) - 0.5;
  vec2 qq = q + w1*uRadius*0.85 + w2*uRadius*0.22;
  float d = seg(qq, uA, uB);
  float r = uRadius * (0.85 + 0.4*fbm2(q*2.4 + uTime*0.05));
  // smooth, ink-like falloff
  float stamp = pow(1.0 - smoothstep(0.0, r, d), 1.6) * uActive;
  gl_FragColor = vec4(clamp(max(prev, stamp*0.98) + stamp*0.06, 0.0, 1.0), 0., 0., 1.);
}`;

const COMP_FRAG = `precision highp float;
varying vec2 v;
uniform sampler2D uMask, uTop, uBack;
uniform vec2 uRes, uImgTop, uImgBack;
uniform float uTime;

vec2 cover(vec2 uv, vec2 res, vec2 img){
  float rs = res.x/res.y, ri = img.x/img.y;
  vec2 s = rs > ri ? vec2(1.0, ri/rs) : vec2(rs/ri, 1.0);
  return (uv - 0.5)/s + 0.5;
}
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  f = f*f*(3.-2.*f);
  return mix(mix(hash(i), hash(i+vec2(1,0)), f.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y);
}
float fbm(vec2 p){
  float a = 0.5, s = 0.0;
  for(int i=0;i<6;i++){ s += a*noise(p); p *= 2.03; p += 17.3; a *= 0.5; }
  return s;
}
void main(){
  vec2 asp = vec2(uRes.x/uRes.y, 1.0);
  vec2 q = v*asp;

  // slow-drifting fields — motion keeps the edge feeling alive and liquid
  float coarse = fbm(q*3.0 + uTime*0.035);
  float fine   = fbm(q*9.0 - uTime*0.05);
  float grit   = fbm(q*70.0);

  // layered flow warps: the boundary meanders like paint in water
  vec2 warpA = vec2(fbm(q*1.9+3.1  + uTime*0.05), fbm(q*1.9+9.7  - uTime*0.04)) - 0.5;
  vec2 warpB = vec2(fbm(q*5.5+21.3 - uTime*0.03), fbm(q*5.5+63.1 + uTime*0.03)) - 0.5;
  vec2 warpC = vec2(fbm(q*14.0+5.9), fbm(q*14.0+88.2)) - 0.5;
  vec2 wuv = v + warpA*0.070 + warpB*0.026 + warpC*0.008;
  float m = mix(texture2D(uMask, v).r, texture2D(uMask, wuv).r, 0.75);

  float erode = (coarse-0.5)*0.30 + (fine-0.5)*0.16 + (grit-0.5)*0.04;
  float e = m + erode;

  // wide, silky transition instead of a crumbly threshold
  float reveal = smoothstep(0.30, 0.62, e);
  reveal = reveal*reveal*(3.0-2.0*reveal);
  float rim = smoothstep(0.28, 0.46, e) - smoothstep(0.50, 0.78, e);

  // refraction: the back layer bends under the liquid lip
  vec2 refr = normalize(warpA + warpB + 1e-5) * rim * 0.018;
  vec3 back = texture2D(uBack, cover(v + refr, uRes, uImgBack)).rgb;
  vec3 top  = texture2D(uTop,  cover(v - refr*0.4, uRes, uImgTop)).rgb;

  vec3 col = mix(top, back, reveal);
  // glossy meniscus: soft shadow then a satin highlight along the flow front
  col -= rim * 0.075 * (0.7 + coarse*0.5);
  col += pow(rim, 2.0) * 0.10;
  col += (grit - 0.5) * 0.008;
  gl_FragColor = vec4(col, 1.0);
}`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  return s;
}
function program(gl: WebGLRenderingContext, fs: string) {
  const p = gl.createProgram()!;
  gl.attachShader(p, compile(gl, gl.VERTEX_SHADER, VERT));
  gl.attachShader(p, compile(gl, gl.FRAGMENT_SHADER, fs));
  gl.linkProgram(p);
  return p;
}

function loadTex(gl: WebGLRenderingContext, url: string, onLoad: (w: number, h: number) => void) {
  const tex = gl.createTexture()!;
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([240, 238, 232, 255]));
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.onload = () => {
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 0);
    onLoad(img.naturalWidth, img.naturalHeight);
  };
  img.src = url;
  return tex;
}

export default function PlasterRevealCanvas({ topUrl, backUrl }: { topUrl: string; backUrl: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false, powerPreference: "high-performance" });
    if (!gl) return;

    const quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);

    const strokeP = program(gl, STROKE_FRAG);
    const compP = program(gl, COMP_FRAG);
    for (const p of [strokeP, compP]) {
      const loc = gl.getAttribLocation(p, "p");
      gl.bindBuffer(gl.ARRAY_BUFFER, quad);
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    }

    const imgTop = { w: 1, h: 1 };
    const imgBack = { w: 1, h: 1 };
    const texTop = loadTex(gl, topUrl, (w, h) => { imgTop.w = w; imgTop.h = h; });
    const texBack = loadTex(gl, backUrl, (w, h) => { imgBack.w = w; imgBack.h = h; });

    type FBO = { fb: WebGLFramebuffer; tex: WebGLTexture };
    const makeFBO = (w: number, h: number): FBO => {
      const tex = gl.createTexture()!;
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      const fb = gl.createFramebuffer()!;
      gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      return { fb, tex };
    };

    let mw = 0, mh = 0;
    let a: FBO | null = null, b: FBO | null = null;
    const dpr = () => Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const w = Math.floor(canvas.clientWidth * dpr());
      const h = Math.floor(canvas.clientHeight * dpr());
      if (!w || !h) return;
      canvas.width = w; canvas.height = h;
      const nw = Math.max(2, Math.floor(w / 1.5)), nh = Math.max(2, Math.floor(h / 1.5));
      if (nw !== mw || nh !== mh) {
        mw = nw; mh = nh;
        a = makeFBO(mw, mh); b = makeFBO(mw, mh);
      }
    };
    resize();
    window.addEventListener("resize", resize);

    // mouse state (normalized 0..1, y flipped for GL)
    let target = { x: 0.5, y: 0.5 };
    let cur = { x: 0.5, y: 0.5 };
    let prev = { x: 0.5, y: 0.5 };
    let active = 0;
    let hasPointer = false;

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      target = { x: (e.clientX - r.left) / r.width, y: 1 - (e.clientY - r.top) / r.height };
      if (!hasPointer) { cur = { ...target }; prev = { ...target }; hasPointer = true; }
      active = 1;
    };
    const onLeave = () => { active = 0; };
    window.addEventListener("pointermove", onMove, { passive: true });
    canvas.addEventListener("pointerleave", onLeave);

    const uS = {
      prev: gl.getUniformLocation(strokeP, "uPrev"),
      a: gl.getUniformLocation(strokeP, "uA"),
      b: gl.getUniformLocation(strokeP, "uB"),
      aspect: gl.getUniformLocation(strokeP, "uAspect"),
      texel: gl.getUniformLocation(strokeP, "uTexel"),
      radius: gl.getUniformLocation(strokeP, "uRadius"),
      decay: gl.getUniformLocation(strokeP, "uDecay"),
      active: gl.getUniformLocation(strokeP, "uActive"),
      time: gl.getUniformLocation(strokeP, "uTime"),
    };
    const uC = {
      mask: gl.getUniformLocation(compP, "uMask"),
      top: gl.getUniformLocation(compP, "uTop"),
      back: gl.getUniformLocation(compP, "uBack"),
      res: gl.getUniformLocation(compP, "uRes"),
      it: gl.getUniformLocation(compP, "uImgTop"),
      ib: gl.getUniformLocation(compP, "uImgBack"),
      time: gl.getUniformLocation(compP, "uTime"),
    };

    let raf = 0;
    const t0 = performance.now();
    const render = () => {
      raf = requestAnimationFrame(render);
      if (!a || !b) return;
      const t = (performance.now() - t0) / 1000;

      prev = { ...cur };
      cur = { x: cur.x + (target.x - cur.x) * 0.14, y: cur.y + (target.y - cur.y) * 0.14 };
      const asp = canvas.width / canvas.height;
      const vel = Math.hypot((cur.x - prev.x) * asp, cur.y - prev.y);
      const radius = 0.1 + Math.min(vel * 5.0, 0.13);

      // stroke pass -> b
      gl.bindFramebuffer(gl.FRAMEBUFFER, b.fb);
      gl.viewport(0, 0, mw, mh);
      gl.useProgram(strokeP);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, a.tex);
      gl.uniform1i(uS.prev, 0);
      gl.uniform2f(uS.a, prev.x * asp, prev.y);
      gl.uniform2f(uS.b, cur.x * asp, cur.y);
      gl.uniform2f(uS.aspect, asp, 1);
      gl.uniform2f(uS.texel, 1 / mw, 1 / mh);
      gl.uniform1f(uS.radius, radius);
      gl.uniform1f(uS.decay, 0.9962);
      gl.uniform1f(uS.time, t);
      gl.uniform1f(uS.active, hasPointer ? active : 0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      const tmp = a; a = b; b = tmp;

      // composite
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.useProgram(compP);
      gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, a.tex); gl.uniform1i(uC.mask, 0);
      gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, texTop); gl.uniform1i(uC.top, 1);
      gl.activeTexture(gl.TEXTURE2); gl.bindTexture(gl.TEXTURE_2D, texBack); gl.uniform1i(uC.back, 2);
      gl.uniform2f(uC.res, canvas.width, canvas.height);
      gl.uniform2f(uC.it, imgTop.w, imgTop.h);
      gl.uniform2f(uC.ib, imgBack.w, imgBack.h);
      gl.uniform1f(uC.time, t);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
    };
  }, [topUrl, backUrl]);

  return <canvas ref={ref} className="absolute inset-0 h-full w-full" aria-hidden="true" />;
}
