import { Helmet } from "react-helmet";
import { SiteChrome, ABYSS } from "@/components/SiteChrome";
import { MODELS } from "@/lib/protocol";

export default function Docs() {
  return (
    <SiteChrome>
      <Helmet>
        <title>Docs — Lugano</title>
        <meta name="description" content="Lugano API notes, OpenAI-compatible client, and private model catalog." />
      </Helmet>

      <section style={{ padding: "72px 0 96px", background: ABYSS }}>
        <div className="container" style={{ maxWidth: 980 }}>
          <div className="eyebrow" style={{ marginBottom: 14 }}>Docs</div>
          <h1 style={{ fontSize: "clamp(2rem, 4.4vw, 3.4rem)", fontWeight: 800, letterSpacing: "-0.035em", marginBottom: 16 }}>
            OpenAI-compatible private API
          </h1>
          <p style={{ color: "rgba(226,234,246,0.58)", lineHeight: 1.7, maxWidth: 680, marginBottom: 32 }}>
            Design target: drop-in base URL, client-side sealing, attested providers.
            Endpoints below are the intended surface, not a live production cluster.
          </p>

          <div className="lugano-card" style={{ padding: 22, marginBottom: 14 }}>
            <div className="eyebrow" style={{ marginBottom: 10 }}>Base URL</div>
            <code style={{ fontFamily: "'Geist Mono', monospace", color: "#7dd3fc" }}>https://api.lugano.ai/v1</code>
          </div>
          <pre
            className="lugano-card"
            style={{ padding: 22, overflow: "auto", fontFamily: "'Geist Mono', monospace", fontSize: "0.78rem", lineHeight: 1.7, marginBottom: 36 }}
          >{`export LUGANO_API_KEY="lug_..."
export LUGANO_BASE_URL="https://api.lugano.ai/v1"

curl $LUGANO_BASE_URL/chat/completions \\
  -H "Authorization: Bearer $LUGANO_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "kimi-k2.6",
    "messages": [{"role":"user","content":"Hello"}],
    "seal": true
  }'`}</pre>

          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: 14 }}>Catalog</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {MODELS.map((model) => (
              <div key={model.name} className="lugano-card" style={{ padding: "16px 18px", display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 8,
                    background: `${model.color}18`,
                    border: `1px solid ${model.color}35`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: model.color,
                    fontFamily: "'Geist Mono', monospace",
                    fontWeight: 700,
                    fontSize: "0.72rem",
                  }}
                >
                  #{model.rank}
                </div>
                <div style={{ flex: "1 1 180px" }}>
                  <div style={{ fontWeight: 700 }}>{model.name}</div>
                  <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.68rem", color: "rgba(122,154,191,0.7)" }}>{model.org}</div>
                </div>
                <div style={{ flex: "1.2 1 220px", color: "rgba(226,234,246,0.62)", fontSize: "0.86rem" }}>{model.bestFor}</div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {[model.params, model.context, model.badge].map((tag) => (
                    <span key={tag} className="benchmark-badge">{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </SiteChrome>
  );
}
