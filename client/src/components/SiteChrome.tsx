import { Link, useLocation } from "wouter";
import { ArrowRight, Lock } from "lucide-react";
import type { ReactNode } from "react";

const NAV = [
  { href: "/#product", label: "Product" },
  { href: "/privacy", label: "Privacy" },
  { href: "/earn", label: "Earn" },
  { href: "/tokenomics", label: "Token" },
  { href: "/docs", label: "Docs" },
];

const LAKE = "linear-gradient(135deg, #0d72c0 0%, #1a8cd8 50%, #3b9edd 100%)";

export function SiteChrome({ children }: { children: ReactNode }) {
  const [location] = useLocation();

  return (
    <div
      className="min-h-screen text-white overflow-x-hidden"
      style={{ background: "#020c1b", fontFamily: "'Geist', 'Inter', system-ui, sans-serif" }}
    >
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(2, 12, 27, 0.86)",
          backdropFilter: "blur(18px) saturate(160%)",
          borderBottom: "1px solid rgba(59, 158, 221, 0.1)",
        }}
      >
        <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: 8,
                background: LAKE,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 18px rgba(13, 114, 192, 0.4)",
              }}
            >
              <Lock size={14} color="white" strokeWidth={2.5} />
            </div>
            <span style={{ fontSize: "1.02rem", fontWeight: 700, letterSpacing: "-0.02em", color: "#fff" }}>
              Lugano<span style={{ color: "#3b9edd" }}>.ai</span>
            </span>
          </Link>

          <div className="hidden md:flex" style={{ alignItems: "center", gap: 26 }}>
            {NAV.map((item) => {
              const active = item.href.startsWith("/") && location === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    fontSize: "0.8rem",
                    fontWeight: 500,
                    color: active ? "#fff" : "rgba(226,234,246,0.62)",
                    textDecoration: "none",
                  }}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          <Link
            href="/docs"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 14px",
              borderRadius: 8,
              background: LAKE,
              color: "#fff",
              fontSize: "0.8rem",
              fontWeight: 600,
              textDecoration: "none",
              boxShadow: "0 0 18px rgba(13, 114, 192, 0.3)",
            }}
          >
            Start inference
            <ArrowRight size={13} strokeWidth={2.5} />
          </Link>
        </div>
      </nav>

      {children}

      <footer style={{ padding: "56px 0 32px", borderTop: "1px solid rgba(59, 158, 221, 0.08)", background: "#010810" }}>
        <div className="container">
          <div className="footer-grid" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 40, marginBottom: 40 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: LAKE, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Lock size={13} color="white" strokeWidth={2.5} />
                </div>
                <span style={{ fontWeight: 700 }}>Lugano<span style={{ color: "#3b9edd" }}>.ai</span></span>
              </div>
              <p style={{ fontSize: "0.84rem", color: "rgba(122, 154, 191, 0.75)", lineHeight: 1.7, maxWidth: 320 }}>
                Private inference anyone can buy. Idle compute anyone can sell. Access anyone can resell — without revealing the buyer, the seller, or the prompt.
              </p>
            </div>
            {[
              { title: "Product", links: [{ href: "/#product", label: "Network" }, { href: "/privacy", label: "Privacy" }, { href: "/docs", label: "API" }] },
              { title: "Earn", links: [{ href: "/earn", label: "Provide compute" }, { href: "/earn#relay", label: "Relays" }, { href: "/tokenomics", label: "Tokenomics" }] },
              { title: "Protocol", links: [{ href: "/tokenomics", label: "$LUG" }, { href: "/privacy", label: "Claims" }, { href: "/docs", label: "Models" }] },
            ].map((col) => (
              <div key={col.title}>
                <div className="eyebrow" style={{ marginBottom: 14 }}>{col.title}</div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} style={{ fontSize: "0.85rem", color: "rgba(122, 154, 191, 0.7)", textDecoration: "none" }}>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", paddingTop: 20, borderTop: "1px solid rgba(59, 158, 221, 0.08)" }}>
            <p style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.64rem", letterSpacing: "0.1em", color: "rgba(122, 154, 191, 0.4)" }}>
              © 2026 LUGANO — PROTOCOL DESIGN. NOT AN OFFERING.
            </p>
            <p style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.64rem", letterSpacing: "0.08em", color: "rgba(122, 154, 191, 0.45)" }}>
              $LUG / $LIC · attested inference
            </p>
          </div>
        </div>
      </footer>

      <style>{`
        @media (max-width: 768px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 520px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

export const LAKE_GRADIENT = LAKE;
export const ABYSS = "#020c1b";
