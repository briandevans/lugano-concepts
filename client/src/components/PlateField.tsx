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
uniform sampler2D u_plate;
uniform sampler2D u_tile;
varying vec2 v_uv;

vec2 cover(vec2 uv, float texAspect) {
  float ra = u_res.x / max(u_res.y, 1.0);
  vec2 st = uv;
  if (ra > texAspect) {
    st.y = (uv.y - 0.5) * (texAspect / ra) + 0.5;
  } else {
    st.x = (uv.x - 0.5) * (ra / texAspect) + 0.5;
  }
  return st;
}

void main() {
  vec2 uv = v_uv;
  float t = u_time * 0.055;
  vec2 par = (u_mouse - 0.5) * vec2(0.018, 0.012);

  vec2 plateUv = cover(uv, 16.0 / 9.0) + par * 0.35;
  vec3 plate = texture2D(u_plate, clamp(plateUv, 0.0, 1.0)).rgb;
  vec3 tile = texture2D(u_tile, uv * vec2(2.15, 1.35) + vec2(t * 0.004, -t * 0.002)).rgb;

  float h = dot(tile, vec3(0.28, 0.46, 0.26));
  vec3 N = normalize(vec3((h - 0.5) * 1.15, (tile.g - 0.5) * 0.9, 1.0));
  vec3 L = normalize(vec3(0.42 + sin(t) * 0.22 + par.x * 4.0, 0.62 + par.y * 3.0, 0.74));
  float ndl = clamp(dot(N, L), 0.0, 1.0);
  float spec = pow(ndl, 34.0);

  vec3 col = plate * (0.78 + ndl * 0.28);
  col += vec3(1.0, 0.82, 0.52) * spec * 0.11;
  col += (tile - 0.45) * 0.04;

  float vig = smoothstep(1.18, 0.28, length((uv - vec2(0.5, 0.46)) * vec2(1.08, 0.92)));
  col *= mix(0.78, 1.0, vig);

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
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([62, 42, 22, 255]));
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

export default function PlateField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.style.opacity = "0";

    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: true,
      premultipliedAlpha: false,
    });
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

    let ready = 0;
    const markReady = () => {
      ready += 1;
      if (ready >= 2) canvas.style.opacity = "1";
    };
    const plateTex = loadTexture(gl, "/generated/brass_cadastre_plate.png", markReady);
    const tileTex = loadTexture(gl, "/generated/brass_cadastre_tile.png", markReady);

    const uTime = gl.getUniformLocation(program, "u_time");
    const uRes = gl.getUniformLocation(program, "u_res");
    const uMouse = gl.getUniformLocation(program, "u_mouse");
    const uPlate = gl.getUniformLocation(program, "u_plate");
    const uTile = gl.getUniformLocation(program, "u_tile");

    const mouse = { x: 0.5, y: 0.48 };
    const onMove = (event: PointerEvent) => {
      const box = canvas.getBoundingClientRect();
      mouse.x = (event.clientX - box.left) / box.width;
      mouse.y = 1 - (event.clientY - box.top) / box.height;
    };
    canvas.parentElement?.addEventListener("pointermove", onMove, { passive: true });

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(canvas.clientWidth * dpr));
      canvas.height = Math.max(1, Math.floor(canvas.clientHeight * dpr));
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
      gl.bindTexture(gl.TEXTURE_2D, plateTex);
      gl.uniform1i(uPlate, 0);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, tileTex);
      gl.uniform1i(uTile, 1);
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
