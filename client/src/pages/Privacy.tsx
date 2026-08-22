import { Helmet } from "react-helmet";
import { SiteChrome, ABYSS } from "@/components/SiteChrome";
import { COMPARABLES, PRECISE_CLAIMS, PRIVACY_LAYERS } from "@/lib/protocol";

export default function Privacy() {
  return (
    <SiteChrome>
      <Helmet>
        <title>Privacy — Lugano</title>
        <meta name="description" content="Precise privacy claims for Lugano private inference and sealed access relays." />
      </Helmet>

      <section style={{ padding: "72px 0 96px", background: ABYSS }}>
        <div className="container" style={{ maxWidth: 980 }}>
          <div className="eyebrow" style={{ marginBottom: 14 }}>Privacy model</div>
          <h1 style={{ fontSize: "clamp(2rem, 4.4vw, 3.4rem)", fontWeight: 800, letterSpacing: "-0.035em", marginBottom: 16 }}>
            Privacy that can be checked, not just promised.
          </h1>
          <p style={{ color: "rgba(226,234,246,0.58)", lineHeight: 1.7, maxWidth: 680, marginBottom: 48 }}>
            Darkbloom is right about the hard problem: the operator has root and physical custody.
            A marketplace that cannot stop that person from reading prompts is just cheap, leaky inference.
            Lugano copies the operator-blind bar and adds a sealed resale path.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12, marginBottom: 56 }}>
            {PRIVACY_LAYERS.map((layer) => (
              <div key={layer.tag} className="lugano-card" style={{ padding: 22 }}>
                <div className="eyebrow" style={{ marginBottom: 10 }}>{layer.tag}</div>
                <h3 style={{ fontSize: "1.02rem", marginBottom: 8 }}>{layer.title}</h3>
                <p style={{ fontSize: "0.86rem", color: "rgba(226,234,246,0.52)", lineHeight: 1.65 }}>{layer.body}</p>
              </div>
            ))}
          </div>

          <h2 style={{ fontSize: "1.6rem", fontWeight: 800, marginBottom: 16 }}>Precise claims</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 56 }}>
            {PRECISE_CLAIMS.map((row) => (
              <div key={row.claim} className="lugano-card" style={{ padding: 22 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginBottom: 8 }}>
                  <strong>{row.claim}</strong>
                  <span className="benchmark-badge">{row.status}</span>
                </div>
                <p style={{ fontSize: "0.88rem", color: "rgba(226,234,246,0.55)", lineHeight: 1.65 }}>{row.note}</p>
              </div>
            ))}
          </div>

          <h2 style={{ fontSize: "1.6rem", fontWeight: 800, marginBottom: 16 }}>Where this sits</h2>
          <div className="lugano-card" style={{ overflow: "auto" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 0.7fr 1.3fr 1fr 1.6fr",
                minWidth: 760,
                padding: "12px 18px",
                fontFamily: "'Geist Mono', monospace",
                fontSize: "0.6rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "rgba(122,154,191,0.7)",
                borderBottom: "1px solid rgba(59,158,221,0.1)",
              }}
            >
              <span>Project</span>
              <span>Token</span>
              <span>Privacy</span>
              <span>Compute</span>
              <span>Gap</span>
            </div>
            {COMPARABLES.map((row) => (
              <div
                key={row.name}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 0.7fr 1.3fr 1fr 1.6fr",
                  minWidth: 760,
                  padding: "16px 18px",
                  borderBottom: "1px solid rgba(13,37,69,0.8)",
                  fontSize: "0.82rem",
                  background: row.name === "Lugano" ? "rgba(13,114,192,0.08)" : "transparent",
                }}
              >
                <span style={{ fontWeight: 700 }}>{row.name}</span>
                <span style={{ fontFamily: "'Geist Mono', monospace", color: "#7dd3fc" }}>{row.token}</span>
                <span style={{ color: "rgba(226,234,246,0.7)" }}>{row.privacy}</span>
                <span style={{ color: "rgba(226,234,246,0.7)" }}>{row.compute}</span>
                <span style={{ color: "rgba(226,234,246,0.55)" }}>{row.gap}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </SiteChrome>
  );
}
