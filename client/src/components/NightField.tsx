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
uniform sampler2D u_night;
uniform sampler2D u_water;
varying vec2 v_uv;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

void main() {
  vec2 uv = v_uv;
  float t = u_time * 0.045;
  vec2 par = (u_mouse - 0.5) * vec2(0.034, 0.02);

  // Slight table-depth: the plate recedes toward the top.
  vec2 p = uv - vec2(0.5, 0.42);
  p.y *= 1.0 + (uv.y - 0.5) * 0.06;
  vec2 plate = p + vec2(0.5, 0.42);

  float ripple = sin((plate.y + par.y) * 22.0 + t * 1.7) * 0.0031
               + cos((plate.x * 1.55 + par.x) * 11.0 - t * 1.25) * 0.002;
  vec2 warp = vec2(ripple, ripple * 0.7) + par;

  vec3 night = texture2D(u_night, clamp(plate * vec2(1.04, 1.08) + vec2(-0.02, -0.03) + warp, 0.0, 1.0)).rgb;
  vec3 water = texture2D(u_water, clamp(plate * 1.12 + warp * 2.8 + vec2(t * 0.01, t * -0.006), 0.0, 1.0)).rgb;

  vec3 col = mix(night, water, 0.22);
  col *= vec3(0.9, 0.88, 0.82);

  float spec = smoothstep(0.42, 0.88, water.r * 0.62 + water.g * 0.3);
  col += vec3(0.78, 0.52, 0.22) * spec * 0.16;

  float ridge = 1.0 - abs(plate.x - 0.5 - par.x * 0.4);
  col += vec3(0.86, 0.58, 0.24) * pow(ridge, 18.0) * 0.12;

  float vig = smoothstep(1.22, 0.22, length((uv - vec2(0.5, 0.46)) * vec2(1.05, 0.9)));
  col *= mix(0.7, 1.0, vig);

  float g = hash(uv * u_res * 0.5 + t * 0.15);
  col += (g - 0.5) * 0.03;

  gl_FragColor = vec4(col, 1.0);
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

function loadTexture(gl: WebGLRenderingContext, src: string, onReady?: () => void) {
  const texture = gl.createTexture();
  if (!texture) return null;
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
    onReady?.();
  };
  image.src = src;
  return texture;
}

export default function NightField({
  night = "/generated/mhd_lake_plate.png",
  water = "/generated/mhd_filament.png",
}: {
  night?: string;
  water?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const readyRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.style.opacity = "0";
    readyRef.current = 0;
    const markReady = () => {
      readyRef.current += 1;
      if (readyRef.current >= 2 && canvas) canvas.style.opacity = "1";
    };
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

    const nightTex = loadTexture(gl, night, markReady);
    const waterTex = loadTexture(gl, water, markReady);
    const uTime = gl.getUniformLocation(program, "u_time");
    const uRes = gl.getUniformLocation(program, "u_res");
    const uMouse = gl.getUniformLocation(program, "u_mouse");
    const uNight = gl.getUniformLocation(program, "u_night");
    const uWater = gl.getUniformLocation(program, "u_water");

    const mouse = { x: 0.5, y: 0.48 };
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
      gl.useProgram(program);
      gl.uniform1f(uTime, reduceMotion ? 0 : (now - start) / 1000);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, nightTex);
      gl.uniform1i(uNight, 0);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, waterTex);
      gl.uniform1i(uWater, 1);
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
  }, [night, water]);

  return <canvas ref={canvasRef} className="lg-field" aria-hidden="true" />;
}
