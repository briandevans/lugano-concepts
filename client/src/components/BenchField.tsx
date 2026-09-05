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
varying vec2 v_uv;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

void main() {
  vec2 uv = v_uv;
  float t = u_time;
  float grain = hash(uv * u_res * 0.6 + floor(t * 14.0));
  float tube = 1.0 - smoothstep(0.08, 0.42, distance(uv, vec2(0.46, 0.28)));
  float breath = 0.5 + 0.5 * sin(t * 2.05) + 0.25 * sin(t * 7.4);
  vec2 par = (u_mouse - 0.5) * 0.15;
  float heat = tube * (0.10 + breath * 0.04) * (1.0 - distance(uv, 0.5 + par) * 0.35);
  float alpha = 0.07 + grain * 0.10 + heat;
  vec3 col = vec3(0.92, 0.91, 0.88) * (0.55 + grain * 0.45) + vec3(1.0, 0.99, 0.96) * heat;
  gl_FragColor = vec4(col, clamp(alpha, 0.0, 0.22));
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

export default function BenchField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", { alpha: true, antialias: true, premultipliedAlpha: true });
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

    const uTime = gl.getUniformLocation(program, "u_time");
    const uRes = gl.getUniformLocation(program, "u_res");
    const uMouse = gl.getUniformLocation(program, "u_mouse");
    const mouse = { x: 0.46, y: 0.42 };

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
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program);
      gl.uniform1f(uTime, reduceMotion ? 0 : (now - start) / 1000);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
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
  }, []);

  return <canvas ref={canvasRef} className="lg-field" aria-hidden="true" />;
}
