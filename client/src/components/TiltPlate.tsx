import { useRef, type ReactNode } from "react";

export default function TiltPlate({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      className={`lg-tilt ${className}`}
      style={{ transform: "perspective(1600px) rotateY(-10deg) rotateX(4deg) rotateZ(1.2deg)" }}
      onPointerMove={(event) => {
        const el = ref.current;
        if (!el) return;
        const box = el.getBoundingClientRect();
        const x = (event.clientX - box.left) / box.width - 0.5;
        const y = (event.clientY - box.top) / box.height - 0.5;
        el.style.transform = `perspective(1600px) rotateY(${-10 + x * 10}deg) rotateX(${4 - y * 7}deg) rotateZ(1.2deg) translateZ(12px)`;
      }}
      onPointerLeave={() => {
        const el = ref.current;
        if (!el) return;
        el.style.transform = "perspective(1600px) rotateY(-10deg) rotateX(4deg) rotateZ(1.2deg) translateZ(0)";
      }}
    >
      {children}
    </div>
  );
}
