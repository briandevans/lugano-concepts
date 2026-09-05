import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import PlateField from "../components/PlateField";
import "./home.css";

const MEASURES = [
  { key: "MRTD", value: "dd9d8f30b4acae6da08575b2d5f32e3e43fae5c3130ea67cc81233200845192bde0281b75b907892d37359b19586daa9" },
  { key: "RTMR0", value: "f3601c3c6770be1e7c042a47caf1133a794cb38f440a327426fa8406b97220522f9e200554e6991b01de0e598615ccf1" },
  { key: "RTMR1", value: "d516df163a45fca0d1abd9f1b59dbb9c71cb231101f4e655c9d73401c6b02fafde026e6bb4de41a8183616b620bd2152" },
  { key: "RTMR2", value: "a9a2fa5daaf831ec0072bac9c78327b3745948e79cd89497e7999a0952d248d1efec8c032456c3034ea5eb1ee1ea6ece" },
  { key: "RTMR3", value: "f4e97ade7149b4fc5057f0e80cf112303daf4e2f30b2b30f874eac595309e9f6030bbe538ecb25437a37b5db9124b478" },
] as const;

function ZeroMark({ className, heavy = false }: { className?: string; heavy?: boolean }) {
  return (
    <svg className={className ?? "lg-zero-mark"} viewBox="0 0 64 100" aria-hidden="true">
      <ellipse
        cx="32"
        cy="50"
        rx="19"
        ry="35"
        fill="none"
        stroke="currentColor"
        strokeWidth={heavy ? 13.5 : 11}
      />
      <line
        x1="19"
        y1="71"
        x2="45"
        y2="29"
        stroke="currentColor"
        strokeWidth={heavy ? 10.5 : 8.5}
        strokeLinecap="butt"
      />
    </svg>
  );
}

function hashGroups(value: string) {
  return value.match(/.{8}/g) ?? [];
}

function formatIssued(date: Date) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const day = String(date.getUTCDate()).padStart(2, "0");
  const hour = String(date.getUTCHours()).padStart(2, "0");
  const minute = String(date.getUTCMinutes()).padStart(2, "0");
  return `${day} ${months[date.getUTCMonth()]} ${date.getUTCFullYear()} ${hour}:${minute} UTC`;
}


const STEPS = [
  {
    n: "/01",
    title: "Prompt",
    body: "Your query enters the system. Encrypted end-to-end before it touches any infrastructure.",
  },
  {
    n: "/02",
    title: "Privacy routing",
    body: "Access controls, model permissions, and privacy boundaries are enforced at the protocol layer. Sensitive data stays inside the verified path.",
  },
  {
    n: "/03",
    title: "TEE inference",
    body: "Frontier models execute inside a hardware-sealed enclave. Your data never leaves the trusted execution environment.",
  },
  {
    n: "/04",
    title: "Attestation record",
    body: "Each run returns verifiable privacy attestations across 10+ checks, covering execution state, routing, policy, receipt integrity, disclosure scope, and retention posture.",
  },
  {
    n: "/05",
    title: "Response",
    body: "Results delivered with a verifiable attestation. You can prove what happened, and what did not.",
  },
] as const;

const PILLARS = [
  {
    n: "/0.1",
    title: "Trustless by design.",
    body: "You don't have to trust us. Everything is verifiable. No data leaked during inference, not during orchestration, no logging. The architecture makes exfiltration impossible.",
  },
  {
    n: "/0.2",
    title: "Sovereignty by default.",
    body: "Run in your cloud, on-prem, or restricted environments without surrendering the control boundary.",
  },
  {
    n: "/0.3",
    title: "Drop-in replacement.",
    body: "Your team keeps building with the same tools they already know. The difference is invisible to developers and transformative for your risk profile.",
  },
  {
    n: "/0.4",
    title: "Verify everything.",
    body: "Every protected run emits attestation, key release, sealed execution, and receipt records.",
  },
  {
    n: "/0.5",
    title: "Cryptographic proof.",
    body: "Every operation logged, attributable, and tamper-evident. When regulators ask how you protect data, you hand them verifiable records.",
  },
  {
    n: "/0.6",
    title: "Governance at the protocol layer.",
    body: "Access controls, data routing, and model permissions enforced by the infrastructure itself. Not a dashboard toggle. Not a policy PDF. Code that cannot be overridden.",
  },
] as const;

const RECEIPT = `{
  "tee": "verified",
  "data_egress": "none",
  "boundary": "sealed",
  "hash": "a3f7e2c8b19d…9c41",
  "status": "VERIFIED"
}`;

const CASES = [
  {
    title: "Government and defense",
    image: "/generated/case_defense_night.png",
    alt: "A mountain road tunnel at night, wet asphalt under a single sodium lamp",
    summary:
      "Bring cutting edge model capability closer to sovereign, classified, or disconnected environments.",
    bullets: [
      "Sovereign deployment patterns.",
      "Air-gapped or restricted networks.",
      "Mission-sensitive workflows.",
    ],
    featured: true,
  },
  {
    title: "Enterprise",
    image: "/generated/case_enterprise_night.png",
    alt: "An empty glass lobby at night, seen through rain, one lamp on the desk",
    summary: "Deploy AI across operations. Prove your data posture.",
    bullets: [
      "Use frontier models across your organization without new exposure surfaces",
      "Protect IP, trade secrets, and sensitive workflows",
      "We handle everything for you. Verifiably private.",
    ],
  },
  {
    title: "Regulated industries",
    image: "/generated/case_records.png",
    alt: "A records room of rolling archive shelves and labeled cardboard boxes",
    summary:
      "Deploy AI against sensitive internal data while preserving reviewable privacy boundaries.",
    bullets: [
      "Internal knowledge work.",
      "Sensitive analysis.",
      "Legal, finance, healthcare, and operations workflows.",
    ],
  },
] as const;

const AGENTS = [
  {
    title: "Hermes Agent",
    logo: "/brand-assets/hermes-agent.webp",
    summary:
      "Private software delivery agents with repository memory, tool access, and auditable action logs.",
  },
  {
    title: "OpenClaw",
    emoji: "🦞",
    summary:
      "Open agent runtime for long-horizon research and automation inside isolated infrastructure.",
  },
  {
    title: "Private agents",
    emoji: "⬡",
    summary:
      "Run agentic workflows without turning tools, logs, and intermediate steps into exposure surfaces.",
    bullets: [
      "Private tool use.",
      "Reduced transcript leakage.",
      "Reviewable action evidence.",
    ],
  },
] as const;

const MODELS = [
  {
    title: "GLM-5.2",
    maker: "Z.ai",
    logo: "/brand-assets/zai.webp",
    specs: "1M context / 128K output",
    best: "Long-horizon",
    extra: "Coding #1 open · MCP",
  },
  {
    title: "Kimi K2.6",
    maker: "Moonshot AI",
    logo: "/brand-assets/kimi.ico",
    specs: "1T MoE / 262K context",
    best: "All-round",
    extra: "Tools · Vision",
  },
  {
    title: "DeepSeek V4 Pro",
    maker: "DeepSeek",
    logo: "/brand-assets/deepseek.ico",
    specs: "1.6T MoE / 49B active",
    best: "Instruction",
    extra: "1M context · Dual modes",
  },
  {
    title: "MiniMax M3",
    maker: "MiniMax",
    logo: "/brand-assets/minimax.webp",
    specs: "1M context / native multimodal",
    best: "OS coding",
    extra: "Browse 83.5 · Open deploy",
  },
  {
    title: "GLM-5.1",
    maker: "Z.ai",
    logo: "/brand-assets/zai.webp",
    specs: "200K context / 128K output",
    best: "Long tasks",
    extra: "8h horizon · MCP",
  },
  {
    title: "MiMo-V2.5-Pro",
    maker: "Xiaomi",
    logo: "/brand-assets/xiaomi.svg",
    specs: "MIT weights / 1M context",
    best: "Harness",
    extra: "ClawEval #1 · GDPVal #1",
  },
] as const;

const NAV = [
  { href: "#platform", label: "Platform" },
  { href: "#architecture", label: "Architecture" },
  { href: "#privacy", label: "Privacy" },
  { href: "#docs", label: "Docs" },
] as const;

function Folio({ n, label }: { n: string; label: string }) {
  return (
    <div className="lg-folio">
      {n ? <span>{n}</span> : null}
      <em>{label}</em>
    </div>
  );
}

function BenchTick({ className }: { className?: string }) {
  return (
    <svg className={className ?? "lg-sp-tick"} viewBox="0 0 20 20" aria-hidden="true">
      <path d="M10 1.5v17M4 6.2h12M5.8 13.8h8.4" fill="none" stroke="currentColor" strokeWidth="1.35" />
    </svg>
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [pillar, setPillar] = useState(0);
  const [issued] = useState(() => formatIssued(new Date()));

  useEffect(() => {
    const path = window.location.pathname.replace(/\/$/, "");
    if (path !== "/docs") return;
    const frame = window.requestAnimationFrame(() => {
      document.getElementById("docs")?.scrollIntoView({ block: "start" });
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="lg">
      <Helmet>
        <title>Lugano.ai — Private AI Infrastructure</title>
        <meta
          name="description"
          content="Provably private AI infrastructure: any model, cryptographically auditable, zero-trust by default."
        />
      </Helmet>

      <a className="lg-skip" href="#top">
        Skip to content
      </a>

      <div className="lg-sheet lg-sp">
        <img className="lg-field-fallback" src="/generated/brass_cadastre_plate.png" alt="" />
        <PlateField />
        <header className="lg-nav">
          <div className="lg-nav-inner">
            <a className="lg-brand" href="#top" onClick={() => setMenuOpen(false)}>
              <BenchTick />
              <span className="lg-wordmark">Lugano</span>
            </a>
            <nav className="lg-nav-links" aria-label="Primary">
              {NAV.map((item) => (
                <a key={item.href} href={item.href}>
                  {item.label}
                </a>
              ))}
              <a className="lg-sp-nav-cta" href="mailto:contact@lugano.ai">
                Request access
              </a>
            </nav>
            <button
              className="lg-menu-btn"
              type="button"
              aria-expanded={menuOpen}
              aria-label="Open menu"
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span />
            </button>
          </div>
          <div className={`lg-mobile-panel${menuOpen ? " is-open" : ""}`}>
            {NAV.map((item) => (
              <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>
                {item.label}
              </a>
            ))}
            <a href="mailto:contact@lugano.ai" onClick={() => setMenuOpen(false)}>
              Request briefing
            </a>
          </div>
        </header>

        <section id="top" className="lg-sp-stage">
          <article className="lg-sp-sheet" aria-label="Attestation receipt">
            <i className="lg-sp-crop lg-sp-crop-tl" />
            <i className="lg-sp-crop lg-sp-crop-tr" />
            <i className="lg-sp-crop lg-sp-crop-bl" />
            <i className="lg-sp-crop lg-sp-crop-br" />
            <p className="lg-sp-lede">
              Frontier models
              <span>that run sealed</span>
              <span>and leave a receipt.</span>
            </p>
            <p className="lg-sp-sub">For work that cannot leave the enclave.</p>
            <p className="lg-sp-keep">Prompt not retained.</p>
            <p className="lg-sp-run">
              LUG-7F283 · {issued} · GLM-5.2 · TDX
            </p>
            <div className="lg-sp-punch">
              <span>Total retained</span>
              <b className="lg-sp-amt">
                <span className="lg-oh">0</span>
                <span>B</span>
              </b>
            </div>
            <div className="lg-sp-reg">
              <p>MRTD · SHA-384</p>
              <div className="lg-sp-hash">
                {hashGroups(MEASURES[0].value).map((group, index) => (
                  <b key={`mrtd-0-${index}`}>{group}</b>
                ))}
              </div>
            </div>
            <p className="lg-sp-url">lugano.ai/v/LUG-7F283</p>
            <a className="lg-sp-verify" href="#architecture">
              Verify this receipt
            </a>
          </article>
        </section>
      </div>

      <main id="main" className="lg-rest">

        <section id="problem" className="lg-section lg-section-ink">
          <div className="lg-shell lg-problem">
            <div>
              <h2 className="lg-display">The false choice of the cloud era</h2>
              <p className="lg-lede">
                You either send proprietary data to a black box you cannot audit, or you run
                crippled open-source models locally. That is a failure of infrastructure, not a
                law of physics.
              </p>
            </div>
            <div className="lg-choice">
              <article>
                <h3>The black box</h3>
                <p>Frontier models, hosted elsewhere. Capability you cannot inspect. Data you cannot get back.</p>
              </article>
              <article>
                <h3>The local compromise</h3>
                <p>Air-gapped, underpowered, and always a generation behind. Privacy bought with capability.</p>
              </article>
            </div>
          </div>
        </section>

        <section id="why-now" className="lg-section lg-section-ink lg-gap-section">
          <img className="lg-bleed" src="/generated/mhd_filament.png" alt="" />
          <div className="lg-shell lg-gap">
            <div>
              <Folio n="03" label="The trust gap" />
              <h2 className="lg-display">
                The industry is obsessed with capability.
                <em>The market is blocked by trust.</em>
              </h2>
            </div>
            <aside className="lg-stat">
              <strong>67%</strong>
              <p>of enterprises restrict AI use over data exposure concerns.</p>
              <cite>Cisco Data Privacy Benchmark</cite>
            </aside>
          </div>
        </section>

        <section id="what-we-do" className="lg-section lg-section-paper">
          <div className="lg-shell lg-manifesto">
            <Folio n="04" label="What we do" />
            <div>
              <h2 className="lg-display">Frontier intelligence, verifiably private.</h2>
              <p className="lg-lede lg-ink-copy">
                Lugano.ai collapses the false choice. Frontier models running inside your
                perimeter, with cryptographic proof that your data never left. Not private by
                policy. Private by architecture you can audit yourself.
              </p>
              <figure className="lg-film">
                <img src="/generated/easel_print.png" alt="A gelatin print of night water on a black viewing table" />
              </figure>
            </div>
          </div>
        </section>

        <section id="platform" className="lg-section lg-section-ink">
          <div className="lg-shell">
            <Folio n="05" label="How it works" />
            <h2 className="lg-display">Privacy by proof, not promise.</h2>
            <ol className="lg-process">
              {STEPS.map((step) => (
                <li key={step.n}>
                  <b>{step.n}</b>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="architecture" className="lg-section lg-section-paper">
          <div className="lg-shell lg-arch">
            <div>
              <Folio n="06" label="Architecture" />
              <h2 className="lg-display">Six structural properties.</h2>
              <p className="lg-lede lg-ink-copy">All verifiable.</p>
              <div className="lg-arch-list">
                {PILLARS.map((item, index) => (
                  <button
                    key={item.n}
                    type="button"
                    className={index === pillar ? "is-on" : ""}
                    onClick={() => setPillar(index)}
                  >
                    <span className="num">{item.n}</span>
                    <span>
                      <h3>{item.title}</h3>
                      <p>{item.body}</p>
                    </span>
                  </button>
                ))}
              </div>
            </div>
            <aside className="lg-receipt" aria-label="Attestation receipt">
              <img className="lg-receipt-metal" src="/generated/zirconium_plate.png" alt="" />
              <header>
                <span>// attestation receipt</span>
                <span>tee · sealed</span>
              </header>
              <pre>
                {RECEIPT.split("\n").map((line, index) => {
                  const match = line.match(/^(\s*)"([^"]+)":\s*(.*)$/);
                  if (!match) {
                    return <span key={index}>{line}{"\n"}</span>;
                  }
                  return (
                    <span key={index}>
                      {match[1]}"<span className="k">{match[2]}</span>": <span className="v">{match[3]}</span>
                      {"\n"}
                    </span>
                  );
                })}
              </pre>
            </aside>
          </div>
        </section>

        <section id="privacy" className="lg-section lg-section-ink">
          <div className="lg-shell">
            <Folio n="07" label="Privacy" />
            <h2 className="lg-display">Privacy you can&apos;t verify is just a policy.</h2>
            <p className="lg-lede">
              When a vendor says “we don&apos;t look at your data,” that is a policy. Policies
              change. Employees change. Acquisitions happen. Lugano.ai is built so that looking
              at your data is architecturally impossible. You do not need to trust us. You verify.
            </p>
            <div className="lg-privacy-grid">
              <article className="lg-policy">
                <p className="lg-col-kicker">Policy-based privacy</p>
                <h3>Trust required</h3>
                <ul>
                  <li>
                    You believe a promise
                    <span>Subject to change. Terms can be rewritten overnight.</span>
                  </li>
                  <li>
                    Non-auditable
                    <span>No way to verify the claim once the data has left.</span>
                  </li>
                  <li>
                    Personnel dependent
                    <span>Employees with access come and go.</span>
                  </li>
                </ul>
                <p className="lg-punch">A promise you cannot inspect.</p>
              </article>
              <article className="lg-archproof">
                <p className="lg-col-kicker">Architecture-based privacy</p>
                <h3>Trustless</h3>
                <ul>
                  <li>
                    Mathematically enforced
                    <span>Immutable without your consent.</span>
                  </li>
                  <li>
                    Fully auditable
                    <span>Cryptographic proofs you can inspect.</span>
                  </li>
                  <li>
                    Personnel independent
                    <span>No human can override the protocol.</span>
                  </li>
                </ul>
                <p className="lg-punch">“Verify it yourself.”</p>
              </article>
            </div>
            <ul className="lg-tiers" aria-label="Privacy levels">
              <li>Tier 1</li>
              <li>Tier 2</li>
              <li className="is-closed">[REDACTED]</li>
              <li className="is-closed">[CLASSIFIED]</li>
            </ul>
          </div>
        </section>

        <section id="use-cases" className="lg-section lg-section-ink" style={{ paddingTop: 0 }}>
          <div className="lg-shell">
            <Folio n="08" label="Use cases" />
            <h2 className="lg-display">Built for sensitive environments</h2>
            <div className="lg-cases">
              {CASES.filter((item) => "featured" in item && item.featured).map((item) => (
                <article className="lg-case featured" key={item.title}>
                  <img src={item.image} alt={item.alt} />
                  <div className="lg-case-body">
                    <h3>{item.title}</h3>
                    <p>{item.summary}</p>
                    <ul>
                      {item.bullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
              <div className="lg-case-stack">
                {CASES.filter((item) => !("featured" in item && item.featured)).map((item) => (
                  <article className="lg-case" key={item.title}>
                    <img src={item.image} alt={item.alt} />
                    <div className="lg-case-body">
                      <h3>{item.title}</h3>
                      <p>{item.summary}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="private-agents" className="lg-section lg-section-paper">
          <div className="lg-shell">
            <Folio n="09" label="Agents" />
            <h2 className="lg-display">Make your agents fully private</h2>
            <p className="lg-lede lg-ink-copy">
              Any agent framework. Any workflow. Zero data leakage.
            </p>
            <p className="lg-agent-note">
              Private Chat · Private Agents · Private API — in private beta.
            </p>
            <div className="lg-agents">
              {AGENTS.map((agent) => (
                <article key={agent.title}>
                  {"logo" in agent && agent.logo ? (
                    <img src={agent.logo} alt="" />
                  ) : (
                    <div className="lg-emoji" aria-hidden="true">
                      {"emoji" in agent ? agent.emoji : ""}
                    </div>
                  )}
                  <h3>{agent.title}</h3>
                  <p>{agent.summary}</p>
                  {"bullets" in agent && agent.bullets ? (
                    <ul>
                      {agent.bullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                  ) : null}
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="docs" className="lg-section lg-section-ink">
          <div className="lg-shell">
            <Folio n="10" label="Models" />
            <h2 className="lg-display">Private models available</h2>
            <p className="lg-lede">
              Run leading open models inside a verifiable privacy boundary.
            </p>
            <table className="lg-models">
              <thead>
                <tr>
                  <th>Model</th>
                  <th>Spec</th>
                  <th>Best for</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {MODELS.map((model) => (
                  <tr key={model.title}>
                    <td>
                      <div className="lg-model-name">
                        <img src={model.logo} alt="" />
                        <div>
                          <strong>{model.title}</strong>
                          <span>{model.maker}</span>
                        </div>
                      </div>
                    </td>
                    <td>{model.specs}</td>
                    <td className="best">{model.best}</td>
                    <td>{model.extra}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="lg-model-note">
              Model availability varies by private beta environment. Benchmarks shown from public
              Artificial Analysis, provider, and model-card data available on May 29, 2026.
            </p>
          </div>
        </section>

        <section id="private-beta" className="lg-section lg-close-section">
          <img className="lg-close-photo" src="/generated/mhd_lake_plate.png" alt="" />
          <div className="lg-close-veil" />
          <div className="lg-shell lg-close">
            <Folio n="11" label="Private beta" />
            <h2 className="lg-display">
              <span>Don&apos;t trust.</span>
              <em>
                Verify<i>.</i>
              </em>
            </h2>
            <p className="lg-lede lg-ink-copy">
              Lugano.ai is the verification layer for private AI. Frontier AI with cryptographic
              privacy. No trust required.
            </p>
            <a className="lg-btn lg-btn-ink" href="mailto:contact@lugano.ai">
              Request briefing
            </a>
          </div>
        </section>
      </main>

      <footer className="lg-footer">
        <div className="lg-shell lg-footer-row">
          <a className="lg-brand" href="#top">
            <span className="lg-wordmark">
              Lugan
              <ZeroMark />
            </span>
          </a>
          <nav aria-label="Footer">
            <a href="mailto:contact@lugano.ai">Contact</a>
            <a href="#docs">Docs</a>
            <a href="#privacy">Privacy</a>
            <a href="#architecture">Security</a>
          </nav>
          <p>© 2026 Lugano.ai</p>
        </div>
      </footer>
    </div>
  );
}
