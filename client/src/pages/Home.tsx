import { useEffect, useRef } from "react";
import GlassSeal from "@/components/GlassSeal";
import "./live.css";

export default function Home() {
  const glassVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (document.querySelector("script[data-lugano-home]")) {
      return;
    }
    const script = document.createElement("script");
    script.src = "/home.js";
    script.async = false;
    script.dataset.luganoHome = "1";
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    const video = glassVideoRef.current;
    if (!video) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      if (media.matches) {
        video.pause();
      } else {
        void video.play();
      }
    };
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  return (
    <>

    <a className="skip-link" href="#main">Skip to content</a>

    <svg className="svg-defs" aria-hidden="true" focusable="false">
      <defs>
        <symbol id="i-lock" viewBox="0 0 24 24">
          <rect x="5" y="11" width="14" height="9" rx="2" />
          <path d="M8 11V7.5a4 4 0 0 1 8 0V11" />
          <path d="M12 15v2" />
        </symbol>
        <symbol id="i-shield" viewBox="0 0 24 24">
          <path d="M12 3l7.5 3v5.2c0 4.6-3 7.7-7.5 9.8-4.5-2.1-7.5-5.2-7.5-9.8V6l7.5-3z" />
          <path d="M9 12l2.2 2.2L15.5 10" />
        </symbol>
        <symbol id="i-key" viewBox="0 0 24 24">
          <circle cx="8.5" cy="9" r="4" />
          <path d="M11.5 11.8L20 20.3M16.5 17l2.2-2.2M13.8 14.2l2.1-2.1" />
        </symbol>
        <symbol id="i-fingerprint" viewBox="0 0 24 24">
          <path d="M7 19.5c-1.4-2-2-4-2-7A7 7 0 0 1 12 5.5c3.9 0 7 3.1 7 7 0 2.2-.3 4.3-1.1 6" />
          <path d="M9.7 20.5c-1-2.2-1.5-4.6-1.2-8a3.5 3.5 0 0 1 7 .1c0 2.6.4 4.9 1.3 6.9" />
          <path d="M12.1 12.7c.1 2.9.6 5.3 1.6 7.6" />
        </symbol>
        <symbol id="i-receipt" viewBox="0 0 24 24">
          <path d="M6 3.5h12V20l-2-1.3L14 20l-2-1.3L10 20l-2-1.3L6 20V3.5z" />
          <path d="M9 8h6M9 11.5h6M9 15h3.5" />
        </symbol>
        <symbol id="i-boundary" viewBox="0 0 24 24">
          <rect x="4" y="4" width="16" height="16" rx="2.5" strokeDasharray="3.4 2.6" />
          <rect x="9" y="9" width="6" height="6" rx="1.2" />
        </symbol>
        <symbol id="i-route" viewBox="0 0 24 24">
          <circle cx="6" cy="6" r="2.2" />
          <circle cx="18" cy="18" r="2.2" />
          <path d="M8.2 6H15a3 3 0 0 1 3 3v2M15.8 18H9a3 3 0 0 1-3-3v-2" />
        </symbol>
        <symbol id="i-file-check" viewBox="0 0 24 24">
          <path d="M13.5 3.5H7a1.5 1.5 0 0 0-1.5 1.5v14A1.5 1.5 0 0 0 7 20.5h10a1.5 1.5 0 0 0 1.5-1.5V8.5l-5-5z" />
          <path d="M13.5 3.5v5h5" />
          <path d="M9.3 14.2l2 2 3.4-3.6" />
        </symbol>
        <symbol id="i-eye-off" viewBox="0 0 24 24">
          <path d="M4 4l16 16" />
          <path d="M10.6 5.8A9.8 9.8 0 0 1 12 5.7c4.5 0 8 3.2 9.5 6.3a12.4 12.4 0 0 1-3.2 4M6.2 7.5c-1.7 1.2-3 2.9-3.7 4.5C4 15.1 7.5 18.3 12 18.3c1.2 0 2.4-.2 3.4-.6" />
          <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
        </symbol>
        <symbol id="i-server" viewBox="0 0 24 24">
          <rect x="4" y="4.5" width="16" height="6.5" rx="1.5" />
          <rect x="4" y="13" width="16" height="6.5" rx="1.5" />
          <path d="M7.5 7.8h.01M7.5 16.3h.01M11 7.8h2M11 16.3h2" />
        </symbol>
        <symbol id="i-check" viewBox="0 0 24 24">
          <path d="M5 12.5l4.5 4.5L19 7.5" />
        </symbol>
        <symbol id="i-arrow" viewBox="0 0 24 24">
          <path d="M4 12h15M14 6.5L19.5 12 14 17.5" />
        </symbol>
      </defs>
    </svg>

    <header className="site-header">
      <div className="header-inner">
        <a className="brand" href="/" aria-label="Lugano home">
          <img className="brand-mark" src="/logo-mark.svg" alt="" width="20" height="20" />
          <span className="brand-name">Lugano.ai</span>
        </a>
        <nav className="site-nav" id="site-nav" aria-label="Primary">
          <a className="nav-link" href="#proof">Privacy</a>
          <a className="nav-link" href="#architecture">Architecture</a>
          <a className="nav-link" href="#use-cases">Use cases</a>
          <a className="nav-link" href="/docs">Docs</a>
          <a className="header-cta" href="#briefing">Request briefing</a>
        </nav>
        <button className="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav">
          <span className="nav-toggle-bar" aria-hidden="true"></span>
          <span className="nav-toggle-bar" aria-hidden="true"></span>
          <span className="sr-only">Menu</span>
        </button>
      </div>
    </header>

    <main id="main">
      {/* 1. Hero */}
      <section className="hero" id="hero">
        <GlassSeal />
        <div className="hero-inner">
          <div className="hero-copy">
            <h1 className="hero-title reveal">
              AI Privacy by
              <span className="strike">trust me bro</span>
              <em>proof.</em>
            </h1>
            <p className="body-large hero-sub reveal">
              Unverifiable privacy is just marketing. Lugano.ai gives sensitive AI workloads a
              private execution boundary with cryptographic evidence — so teams can verify what
              happened without exposing what matters.
            </p>
            <div className="hero-ctas reveal">
              <a className="btn btn-primary" href="#briefing">Request a private briefing</a>
              <a className="btn btn-ghost" href="#proof">View the proof model</a>
            </div>
            <p className="hero-reassure reveal">Private beta. Technical review available under NDA.</p>
          </div>

          <div className="hero-artifact reveal" aria-label="Redacted proof capsule — representative artifact">
            <div className="hero-glass-clip" aria-hidden="true">
              <video
                ref={glassVideoRef}
                className="hero-glass-video"
                autoPlay
                muted
                loop
                playsInline
                poster="/glass-seal-a.png"
              >
                <source src="/glass-seal.webm" type="video/webm" />
              </video>
            </div>
            <div className="proof-capsule" id="proof-capsule">
              <div className="proof-capsule-head">
                <div>
                  <p className="label">Verified Private</p>
                  <p className="proof-capsule-sub">10 sealed checks</p>
                </div>
                <span className="redaction-tag">Redacted</span>
              </div>
              <ul className="proof-rows">
                <li className="proof-row">
                  <span className="proof-check" aria-hidden="true"><svg><use href="#i-check" /></svg></span>
                  <span className="proof-row-label">Runtime quote present</span>
                  <span className="hash">4971...ba575</span>
                </li>
                <li className="proof-row">
                  <span className="proof-check" aria-hidden="true"><svg><use href="#i-check" /></svg></span>
                  <span className="proof-row-label">Accelerator boundary</span>
                  <span className="hash">c8f2...3e41a</span>
                </li>
                <li className="proof-row">
                  <span className="proof-check" aria-hidden="true"><svg><use href="#i-check" /></svg></span>
                  <span className="proof-row-label">Nonce binding</span>
                  <span className="hash">a1d9...7f283</span>
                </li>
                <li className="proof-row">
                  <span className="proof-check" aria-hidden="true"><svg><use href="#i-check" /></svg></span>
                  <span className="proof-row-label">Signing key bound</span>
                  <span className="hash">e3b7...9c064</span>
                </li>
                <li className="proof-row">
                  <span className="proof-check" aria-hidden="true"><svg><use href="#i-check" /></svg></span>
                  <span className="proof-row-label">Payload integrity</span>
                  <span className="hash">b2a6...8d5f1</span>
                </li>
                <li className="proof-row">
                  <span className="proof-check" aria-hidden="true"><svg><use href="#i-check" /></svg></span>
                  <span className="proof-row-label">Evidence sealed</span>
                  <span className="hash">91d4...3e7b8</span>
                </li>
              </ul>
              <div className="proof-capsule-foot">
                <span className="hash">4971...ba575</span>
                <span className="proof-capsule-note">Representative artifact. Redacted for public view.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Trust strip */}
      <section className="trust-strip" aria-label="Platform posture">
        <div className="shell">
          <div className="trust-grid">
            <div className="trust-card reveal">
              <span className="icon-well" aria-hidden="true"><svg><use href="#i-fingerprint" /></svg></span>
              <h2 className="trust-card-title">Provably private</h2>
              <p className="label trust-card-label">Data / Prompts</p>
            </div>
            <div className="trust-card reveal">
              <span className="icon-well" aria-hidden="true"><svg><use href="#i-eye-off" /></svg></span>
              <h2 className="trust-card-title">Zero plaintext logs</h2>
              <p className="label trust-card-label">Retention</p>
            </div>
            <div className="trust-card reveal">
              <span className="icon-well" aria-hidden="true"><svg><use href="#i-receipt" /></svg></span>
              <h2 className="trust-card-title">Cryptographic evidence</h2>
              <p className="label trust-card-label">Auditability</p>
            </div>
            <div className="trust-card reveal">
              <span className="icon-well" aria-hidden="true"><svg><use href="#i-key" /></svg></span>
              <h2 className="trust-card-title">Private beta</h2>
              <p className="label trust-card-label">Access model</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. How it works — abstract architecture */}
      <section className="arch-section section" id="architecture">
        <div className="shell">
          <div className="section-heading">
            <h2 className="section-title reveal">How Lugano creates a verifiable privacy boundary</h2>
            <p className="body-large section-sub reveal">
              The public model is intentionally simplified. Technical review is available under NDA.
            </p>
          </div>

          <ol className="arch-flow" id="arch-flow">
            <li className="arch-step">
              <div className="arch-node reveal">
                <h3 className="card-title">Customer environment</h3>
                <p className="arch-badge"><span>Plaintext</span> customer-controlled</p>
              </div>
              <div className="arch-connector-wrap" aria-hidden="true">
                <svg className="arch-connector" viewBox="0 0 64 24" preserveAspectRatio="none">
                  <path className="arch-connector-path" d="M2 12h54" />
                  <path className="arch-connector-tip" d="M50 6l8 6-8 6" />
                </svg>
                <span className="arch-edge-label">encrypted request</span>
              </div>
            </li>
            <li className="arch-step">
              <div className="arch-node reveal">
                <h3 className="card-title">Policy boundary</h3>
                <p className="arch-badge"><span>Plaintext</span> not exposed</p>
              </div>
              <div className="arch-connector-wrap" aria-hidden="true">
                <svg className="arch-connector" viewBox="0 0 64 24" preserveAspectRatio="none">
                  <path className="arch-connector-path" d="M2 12h54" />
                  <path className="arch-connector-tip" d="M50 6l8 6-8 6" />
                </svg>
                <span className="arch-edge-label">permitted route</span>
              </div>
            </li>
            <li className="arch-step">
              <div className="arch-node reveal">
                <h3 className="card-title">Sealed execution</h3>
                <p className="arch-badge"><span>Plaintext</span> sealed</p>
              </div>
              <div className="arch-connector-wrap" aria-hidden="true">
                <svg className="arch-connector" viewBox="0 0 64 24" preserveAspectRatio="none">
                  <path className="arch-connector-path" d="M2 12h54" />
                  <path className="arch-connector-tip" d="M50 6l8 6-8 6" />
                </svg>
                <span className="arch-edge-label">private inference</span>
              </div>
            </li>
            <li className="arch-step">
              <div className="arch-node reveal">
                <h3 className="card-title">Proof layer</h3>
                <p className="arch-badge"><span>Plaintext</span> not logged</p>
              </div>
              <div className="arch-connector-wrap" aria-hidden="true">
                <svg className="arch-connector" viewBox="0 0 64 24" preserveAspectRatio="none">
                  <path className="arch-connector-path" d="M2 12h54" />
                  <path className="arch-connector-tip" d="M50 6l8 6-8 6" />
                </svg>
                <span className="arch-edge-label">signed evidence</span>
              </div>
            </li>
            <li className="arch-step">
              <div className="arch-node reveal">
                <h3 className="card-title">Customer audit record</h3>
                <p className="arch-badge"><span>Plaintext</span> redacted evidence only</p>
              </div>
            </li>
          </ol>
        </div>
      </section>

      {/* 4. Proof without disclosure */}
      <section className="proof-section section section-dark" id="proof">
        <div className="shell">
          <div className="section-heading">
            <h2 className="section-title reveal">Proof without plaintext</h2>
            <p className="body-large section-sub reveal">
              Lugano produces evidence that a request followed the privacy boundary without turning
              sensitive content into another exposure surface.
            </p>
          </div>

          <div className="receipt-card reveal" id="receipt-card">
            <div className="receipt-head">
              <p className="label">Proof receipt / Redacted</p>
              <span className="redaction-tag">Sample</span>
            </div>
            <div className="receipt-rows">
              <div className="receipt-row">
                <span className="receipt-key">Request class</span>
                <span className="receipt-value">Sensitive AI workload</span>
              </div>
              <div className="receipt-row">
                <span className="receipt-key">Model class</span>
                <span className="receipt-value">Approved private model</span>
              </div>
              <div className="receipt-row">
                <span className="receipt-key">Execution boundary</span>
                <span className="receipt-value">Sealed</span>
              </div>
              <div className="receipt-row">
                <span className="receipt-key">Plaintext logging</span>
                <span className="receipt-value">Disabled</span>
              </div>
              <div className="receipt-row">
                <span className="receipt-key">Evidence</span>
                <span className="receipt-value">Signed + exportable</span>
              </div>
            </div>

            <div className="receipt-chain">
              <p className="label">Verification chain</p>
              <ul className="chain-list">
                <li className="chain-item">
                  <span className="proof-check" aria-hidden="true"><svg><use href="#i-check" /></svg></span>
                  Environment matched policy
                </li>
                <li className="chain-item">
                  <span className="proof-check" aria-hidden="true"><svg><use href="#i-check" /></svg></span>
                  Request bound to nonce
                </li>
                <li className="chain-item">
                  <span className="proof-check" aria-hidden="true"><svg><use href="#i-check" /></svg></span>
                  Payload integrity checked
                </li>
                <li className="chain-item">
                  <span className="proof-check" aria-hidden="true"><svg><use href="#i-check" /></svg></span>
                  Response returned with receipt
                </li>
                <li className="chain-item">
                  <span className="proof-check" aria-hidden="true"><svg><use href="#i-check" /></svg></span>
                  Evidence sealed for review
                </li>
              </ul>
            </div>

            <div className="receipt-actions">
              <button className="btn btn-ghost" type="button" id="receipt-toggle" aria-expanded="false" aria-controls="receipt-sample">
                Inspect sample receipt
              </button>
            </div>

            <div className="receipt-sample" id="receipt-sample" hidden={true}>
              <p className="receipt-sample-note">
                Representative sample, simplified for public review. Production receipts are
                exportable artifacts; the full format is covered in technical review.
              </p>
              <div className="receipt-sample-doc" role="img" aria-label="Redacted sample receipt with several fields blacked out">
                <div className="sample-line"><span className="sample-key">receipt</span><span className="sample-val">sample · redacted</span></div>
                <div className="sample-line"><span className="sample-key">request class</span><span className="sample-val">sensitive AI workload</span></div>
                <div className="sample-line"><span className="sample-key">model class</span><span className="sample-val">approved private model</span></div>
                <div className="sample-line"><span className="sample-key">execution boundary</span><span className="sample-val">sealed</span></div>
                <div className="sample-line"><span className="sample-key">request content</span><span className="sample-redact" aria-label="redacted"></span></div>
                <div className="sample-line"><span className="sample-key">response content</span><span className="sample-redact wide" aria-label="redacted"></span></div>
                <div className="sample-line"><span className="sample-key">nonce</span><span className="hash">a1d9...7f283</span></div>
                <div className="sample-line"><span className="sample-key">payload digest</span><span className="hash">b2a6...8d5f1</span></div>
                <div className="sample-line"><span className="sample-key">evidence seal</span><span className="hash">91d4...3e7b8</span></div>
                <div className="sample-line"><span className="sample-key">signature</span><span className="sample-redact" aria-label="redacted"></span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Platform capabilities */}
      <section className="platform-section section" id="platform">
        <div className="shell">
          <div className="section-heading">
            <h2 className="section-title reveal">Platform capabilities</h2>
            <p className="body-large section-sub reveal">
              Representative modules — not product screenshots. Product surfaces are available in
              private review.
            </p>
          </div>

          <div className="module-grid">
            <article className="module reveal">
              <div className="module-head">
                <span className="icon-well" aria-hidden="true"><svg><use href="#i-route" /></svg></span>
                <h3 className="subsection-title">Private model gateway</h3>
              </div>
              <p className="body module-copy">
                Route sensitive workloads to approved models through a privacy boundary your team
                can verify.
              </p>
              <div className="module-visual routing-table" role="table" aria-label="Redacted routing table">
                <div className="routing-row routing-head" role="row">
                  <span role="columnheader">Workload</span>
                  <span role="columnheader">Model class</span>
                  <span role="columnheader">Boundary</span>
                  <span role="columnheader">Evidence</span>
                </div>
                <div className="routing-row" role="row">
                  <span role="cell">Legal</span>
                  <span role="cell">Approved frontier</span>
                  <span role="cell">Sealed</span>
                  <span role="cell">Receipt</span>
                </div>
                <div className="routing-row" role="row">
                  <span role="cell">Research</span>
                  <span role="cell">Open model</span>
                  <span role="cell">Sealed</span>
                  <span role="cell">Receipt</span>
                </div>
                <div className="routing-row" role="row">
                  <span role="cell">Internal ops</span>
                  <span role="cell">Custom</span>
                  <span role="cell">Isolated</span>
                  <span role="cell">Receipt</span>
                </div>
              </div>
            </article>

            <article className="module reveal">
              <div className="module-head">
                <span className="icon-well" aria-hidden="true"><svg><use href="#i-boundary" /></svg></span>
                <h3 className="subsection-title">Sealed execution</h3>
              </div>
              <p className="body module-copy">
                Requests execute inside a controlled boundary designed to prevent plaintext exposure
                outside the approved path.
              </p>
              <div className="module-visual sealed-box">
                <p className="label sealed-box-title">Sealed execution boundary</p>
                <div className="sealed-box-flow">
                  <span>Request in</span>
                  <svg className="sealed-arrow" aria-hidden="true"><use href="#i-arrow" /></svg>
                  <span>Response</span>
                </div>
                <div className="sealed-box-meta">
                  <span><span className="sealed-key">Logs</span> no plaintext</span>
                  <span><span className="sealed-key">Evidence</span> signed</span>
                </div>
              </div>
            </article>

            <article className="module reveal">
              <div className="module-head">
                <span className="icon-well" aria-hidden="true"><svg><use href="#i-file-check" /></svg></span>
                <h3 className="subsection-title">Audit-ready evidence</h3>
              </div>
              <p className="body module-copy">
                Give security and compliance teams a reviewable record without exposing the
                sensitive content itself.
              </p>
              <div className="module-visual doc-stack" aria-label="Evidence document stack">
                <div className="doc-chip"><svg aria-hidden="true"><use href="#i-receipt" /></svg>Receipt</div>
                <div className="doc-chip"><svg aria-hidden="true"><use href="#i-shield" /></svg>Policy match</div>
                <div className="doc-chip"><svg aria-hidden="true"><use href="#i-boundary" /></svg>Boundary record</div>
                <div className="doc-chip"><svg aria-hidden="true"><use href="#i-eye-off" /></svg>Redacted review</div>
              </div>
            </article>

            <article className="module reveal">
              <div className="module-head">
                <span className="icon-well" aria-hidden="true"><svg><use href="#i-server" /></svg></span>
                <h3 className="subsection-title">Governance below the dashboard</h3>
              </div>
              <p className="body module-copy">
                Enforce model permissions, routing, and data controls at the infrastructure layer.
              </p>
              <div className="module-visual policy-cards">
                <div className="policy-card">
                  <p className="policy-card-title">Finance workloads</p>
                  <ul>
                    <li>Approved models only</li>
                    <li>Tool access restricted</li>
                    <li>Plaintext logs disabled</li>
                  </ul>
                </div>
                <div className="policy-card">
                  <p className="policy-card-title">Legal workloads</p>
                  <ul>
                    <li>Approved models only</li>
                    <li>Export receipt required</li>
                    <li>Review path enabled</li>
                  </ul>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* 6. Use cases */}
      <section className="use-cases-section section section-dark" id="use-cases">
        <div className="shell">
          <div className="section-heading">
            <h2 className="section-title reveal">Built for sensitive environments</h2>
          </div>

          <div className="use-case-grid">
            <article className="use-case-card reveal">
              <div className="use-case-head">
                <span className="icon-well" aria-hidden="true"><svg><use href="#i-file-check" /></svg></span>
                <h3 className="card-title">Regulated Industries</h3>
              </div>
              <p className="body use-case-summary">
                Deploy AI against sensitive internal data while preserving reviewable privacy
                boundaries.
              </p>
              <ul className="use-case-list">
                <li>Internal knowledge work.</li>
                <li>Sensitive analysis.</li>
                <li>Legal, finance, healthcare, and operations workflows.</li>
              </ul>
            </article>

            <article className="use-case-card reveal">
              <div className="use-case-head">
                <span className="icon-well" aria-hidden="true"><svg><use href="#i-shield" /></svg></span>
                <h3 className="card-title">Government and defense</h3>
              </div>
              <p className="body use-case-summary">
                Bring cutting edge model capability closer to sovereign, classified, or disconnected
                environments.
              </p>
              <ul className="use-case-list">
                <li>Sovereign deployment patterns.</li>
                <li>Air-gapped or restricted networks.</li>
                <li>Mission-sensitive workflows.</li>
              </ul>
            </article>

            <article className="use-case-card reveal">
              <div className="use-case-head">
                <span className="icon-well" aria-hidden="true"><svg><use href="#i-route" /></svg></span>
                <h3 className="card-title">Private agents</h3>
              </div>
              <p className="body use-case-summary">
                Run agentic workflows without turning tools, logs, and intermediate steps into
                exposure surfaces.
              </p>
              <ul className="use-case-list">
                <li>Private tool use.</li>
                <li>Reduced transcript leakage.</li>
                <li>Reviewable action evidence.</li>
              </ul>
            </article>

            <article className="use-case-card reveal">
              <div className="use-case-head">
                <span className="icon-well" aria-hidden="true"><svg><use href="#i-server" /></svg></span>
                <h3 className="card-title">AI platform teams</h3>
              </div>
              <p className="body use-case-summary">
                Give developers model access while security teams retain boundary-level controls.
              </p>
              <ul className="use-case-list">
                <li>Approved model routing.</li>
                <li>Team-level controls.</li>
                <li>Evidence for review.</li>
              </ul>
            </article>
          </div>
        </div>
      </section>

      {/* 7. Models */}
      <section className="models-section section" id="models">
        <div className="shell">
          <div className="section-heading">
            <h2 className="section-title reveal">Private model access, controlled by policy</h2>
            <p className="body-large section-sub reveal">
              Lugano is designed to support frontier, open, and customer-selected models inside a
              private execution path. Availability varies by deployment and review.
            </p>
          </div>

          <div className="model-table reveal" role="table" aria-label="Open models available in private beta">
            <div className="model-row model-head" role="row">
              <span role="columnheader">Model</span>
              <span role="columnheader">Maker</span>
              <span role="columnheader">Class</span>
              <span role="columnheader">Public specs</span>
            </div>
            <div className="model-row" role="row">
              <span className="model-name" role="cell">Kimi K2.6</span>
              <span className="model-maker" role="cell">Moonshot AI</span>
              <span className="model-class" role="cell">Frontier reasoning</span>
              <span className="model-spec" role="cell">1T MoE · 262K context</span>
            </div>
            <div className="model-row" role="row">
              <span className="model-name" role="cell">DeepSeek V4 Pro</span>
              <span className="model-maker" role="cell">DeepSeek</span>
              <span className="model-class" role="cell">Instruction</span>
              <span className="model-spec" role="cell">1.6T MoE · 1M context</span>
            </div>
            <div className="model-row" role="row">
              <span className="model-name" role="cell">MiniMax M3</span>
              <span className="model-maker" role="cell">MiniMax</span>
              <span className="model-class" role="cell">Open-weight coding</span>
              <span className="model-spec" role="cell">1M context · multimodal</span>
            </div>
            <div className="model-row" role="row">
              <span className="model-name" role="cell">GLM-5.1</span>
              <span className="model-maker" role="cell">Z.ai</span>
              <span className="model-class" role="cell">Long-horizon tasks</span>
              <span className="model-spec" role="cell">200K context · 128K output</span>
            </div>
            <div className="model-row" role="row">
              <span className="model-name" role="cell">MiMo-V2.5-Pro</span>
              <span className="model-maker" role="cell">Xiaomi</span>
              <span className="model-class" role="cell">Agent harness</span>
              <span className="model-spec" role="cell">MIT weights · 1M context</span>
            </div>
            <div className="model-row" role="row">
              <span className="model-name" role="cell">DeepSeek V4 Flash</span>
              <span className="model-maker" role="cell">DeepSeek</span>
              <span className="model-class" role="cell">Fast analysis</span>
              <span className="model-spec" role="cell">284B MoE · 1M context</span>
            </div>
          </div>

          <div className="model-notes reveal">
            <p className="model-footnote">
              Model availability, performance, and deployment path are subject to private beta
              review. Public examples are illustrative and may change.
            </p>
            <p className="model-source">
              Specifications from public provider and model-card data. Snapshot and sources in
              <a href="/docs#top-models">the docs model guide</a>.
            </p>
          </div>
        </div>
      </section>

      {/* 8. Security review kit */}
      <section className="review-kit-section section section-dark" id="security-review">
        <div className="shell">
          <div className="section-heading">
            <h2 className="section-title reveal">Built for security review</h2>
            <p className="body-large section-sub reveal">
              The public site gives the outline. Qualified teams can review the technical model
              under NDA.
            </p>
          </div>

          <div className="kit-grid">
            <article className="kit-card reveal">
              <div className="kit-card-top">
                <span className="marker marker-nda">NDA</span>
              </div>
              <h3 className="card-title">Architecture brief</h3>
              <p className="body">A simplified explanation of the privacy boundary and evidence model.</p>
            </article>
            <article className="kit-card reveal">
              <div className="kit-card-top">
                <span className="marker marker-public">Public</span>
              </div>
              <h3 className="card-title"><a className="kit-link" href="#proof">Sample proof receipt</a></h3>
              <p className="body">A redacted example of the evidence Lugano can return.</p>
            </article>
            <article className="kit-card reveal">
              <div className="kit-card-top">
                <span className="marker marker-public">Public</span>
              </div>
              <h3 className="card-title">
                <a className="kit-link" href="/docs#article-vendor-procurement-checklist">Vendor checklist</a>
              </h3>
              <p className="body">Questions serious teams should ask any AI privacy vendor.</p>
            </article>
            <article className="kit-card reveal">
              <div className="kit-card-top">
                <span className="marker marker-public">Public</span>
              </div>
              <h3 className="card-title">
                <a className="kit-link" href="/docs#article-ai-privacy-threat-model">Threat model overview</a>
              </h3>
              <p className="body">
                Where AI systems usually leak prompts, files, metadata, tool calls, and logs.
              </p>
            </article>
            <article className="kit-card reveal">
              <div className="kit-card-top">
                <span className="marker marker-nda">NDA</span>
              </div>
              <h3 className="card-title">Private technical review</h3>
              <p className="body">A deeper walkthrough for qualified teams under NDA.</p>
            </article>
          </div>

          <div className="kit-ctas reveal">
            <a className="btn btn-primary" href="#briefing">Request security review</a>
            <a className="btn btn-ghost" href="/docs">Read public docs</a>
          </div>
        </div>
      </section>

      {/* 9. Private beta CTA / briefing form */}
      <section className="briefing-section section" id="briefing">
        <div className="shell briefing-shell">
          <div className="briefing-copy">
            <h2 className="section-title reveal">Request a private briefing</h2>
            <p className="body-large section-sub reveal">
              Lugano is onboarding teams working with sensitive AI workloads. Tell us who you are
              and what privacy boundary you need. Technical reviews are available under NDA.
            </p>
            <p className="briefing-warning reveal">
              Do not submit sensitive data, prompts, files, credentials, or classified information
              through this form.
            </p>
          </div>

          <form className="briefing-form reveal" id="briefing-form" noValidate>
            <div className="field">
              <label htmlFor="bf-email">Work email <span className="req" aria-hidden="true">required</span></label>
              <input id="bf-email" name="email" type="email" autoComplete="email" inputMode="email" required />
            </div>
            <div className="field-row">
              <div className="field">
                <label htmlFor="bf-company">Company <span className="req" aria-hidden="true">required</span></label>
                <input id="bf-company" name="company" type="text" autoComplete="organization" required />
              </div>
              <div className="field">
                <label htmlFor="bf-role">Role <span className="req" aria-hidden="true">required</span></label>
                <input id="bf-role" name="role" type="text" autoComplete="organization-title" required />
              </div>
            </div>
            <div className="field">
              <label htmlFor="bf-usecase">Use case <span className="req" aria-hidden="true">required</span></label>
              <select id="bf-usecase" name="usecase" required defaultValue="">
                <option value="" disabled>Select a use case</option>
                <option>Private agents</option>
                <option>Regulated Industries</option>
                <option>Government / defense</option>
                <option>Private model gateway</option>
                <option>Internal AI platform</option>
                <option>Other sensitive workload</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="bf-website">Website <span className="opt">optional</span></label>
              <input id="bf-website" name="website" type="url" inputMode="url" autoComplete="url" placeholder="https://company.com" />
            </div>
            <div className="field">
              <label htmlFor="bf-protect">What are you trying to protect? <span className="opt">optional</span></label>
              <textarea id="bf-protect" name="protect" rows="3"></textarea>
            </div>
            <p className="form-error" id="form-error" hidden={true}>
              Please complete the required fields with a valid work email.
            </p>
            <button className="btn btn-primary btn-submit" type="submit">Request private briefing</button>
            <p className="briefing-reassure">Private beta. Technical review available under NDA.</p>
          </form>

          <div className="briefing-success" id="briefing-success" hidden={true}>
            <span className="proof-check proof-check-large" aria-hidden="true"><svg><use href="#i-check" /></svg></span>
            <h3 className="subsection-title">Request received.</h3>
            <p className="body">
              Thank you. If your use case fits the current beta, we will reach out to schedule a
              briefing. Do not send sensitive material before an NDA is in place.
            </p>
          </div>
        </div>
      </section>
    </main>

    <footer className="site-footer">
      <div className="shell footer-inner">
        <div className="footer-brand">
          <a className="brand" href="/" aria-label="Lugano home">
            <img className="brand-mark" src="/logo-mark.svg" alt="" width="18" height="18" />
            <span className="brand-name">Lugano.ai</span>
          </a>
          <p className="footer-tag">Private AI infrastructure. Privacy by proof.</p>
        </div>
        <nav className="footer-links" aria-label="Footer">
          <a href="#proof">Privacy</a>
          <a href="#architecture">Architecture</a>
          <a href="#use-cases">Use cases</a>
          <a href="/docs">Docs</a>
          <a href="#briefing">Request briefing</a>
          <a href="mailto:contact@lugano.ai">Contact</a>
        </nav>
        <p className="footer-fine">&copy; 2026 Lugano.ai &middot; Private beta &middot; Technical review under NDA</p>
      </div>
    </footer>
  
    </>
  );
}
