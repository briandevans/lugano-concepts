import { Helmet } from "react-helmet";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { SiteChrome, LAKE_GRADIENT, ABYSS } from "@/components/SiteChrome";
import { MODELS, PRICING, PRIVACY_LAYERS, ROLES } from "@/lib/protocol";

export default function Home() {
  return (
    <SiteChrome>
      <Helmet>
        <title>Lugano — Private inference. Private resale.</title>
        <meta
          name="description"
          content="Encrypted inference on attested hardware. Anyone can buy private inference, sell idle compute, or privately resell access. $LUG captures usage through burns and bonds."
        />
      </Helmet>

      <section style={{ position: "relative", overflow: "hidden", padding: "88px 0 72px" }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(13, 114, 192, 0.2) 0%, transparent 70%)",
          }}
        />
        <div className="grid-overlay" style={{ position: "absolute", inset: 0, opacity: 0.7 }} />

        <div className="container" style={{ position: "relative" }}>
          <div className="animate-fade-up" style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22 }}>
            <div style={{ height: 1, width: 28, background: "rgba(59, 158, 221, 0.6)" }} />
            <span className="eyebrow">Private inference network</span>
          </div>

          <h1
            className="animate-fade-up delay-100"
            style={{
              fontSize: "clamp(2.6rem, 6.4vw, 5.4rem)",
              fontWeight: 800,
              letterSpacing: "-0.045em",
              lineHeight: 0.98,
              maxWidth: 920,
              marginBottom: 22,
            }}
          >
            Private inference anyone can buy.
            <br />
            <span
              style={{
                background: LAKE_GRADIENT,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Access anyone can resell.
            </span>
          </h1>

          <p
            className="animate-fade-up delay-200"
            style={{
              fontSize: "1.08rem",
              color: "rgba(226,234,246,0.62)",
              maxWidth: 620,
              lineHeight: 1.65,
              marginBottom: 36,
            }}
          >
            Lugano routes encrypted jobs to attested Macs, GPUs, and TEEs. Operators cannot read the prompt.
            Unused credits and spare capacity can be resold in a sealed market. Usage burns $LUG.
          </p>

          <div className="animate-fade-up delay-300" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link
              href="/docs"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "13px 20px",
                borderRadius: 10,
                background: LAKE_GRADIENT,
                color: "#fff",
                fontWeight: 600,
                fontSize: "0.9rem",
                textDecoration: "none",
                boxShadow: "0 0 36px rgba(13, 114, 192, 0.4)",
              }}
            >
              Start inference
              <ArrowRight size={15} />
            </Link>
            <Link
              href="/earn"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "13px 20px",
                borderRadius: 10,
                border: "1px solid rgba(59, 158, 221, 0.28)",
                background: "rgba(59, 158, 221, 0.08)",
                color: "rgba(226,234,246,0.9)",
                fontWeight: 500,
                fontSize: "0.9rem",
                textDecoration: "none",
              }}
            >
              Earn on idle compute
            </Link>
          </div>

          <div
            className="animate-fade-up delay-400"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 1,
              marginTop: 64,
              background: "rgba(59, 158, 221, 0.1)",
              border: "1px solid rgba(59, 158, 221, 0.12)",
              borderRadius: 12,
              overflow: "hidden",
            }}
          >
            {[
              { value: "E2EE", label: "Prompt sealed on client" },
              { value: "82%", label: "Paid to the node" },
              { value: "2.5%", label: "Burnt on every resale" },
              { value: "$LUG", label: "Usage-linked burns" },
            ].map((s) => (
              <div key={s.label} style={{ padding: "22px 16px", background: "rgba(7, 20, 40, 0.78)", textAlign: "center" }}>
                <div style={{ fontSize: "1.45rem", fontWeight: 800, letterSpacing: "-0.03em" }}>{s.value}</div>
                <div className="eyebrow" style={{ marginTop: 6, opacity: 0.75, fontSize: "0.58rem" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="lake-divider" />

      <section id="product" style={{ padding: "88px 0", background: "rgba(4, 12, 28, 0.96)" }}>
        <div className="container">
          <div style={{ maxWidth: 640, marginBottom: 48 }}>
            <div className="eyebrow" style={{ marginBottom: 14 }}>Three ways in</div>
            <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 800, letterSpacing: "-0.03em" }}>
              Infer. Provide. Relay.
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14 }}>
            {ROLES.map((role) => (
              <div key={role.id} className="lugano-card" style={{ padding: 28 }}>
                <div className="eyebrow" style={{ marginBottom: 16 }}>{role.kicker}</div>
                <h3 style={{ fontSize: "1.2rem", marginBottom: 10 }}>{role.title}</h3>
                <p style={{ fontSize: "0.9rem", color: "rgba(226,234,246,0.55)", lineHeight: 1.65, marginBottom: 22 }}>
                  {role.body}
                </p>
                <Link href={role.href} style={{ color: "#7dd3fc", fontSize: "0.84rem", fontWeight: 600, textDecoration: "none" }}>
                  {role.cta} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="lake-divider" />

      <section style={{ padding: "88px 0", background: ABYSS }}>
        <div className="container">
          <div style={{ maxWidth: 680, marginBottom: 48 }}>
            <div className="eyebrow" style={{ marginBottom: 14 }}>Operator-blind by design</div>
            <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 14 }}>
              The person running the machine cannot read the job.
            </h2>
            <p style={{ color: "rgba(226,234,246,0.55)", lineHeight: 1.7 }}>
              Same bar as Darkbloom: a marketplace is useless if the host can inspect prompts.
              Four independently checkable layers. See the precise claims on the privacy page.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 }}>
            {PRIVACY_LAYERS.map((layer) => (
              <div key={layer.tag} className="lugano-card" style={{ padding: 24 }}>
                <div className="eyebrow" style={{ marginBottom: 12 }}>{layer.tag}</div>
                <h3 style={{ fontSize: "1.02rem", marginBottom: 10 }}>{layer.title}</h3>
                <p style={{ fontSize: "0.86rem", color: "rgba(226,234,246,0.52)", lineHeight: 1.65 }}>{layer.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="lake-divider" />

      <section style={{ padding: "88px 0", background: "rgba(4, 12, 28, 0.96)" }}>
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", gap: 24, flexWrap: "wrap", marginBottom: 28 }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: 12 }}>Illustrative pricing</div>
              <h2 style={{ fontSize: "clamp(1.7rem, 3.4vw, 2.4rem)", fontWeight: 800 }}>About 50% under typical API rates</h2>
            </div>
            <p style={{ maxWidth: 360, color: "rgba(226,234,246,0.5)", fontSize: "0.88rem", lineHeight: 1.65 }}>
              Idle hardware already paid for itself. Lugano prices the electricity and the attestation, not a datacenter margin.
            </p>
          </div>
          <div className="lugano-card" style={{ overflow: "hidden" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1.4fr 1fr 1fr 1fr",
                gap: 0,
                padding: "12px 20px",
                borderBottom: "1px solid rgba(59, 158, 221, 0.1)",
                fontFamily: "'Geist Mono', monospace",
                fontSize: "0.62rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "rgba(122, 154, 191, 0.7)",
              }}
            >
              <span>Model</span>
              <span>Input / 1M</span>
              <span>Output / 1M</span>
              <span>Typical API</span>
            </div>
            {PRICING.map((row) => (
              <div
                key={row.model}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.4fr 1fr 1fr 1fr",
                  padding: "16px 20px",
                  borderBottom: "1px solid rgba(13, 37, 69, 0.8)",
                  fontSize: "0.9rem",
                }}
              >
                <span>
                  {row.model}
                  <span style={{ display: "block", color: "rgba(122, 154, 191, 0.55)", fontSize: "0.72rem", marginTop: 2 }}>{row.note}</span>
                </span>
                <span style={{ fontFamily: "'Geist Mono', monospace", color: "#7dd3fc" }}>${row.in.toFixed(2)}</span>
                <span style={{ fontFamily: "'Geist Mono', monospace", color: "#7dd3fc" }}>${row.out.toFixed(2)}</span>
                <span style={{ fontFamily: "'Geist Mono', monospace", color: "rgba(226,234,246,0.4)" }}>${row.ref.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="lake-divider" />

      <section style={{ padding: "88px 0", background: ABYSS }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 28, alignItems: "center" }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: 12 }}>OpenAI-compatible</div>
              <h2 style={{ fontSize: "clamp(1.7rem, 3.4vw, 2.4rem)", fontWeight: 800, marginBottom: 14 }}>
                Change the base URL. Keep the SDK.
              </h2>
              <p style={{ color: "rgba(226,234,246,0.55)", lineHeight: 1.7, marginBottom: 22 }}>
                Encryption happens in the client or a thin proxy. Relays never see the prompt. Credits settle as $LIC, value accrues to $LUG.
              </p>
              <Link href="/docs" style={{ color: "#7dd3fc", fontWeight: 600, textDecoration: "none" }}>
                Full API notes →
              </Link>
            </div>
            <pre
              className="lugano-card"
              style={{
                padding: 22,
                overflow: "auto",
                fontFamily: "'Geist Mono', monospace",
                fontSize: "0.78rem",
                lineHeight: 1.7,
                color: "rgba(226,234,246,0.82)",
              }}
            >{`import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://api.lugano.ai/v1",
  apiKey: process.env.LUGANO_KEY,
});

const out = await client.chat.completions.create({
  model: "kimi-k2.6",
  messages: [{ role: "user", content: "…" }],
});`}</pre>
          </div>
        </div>
      </section>

      <div className="lake-divider" />

      <section style={{ padding: "88px 0", background: "rgba(4, 12, 28, 0.96)" }}>
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: 28 }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: 12 }}>Models</div>
              <h2 style={{ fontSize: "clamp(1.7rem, 3.4vw, 2.4rem)", fontWeight: 800 }}>Private open-weight catalog</h2>
            </div>
            <Link href="/docs" style={{ color: "#7dd3fc", fontSize: "0.88rem", fontWeight: 600, textDecoration: "none", alignSelf: "end" }}>
              All models →
            </Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
            {MODELS.slice(0, 6).map((m) => (
              <div key={m.name} className={m.highlight ? "lugano-card-featured" : "lugano-card"} style={{ padding: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10, marginBottom: 12 }}>
                  <div>
                    <div style={{ fontWeight: 700 }}>{m.name}</div>
                    <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.68rem", color: "rgba(122,154,191,0.7)" }}>{m.org}</div>
                  </div>
                  <span className="benchmark-badge">{m.badge}</span>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  {[m.params, m.context].map((tag) => (
                    <span key={tag} className="benchmark-badge">{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="lake-divider" />

      <section style={{ padding: "88px 0 100px", background: ABYSS }}>
        <div className="container">
          <div
            className="lugano-card-featured"
            style={{ padding: "48px 36px", textAlign: "center", maxWidth: 820, margin: "0 auto" }}
          >
            <div className="eyebrow" style={{ marginBottom: 16 }}>Token flywheel</div>
            <h2 style={{ fontSize: "clamp(1.7rem, 3.6vw, 2.6rem)", fontWeight: 800, marginBottom: 14 }}>
              Jobs buy $LUG. Relays lock $LUG. Fills burn $LUG.
            </h2>
            <p style={{ color: "rgba(226,234,246,0.55)", lineHeight: 1.7, maxWidth: 560, margin: "0 auto 28px" }}>
              Fixed 100M supply. Burn-mint credits. 150% relay bonds. veLUG fee share.
              Designed so real inference volume — not emissions — is what tightens float.
            </p>
            <Link
              href="/tokenomics"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "12px 20px",
                borderRadius: 10,
                background: LAKE_GRADIENT,
                color: "#fff",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Read the tokenomics
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </SiteChrome>
  );
}
