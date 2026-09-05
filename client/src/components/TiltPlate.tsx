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
      onPointerMove={(event) => {
        const el = ref.current;
        if (!el) return;
        const box = el.getBoundingClientRect();
        const x = (event.clientX - box.left) / box.width - 0.5;
        const y = (event.clientY - box.top) / box.height - 0.5;
        el.style.transform = `perspective(1400px) rotateY(${x * 11}deg) rotateX(${-y * 8}deg) translateZ(18px)`;
      }}
      onPointerLeave={() => {
        const el = ref.current;
        if (!el) return;
        el.style.transform = "perspective(1400px) rotateY(-7deg) rotateX(3deg) translateZ(0)";
      }}
    >
      {children}
    </div>
  );
}
