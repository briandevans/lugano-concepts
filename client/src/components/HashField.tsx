import { useEffect, useRef } from "react";

const VERT = `
attribute vec2 a_pos;
varying vec2 v_uv;
void main() {
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

const FRAG = `
precision highp float;
uniform float u_time;
uniform vec2 u_res;
uniform vec2 u_mouse;
uniform vec4 u_seed;
uniform sampler2D u_plate;
varying vec2 v_uv;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

void main() {
  vec2 uv = v_uv;
  float t = u_time * (0.12 + u_seed.x * 0.08);
  vec2 par = (u_mouse - 0.5) * vec2(0.02, 0.012);

  float band = sin(uv.x * (38.0 + u_seed.y * 48.0) + t + u_seed.z * 6.28) * 0.004;
  vec2 warp = vec2(band, band * 0.35 + par.y) + par;

  vec3 plate = texture2D(u_plate, clamp(uv + warp, 0.0, 1.0)).rgb;

  float tick = step(0.985, fract(uv.x * (24.0 + u_seed.w * 20.0) + t * 0.15));
  plate += vec3(0.55, 0.32, 0.12) * tick * uv.x * 0.18;

  float g = hash(uv * u_res * 0.4 + t);
  plate += (g - 0.5) * 0.025;

  float vig = smoothstep(1.15, 0.2, length((uv - vec2(0.62, 0.5)) * vec2(0.95, 1.05)));
  plate *= mix(0.78, 1.0, vig);

  gl_FragColor = vec4(plate, 1.0);
}
`;

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function seedFrom(hex: string): [number, number, number, number] {
  const take = (start: number) => Number.parseInt(hex.slice(start, start + 6) || "80a0c0", 16) / 0xffffff;
  return [take(0), take(6), take(12), take(18)];
}

export default function HashField({
  seed,
  plate = "/generated/hash_fringe.png",
}: {
  seed: string;
  plate?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.style.opacity = "0";
    const gl = canvas.getContext("webgl", { alpha: false, antialias: true, premultipliedAlpha: false });
    if (!gl) return;

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(program, "a_pos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([8, 9, 12, 255]));
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    const image = new Image();
    image.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      canvas.style.opacity = "1";
    };
    image.src = plate;

    const uTime = gl.getUniformLocation(program, "u_time");
    const uRes = gl.getUniformLocation(program, "u_res");
    const uMouse = gl.getUniformLocation(program, "u_mouse");
    const uSeed = gl.getUniformLocation(program, "u_seed");
    const uPlate = gl.getUniformLocation(program, "u_plate");
    const seedVec = seedFrom(seed);
    const mouse = { x: 0.72, y: 0.5 };

    const onMove = (event: PointerEvent) => {
      const box = canvas.getBoundingClientRect();
      mouse.x = (event.clientX - box.left) / box.width;
      mouse.y = 1 - (event.clientY - box.top) / box.height;
    };
    canvas.parentElement?.addEventListener("pointermove", onMove, { passive: true });

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(canvas.clientWidth * dpr);
      canvas.height = Math.floor(canvas.clientHeight * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const start = performance.now();
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    const draw = (now: number) => {
      gl.useProgram(program);
      gl.uniform1f(uTime, reduceMotion ? 0 : (now - start) / 1000);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.uniform4f(uSeed, seedVec[0], seedVec[1], seedVec[2], seedVec[3]);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.uniform1i(uPlate, 0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!reduceMotion) frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      canvas.parentElement?.removeEventListener("pointermove", onMove);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, [plate, seed]);

  return <canvas ref={canvasRef} className="lg-field" aria-hidden="true" />;
}
