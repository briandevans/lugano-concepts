import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { SiteChrome, ABYSS } from "@/components/SiteChrome";
import { FEE_SPLIT } from "@/lib/protocol";

export default function Earn() {
  useEffect(() => {
    const id = window.location.hash.replace("#", "");
    if (!id) return;
    document.getElementById(id)?.scrollIntoView({ block: "start" });
  }, []);

  return (
    <SiteChrome>
      <Helmet>
        <title>Earn — Lugano</title>
        <meta name="description" content="Earn LUG by providing attested compute or privately reselling sealed inference access." />
      </Helmet>

      <section style={{ padding: "72px 0 96px", background: ABYSS }}>
        <div className="container" style={{ maxWidth: 980 }}>
          <div className="eyebrow" style={{ marginBottom: 14 }}>Earn</div>
          <h1 style={{ fontSize: "clamp(2rem, 4.4vw, 3.4rem)", fontWeight: 800, letterSpacing: "-0.035em", marginBottom: 16 }}>
            Get paid to keep the mesh private.
          </h1>
          <p style={{ color: "rgba(226,234,246,0.58)", lineHeight: 1.7, maxWidth: 680, marginBottom: 40 }}>
            Two honest ways to make money. Run attested hardware. Or bond $LUG and resell sealed access.
            Relays never see prompts. Providers never see who bought the job through a relay.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14, marginBottom: 56 }}>
            <div className="lugano-card-featured" style={{ padding: 28 }}>
              <div className="eyebrow" style={{ marginBottom: 12 }}>Provide</div>
              <h2 style={{ fontSize: "1.35rem", marginBottom: 10 }}>Sell idle compute</h2>
              <p style={{ color: "rgba(226,234,246,0.55)", lineHeight: 1.65, marginBottom: 18 }}>
                Mac, CUDA box, or TEE host. Worker joins a peer-to-pool — no long reservations.
                You can leave when you need the GPU back.
              </p>
              <ul style={{ padding: 0, margin: 0, listStyle: "none", display: "grid", gap: 8, color: "rgba(226,234,246,0.7)", fontSize: "0.88rem" }}>
                <li>• {FEE_SPLIT.provider}% of each completed job</li>
                <li>• Optional LUG bond → priority routing</li>
                <li>• 5% bonus if you take settlement in LUG</li>
                <li>• Slash only on failed attestation or leak</li>
              </ul>
            </div>
            <div id="relay" className="lugano-card" style={{ padding: 28 }}>
              <div className="eyebrow" style={{ marginBottom: 12 }}>Relay</div>
              <h2 style={{ fontSize: "1.35rem", marginBottom: 10 }}>Resell sealed access</h2>
              <p style={{ color: "rgba(226,234,246,0.55)", lineHeight: 1.65, marginBottom: 18 }}>
                List unused LIC or spare node capacity. Buyers get a one-time capability.
                You earn the spread. 2.5% of the fill burns.
              </p>
              <ul style={{ padding: 0, margin: 0, listStyle: "none", display: "grid", gap: 8, color: "rgba(226,234,246,0.7)", fontSize: "0.88rem" }}>
                <li>• {FEE_SPLIT.relay}% protocol relay share + your spread</li>
                <li>• Bond 150% of listed inventory in LUG</li>
                <li>• Identity-blind matching</li>
                <li>• First-party compute only — no third-party API keys</li>
              </ul>
            </div>
          </div>

          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: 14 }}>What you can sell</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12, marginBottom: 48 }}>
            {[
              { t: "Your node hours", d: "Capacity you already run. Highest trust. Bond can be smaller because the machine is attested." },
              { t: "Prepaid LIC", d: "Credits you bought and will not use. Sell the sealed voucher. You never touch the buyer's prompt." },
              { t: "Priority lanes", d: "veLUG holders can sell boosted routing windows — still operator-blind." },
            ].map((card) => (
              <div key={card.t} className="lugano-card" style={{ padding: 22 }}>
                <h3 style={{ fontSize: "1.02rem", marginBottom: 8 }}>{card.t}</h3>
                <p style={{ fontSize: "0.86rem", color: "rgba(226,234,246,0.52)", lineHeight: 1.65 }}>{card.d}</p>
              </div>
            ))}
          </div>

          <div className="lugano-card" style={{ padding: 28, marginBottom: 28 }}>
            <h2 style={{ fontSize: "1.3rem", marginBottom: 10 }}>Worked earnings</h2>
            <p style={{ color: "rgba(226,234,246,0.55)", lineHeight: 1.7, marginBottom: 16 }}>
              A Mac Studio serving MiniMax-class traffic at $40/day of completions: ~$32.80 to the node.
              Bonding $LUG can lift fill rate. A relay turning $10k/month of unused credits at a 6% spread
              earns $600 plus the 6% protocol relay share, while $250 burns and $15k of LUG stays locked.
            </p>
            <p style={{ color: "rgba(226,234,246,0.4)", fontSize: "0.8rem" }}>
              Illustrative. Real fill depends on demand, model, attestation tier, and bond. Not a return promise.
            </p>
          </div>

          <div
            style={{
              padding: 28,
              borderRadius: 12,
              background: "rgba(13, 114, 192, 0.1)",
              border: "1px solid rgba(59, 158, 221, 0.22)",
            }}
          >
            <div className="eyebrow" style={{ marginBottom: 10 }}>Worker install (design)</div>
            <pre style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.82rem", color: "#7dd3fc", margin: 0 }}>
              curl -fsSL https://api.lugano.ai/install.sh | bash
            </pre>
            <p style={{ marginTop: 12, fontSize: "0.84rem", color: "rgba(226,234,246,0.5)" }}>
              Same friction target as Darkbloom / Ollama. Protocol is in design — this command is the intended UX, not a live installer.
            </p>
          </div>
        </div>
      </section>
    </SiteChrome>
  );
}
