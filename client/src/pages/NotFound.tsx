import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center" style={{ background: "#020c1b", color: "#e2eaf6" }}>
      <div className="lugano-card" style={{ maxWidth: 420, padding: 36, textAlign: "center" }}>
        <div className="eyebrow" style={{ marginBottom: 12 }}>404</div>
        <h1 style={{ fontSize: "1.6rem", fontWeight: 800, marginBottom: 10 }}>Page not found</h1>
        <p style={{ color: "rgba(226,234,246,0.55)", marginBottom: 22, lineHeight: 1.6 }}>
          That route is not on the mesh.
        </p>
        <Link href="/" style={{ color: "#7dd3fc", fontWeight: 600, textDecoration: "none" }}>
          Back to Lugano
        </Link>
      </div>
    </div>
  );
}
