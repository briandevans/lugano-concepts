import { useMemo, useState, type ReactNode } from "react";
import { Helmet } from "react-helmet";
import { SiteChrome, ABYSS } from "@/components/SiteChrome";
import {
  ALLOCATION,
  BURNS,
  EMISSIONS,
  LOCKS,
  SUPPLY,
  estimateMonth,
  formatTokens,
} from "@/lib/protocol";

export default function Tokenomics() {
  const [volume, setVolume] = useState(2_000_000);
  const [lugShare, setLugShare] = useState(0.35);
  const [relayShare, setRelayShare] = useState(0.25);
  const [price, setPrice] = useState(0.4);

  const est = useMemo(
    () => estimateMonth({ volumeUsd: volume, lugPayShare: lugShare, relayShare, lugPrice: price }),
    [volume, lugShare, relayShare, price],
  );

  return (
    <SiteChrome>
      <Helmet>
        <title>$LUG Tokenomics — Lugano</title>
        <meta name="description" content="Lugano tokenomics: fixed 100M LUG, burn-mint credits, relay bonds, and usage-linked sinks." />
      </Helmet>

      <section style={{ padding: "72px 0 96px", background: ABYSS }}>
        <div className="container" style={{ maxWidth: 1040 }}>
          <div className="eyebrow" style={{ marginBottom: 14 }}>$LUG / $LIC</div>
          <h1 style={{ fontSize: "clamp(2rem, 4.4vw, 3.4rem)", fontWeight: 800, letterSpacing: "-0.035em", marginBottom: 16 }}>
            A token that only tightens when people actually run models.
          </h1>
          <p style={{ color: "rgba(226,234,246,0.58)", lineHeight: 1.7, maxWidth: 720, marginBottom: 36 }}>
            Most DeAI tokens inflate to pay GPUs, then providers dump. Lugano borrows Akash’s burn-mint
            credit, Dolphin’s bonded nodes, and adds a sealed-resale sink Darkbloom does not have.
            Fixed {formatTokens(SUPPLY.total)} {SUPPLY.symbol}. No uncapped emissions.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10, marginBottom: 48 }}>
            {[
              { k: "Hard cap", v: "100,000,000" },
              { k: "Fee to nodes", v: "82%" },
              { k: "Permanent take-rate burn", v: "4.2%" },
              { k: "Relay fill burn", v: "2.5%" },
              { k: "Relay bond", v: "150%" },
              { k: "Reward decay", v: "8 years" },
            ].map((x) => (
              <div key={x.k} className="lugano-card" style={{ padding: 18 }}>
                <div className="eyebrow" style={{ marginBottom: 8 }}>{x.k}</div>
                <div style={{ fontSize: "1.25rem", fontWeight: 800 }}>{x.v}</div>
              </div>
            ))}
          </div>

          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: 14 }}>Allocation</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 48 }}>
            {ALLOCATION.map((row) => (
              <div key={row.key} className="lugano-card" style={{ padding: "16px 18px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginBottom: 8 }}>
                  <strong>{row.label}</strong>
                  <span style={{ fontFamily: "'Geist Mono', monospace", color: row.color }}>
                    {row.pct}% · {formatTokens(row.amount)}
                  </span>
                </div>
                <div style={{ height: 6, borderRadius: 99, background: "rgba(59,158,221,0.08)", overflow: "hidden", marginBottom: 8 }}>
                  <div style={{ width: `${row.pct * 2.2}%`, height: "100%", background: row.color }} />
                </div>
                <p style={{ fontSize: "0.84rem", color: "rgba(226,234,246,0.5)", margin: 0 }}>{row.unlock}</p>
              </div>
            ))}
          </div>

          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: 10 }}>Two assets, one value sink</h2>
          <p style={{ color: "rgba(226,234,246,0.55)", lineHeight: 1.7, marginBottom: 16, maxWidth: 760 }}>
            <strong style={{ color: "#fff" }}>$LUG</strong> is scarce, staked, burned, and governed.
            <strong style={{ color: "#fff" }}> $LIC</strong> is a USD-denominated inference credit minted only by burning or vaulting LUG.
            Users can pay USDC; the protocol still market-buys LUG. Providers can take LUG or cash out. The bid is the next job.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12, marginBottom: 48 }}>
            {[
              { t: "USDC path", d: "100% of spend buys LUG → BME vault. Job settles, most remints to the node. 4.2% stays dead." },
              { t: "LUG path", d: "User already holds LUG. 8% discount, matched by an extra burn. Strongest buy-and-hold reason." },
              { t: "Relay path", d: "Secondary fill burns 2.5% and locks 150% inventory. This is the moon lever if resale volume exists." },
            ].map((c) => (
              <div key={c.t} className="lugano-card" style={{ padding: 22 }}>
                <h3 style={{ fontSize: "1.02rem", marginBottom: 8 }}>{c.t}</h3>
                <p style={{ fontSize: "0.86rem", color: "rgba(226,234,246,0.52)", lineHeight: 1.65 }}>{c.d}</p>
              </div>
            ))}
          </div>

          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: 14 }}>Burns</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 48 }}>
            {BURNS.map((b) => (
              <div key={b.name} className="lugano-card" style={{ padding: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                  <strong>{b.name}</strong>
                  <span className="benchmark-badge">{b.rate}</span>
                </div>
                <p style={{ fontSize: "0.86rem", color: "rgba(226,234,246,0.52)", lineHeight: 1.65, marginTop: 8 }}>{b.detail}</p>
              </div>
            ))}
          </div>

          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: 14 }}>Locks that remove float</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12, marginBottom: 48 }}>
            {LOCKS.map((l) => (
              <div key={l.name} className="lugano-card" style={{ padding: 22 }}>
                <h3 style={{ fontSize: "1.02rem", marginBottom: 8 }}>{l.name}</h3>
                <p style={{ fontSize: "0.86rem", color: "rgba(226,234,246,0.7)", marginBottom: 8 }}>{l.rule}</p>
                <p style={{ fontSize: "0.84rem", color: "rgba(226,234,246,0.48)" }}>{l.effect}</p>
              </div>
            ))}
          </div>

          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: 14 }}>Emissions</h2>
          <div className="lugano-card" style={{ overflow: "hidden", marginBottom: 48 }}>
            {EMISSIONS.map((e) => (
              <div key={e.year} style={{ display: "grid", gridTemplateColumns: "140px 120px 1fr", gap: 12, padding: "14px 18px", borderBottom: "1px solid rgba(13,37,69,0.8)" }}>
                <strong>{e.year}</strong>
                <span style={{ fontFamily: "'Geist Mono', monospace", color: "#7dd3fc" }}>{e.minted}</span>
                <span style={{ color: "rgba(226,234,246,0.55)", fontSize: "0.88rem" }}>{e.note}</span>
              </div>
            ))}
          </div>

          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: 10 }}>Monthly sink calculator</h2>
          <p style={{ color: "rgba(226,234,246,0.5)", marginBottom: 16, fontSize: "0.9rem" }}>
            Illustrative. Move the sliders to see how usage, LUG payment share, and relay volume pull tokens out of float.
          </p>
          <div className="lugano-card" style={{ padding: 24, marginBottom: 28 }}>
            <Control label={`Monthly inference volume  ·  $${volume.toLocaleString()}`} >
              <input type="range" min={100000} max={20000000} step={100000} value={volume} onChange={(e) => setVolume(Number(e.target.value))} />
            </Control>
            <Control label={`Paid in LUG  ·  ${Math.round(lugShare * 100)}%`}>
              <input type="range" min={0} max={1} step={0.05} value={lugShare} onChange={(e) => setLugShare(Number(e.target.value))} />
            </Control>
            <Control label={`Routed through relays  ·  ${Math.round(relayShare * 100)}%`}>
              <input type="range" min={0} max={1} step={0.05} value={relayShare} onChange={(e) => setRelayShare(Number(e.target.value))} />
            </Control>
            <Control label={`Assumed LUG price  ·  $${price.toFixed(2)}`}>
              <input type="range" min={0.05} max={5} step={0.05} value={price} onChange={(e) => setPrice(Number(e.target.value))} />
            </Control>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10, marginTop: 18 }}>
              <Stat k="Permanent burn" v={`${est.permanentBurnLug.toLocaleString(undefined, { maximumFractionDigits: 0 })} LUG`} s={`$${est.permanentBurnUsd.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} />
              <Stat k="BME vault lock" v={`${est.vaultLockLug.toLocaleString(undefined, { maximumFractionDigits: 0 })} LUG`} s="Until jobs settle" />
              <Stat k="Relay bonds" v={`${est.relayBondLug.toLocaleString(undefined, { maximumFractionDigits: 0 })} LUG`} s="150% of listed book" />
              <Stat k="Float touched" v={`${est.floatRemovedLug.toLocaleString(undefined, { maximumFractionDigits: 0 })} LUG`} s="Burn + lock + bond" />
            </div>
          </div>

          <div className="lugano-card" style={{ padding: 24 }}>
            <h2 style={{ fontSize: "1.25rem", marginBottom: 10 }}>Why this can reprice — and why it might not</h2>
            <p style={{ color: "rgba(226,234,246,0.55)", lineHeight: 1.7, marginBottom: 10 }}>
              If private inference demand is real, every dollar of usage is a bid for LUG, every relay book
              is a lock, and burns rise with volume. That is the same structural story AKT tried to tell with BME,
              plus a second surface (resale) that Akash, Dolphin, and Darkbloom do not have.
            </p>
            <p style={{ color: "rgba(226,234,246,0.55)", lineHeight: 1.7 }}>
              It does not moon if jobs never show up. Akash’s 2026 BME window showed the mechanism can be
              real while volume is still too small to bend supply. Provider dumps, unlocks, and fake
              “resell OpenAI keys” products would kill it. This page is a protocol design, not a return forecast.
            </p>
          </div>
        </div>
      </section>
    </SiteChrome>
  );
}

function Control({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label style={{ display: "grid", gap: 8, marginBottom: 14, fontSize: "0.82rem", color: "rgba(226,234,246,0.7)" }}>
      {label}
      {children}
      <style>{`input[type=range] { width: 100%; accent-color: #3b9edd; }`}</style>
    </label>
  );
}

function Stat({ k, v, s }: { k: string; v: string; s: string }) {
  return (
    <div style={{ padding: 14, background: "rgba(2,12,27,0.5)", borderRadius: 8, border: "1px solid rgba(13,37,69,0.9)" }}>
      <div className="eyebrow" style={{ marginBottom: 8 }}>{k}</div>
      <div style={{ fontWeight: 800, marginBottom: 4 }}>{v}</div>
      <div style={{ fontSize: "0.75rem", color: "rgba(122,154,191,0.7)" }}>{s}</div>
    </div>
  );
}
