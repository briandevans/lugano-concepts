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
uniform sampler2D u_vault;
varying vec2 v_uv;

void main() {
  vec2 uv = v_uv;
  float aspect = u_res.x / max(u_res.y, 1.0);
  float wide = smoothstep(0.92, 1.18, aspect);

  vec2 center = mix(vec2(0.52, 0.58), vec2(0.72, 0.47), wide);
  float radius = mix(0.30, 0.36, wide);

  float t = u_time;
  vec2 drift = vec2(sin(t * 0.31) * 0.010, cos(t * 0.23) * 0.007);
  vec2 par = (u_mouse - 0.5) * vec2(0.04, 0.028);

  vec2 p = (uv - center - drift - par) * vec2(aspect, 1.0);
  float d = length(p);

  float contact = smoothstep(radius + 0.16, radius * 0.15, length(p + vec2(0.03, 0.07)));
  float outside = smoothstep(radius + 0.008, radius, d);

  if (outside >= 1.0) {
    gl_FragColor = vec4(0.0, 0.0, 0.0, contact * 0.28);
    return;
  }

  float z = sqrt(max(radius * radius - d * d, 0.0));
  vec3 n = normalize(vec3(p / radius, z / radius));

  float ior = 0.155 + 0.018 * sin(t * 0.7);
  vec2 offset = n.xy * ior * (0.42 + 0.58 * n.z);
  vec2 sampleUv = uv - offset * vec2(0.22 / aspect, 0.22);

  vec3 cr = texture2D(u_vault, clamp(sampleUv + vec2(0.010, 0.0), 0.0, 1.0)).rgb;
  vec3 cg = texture2D(u_vault, clamp(sampleUv, 0.0, 1.0)).rgb;
  vec3 cb = texture2D(u_vault, clamp(sampleUv - vec2(0.008, 0.0), 0.0, 1.0)).rgb;
  vec3 col = vec3(cr.r, cg.g, cb.b);

  col = mix(col, vec3(0.70, 0.84, 0.90), 0.07);

  float ndotv = max(n.z, 0.0);
  float fres = pow(1.0 - ndotv, 2.45);
  col += vec3(0.80, 0.91, 0.97) * fres * 0.48;

  vec3 L1 = normalize(vec3(0.28 + sin(t * 0.55) * 0.62, 0.48 + cos(t * 0.41) * 0.28, 0.78));
  vec3 L2 = normalize(vec3(-0.55 + cos(t * 0.33) * 0.2, 0.15, 0.62));
  float spec = pow(max(dot(n, L1), 0.0), 86.0);
  float specSoft = pow(max(dot(n, L2), 0.0), 28.0);
  col += vec3(1.0) * spec * 0.78;
  col += vec3(0.52, 0.76, 0.90) * specSoft * 0.22;

  float bevel = smoothstep(0.016, 0.0, abs(d - radius * 0.93));
  col += vec3(0.74, 0.88, 0.96) * bevel * 0.32;

  float inner = smoothstep(radius * 0.22, radius * 0.70, d) * (1.0 - fres);
  col *= mix(1.0, 0.90, inner * 0.35);

  float alpha = (1.0 - outside) * (0.58 + fres * 0.34 + spec * 0.12);
  alpha = clamp(alpha + contact * 0.08, 0.0, 0.92);

  gl_FragColor = vec4(col, alpha);
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

export default function GlassSeal() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: false,
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

    const uTime = gl.getUniformLocation(program, "u_time");
    const uRes = gl.getUniformLocation(program, "u_res");
    const uMouse = gl.getUniformLocation(program, "u_mouse");
    const uVault = gl.getUniformLocation(program, "u_vault");

    const texture = gl.createTexture();
    if (!texture) return;
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      1,
      1,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      new Uint8Array([3, 7, 11, 255]),
    );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    const image = new Image();
    image.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    };
    image.src = "/vault-01.jpg";

    gl.uniform1i(uVault, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const mouse = { x: 0.5, y: 0.5 };
    const onMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      mouse.x = (event.clientX - rect.left) / rect.width;
      mouse.y = 1 - (event.clientY - rect.top) / rect.height;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.max(1, Math.floor(canvas.clientWidth * dpr));
      canvas.height = Math.max(1, Math.floor(canvas.clientHeight * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    gl.clearColor(0, 0, 0, 0);
    const start = performance.now();
    let frame = 0;

    const draw = (now: number) => {
      const time = reduced.matches ? 0.8 : (now - start) / 1000;
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.uniform1f(uTime, time);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!reduced.matches) {
        frame = requestAnimationFrame(draw);
      }
    };

    draw(performance.now());

    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return <canvas ref={canvasRef} className="hero-glass" aria-hidden="true" />;
}
