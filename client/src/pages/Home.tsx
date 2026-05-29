import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import { ArrowRight, Shield, Lock, Cpu, Building2, Landmark, TrendingUp, Zap, ChevronRight, CheckCircle2, Globe, Server, Eye, Code2, Bot, Wrench } from "lucide-react";

/* ─── Lake-blue gradient helpers ──────────────────────────── */
const LAKE_GRADIENT = "linear-gradient(135deg, #0d72c0 0%, #1a8cd8 50%, #3b9edd 100%)";
const ABYSS = "#020c1b";

/* ─── Data ─────────────────────────────────────────────────── */
const STATS = [
  { value: "100%", label: "Air-Gapped by Default" },
  { value: "0", label: "Data Breaches" },
  { value: "99.9%", label: "Uptime SLA" },
  { value: "SOC 2", label: "Type II Certified" },
];

const VERTICALS = [
  {
    icon: Building2,
    title: "Enterprise",
    subtitle: "Private AI for internal operations, IP protection, and competitive intelligence",
    bullets: [
      "Isolate sensitive workflows and data",
      "Protect IP and trade secrets",
      "Deploy on-prem or in your VPC",
      "Integrate with existing enterprise systems",
      "Role-based access and audit controls",
    ],
    featured: false,
  },
  {
    icon: Landmark,
    title: "Government & Defense",
    subtitle: "Sovereign AI, classified workloads, compliance-first infrastructure",
    bullets: [
      "Support for classified environments",
      "Air-gapped and disconnected deployments",
      "FedRAMP, IL5, CJIS, ITAR compliance",
      "Sovereign data residency and control",
      "Mission-critical reliability and security",
    ],
    featured: true,
  },
  {
    icon: TrendingUp,
    title: "Financial Services",
    subtitle: "Trading models, client data, regulatory requirements",
    bullets: [
      "Protect sensitive financial data",
      "Low-latency inference for trading",
      "Model risk management and validation",
      "Auditability and regulatory compliance",
      "Deploy in private, secure environments",
    ],
    featured: false,
  },
];

const AGENTS = [
  {
    name: "Hermes Agent",
    tagline: "Your autonomous AI companion for complex, multi-step tasks",
    icon: "⚡",
    color: "#f59e0b",
    featured: false,
  },
  {
    name: "OpenClaw",
    tagline: "Open-source agentic framework built for sovereign deployments",
    icon: "🦞",
    color: "#3b9edd",
    featured: true,
  },
  {
    name: "Custom Agents",
    tagline: "Bring any agent framework. Any workflow. Zero data leakage.",
    icon: "⚙️",
    color: "#a78bfa",
    featured: false,
  },
];

const MODELS = [
  {
    name: "Kimi K2.6",
    org: "Moonshot AI",
    params: "1T MoE",
    context: "262K ctx",
    score: "47",
    badge: "#1 Open Weights",
    highlight: true,
    color: "#3b9edd",
    benchmarks: { mmlu: "89.2", humaneval: "87.4", math: "91.3" },
  },
  {
    name: "GLM-5.1",
    org: "Z.AI",
    params: "200K ctx",
    context: "128K out",
    score: "50",
    badge: "Top Reasoning",
    highlight: false,
    color: "#06b6d4",
    benchmarks: { mmlu: "91.1", humaneval: "85.6", math: "90.7" },
  },
  {
    name: "DeepSeek V4 Pro",
    org: "DeepSeek",
    params: "1.6T / 49B",
    context: "1M ctx",
    score: "52",
    badge: "Best Value",
    highlight: false,
    color: "#38bdf8",
    benchmarks: { mmlu: "88.5", humaneval: "86.1", math: "89.4" },
  },
  {
    name: "Qwen3-Coder",
    org: "Alibaba",
    params: "480B / 35B",
    context: "256K ctx",
    score: "45",
    badge: "Best for Code",
    highlight: false,
    color: "#818cf8",
    benchmarks: { mmlu: "85.3", humaneval: "92.1", math: "88.0" },
  },
  {
    name: "Llama 4 Maverick",
    org: "Meta",
    params: "400B / 17B",
    context: "1M ctx",
    score: "43",
    badge: "Multimodal",
    highlight: false,
    color: "#60a5fa",
    benchmarks: { mmlu: "84.7", humaneval: "82.3", math: "85.6" },
  },
  {
    name: "Gemma 4 31B",
    org: "Google",
    params: "31B Dense",
    context: "128K ctx",
    score: "41",
    badge: "Apache 2.0",
    highlight: false,
    color: "#34d399",
    benchmarks: { mmlu: "83.1", humaneval: "79.8", math: "84.2" },
  },
];

const ARCHITECTURE_PILLARS = [
  {
    icon: Lock,
    label: "Zero-Knowledge Execution",
    desc: "Every inference runs inside a hardware-enforced enclave. Not even Lugano can read your prompts.",
    tag: "TEE / SGX",
  },
  {
    icon: Cpu,
    label: "Sovereign Compute",
    desc: "Deploy on your infrastructure, your VPC, or our air-gapped cloud. Your data never crosses a boundary you didn't draw.",
    tag: "On-Prem / VPC",
  },
  {
    icon: Shield,
    label: "Cryptographic Receipts",
    desc: "Every model call returns a hardware-signed attestation. Prove compliance without exposing a single token.",
    tag: "ZK Proofs",
  },
  {
    icon: Eye,
    label: "Audit Without Exposure",
    desc: "Full audit trails, role-based access, and tamper-evident logs — without giving auditors access to your data.",
    tag: "SOC 2 / FedRAMP",
  },
  {
    icon: Globe,
    label: "Any Model, Any Region",
    desc: "Run the world's best open-source models with data residency guarantees in 12 global regions.",
    tag: "Multi-Region",
  },
  {
    icon: Server,
    label: "Enterprise SLA",
    desc: "99.9% uptime, dedicated infrastructure, and a 4-hour incident response SLA for mission-critical deployments.",
    tag: "99.9% Uptime",
  },
];

const TRUST_LOGOS = [
  { name: "Palantir", abbr: "PLT" },
  { name: "Lockheed Martin", abbr: "LMT" },
  { name: "BlackRock", abbr: "BLK" },
  { name: "Raytheon", abbr: "RTX" },
  { name: "Goldman Sachs", abbr: "GS" },
  { name: "Booz Allen", abbr: "BAH" },
  { name: "SAIC", abbr: "SAIC" },
  { name: "Leidos", abbr: "LDOS" },
];

/* ─── Component ─────────────────────────────────────────────── */
export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [activeModel, setActiveModel] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);
      if (heroRef.current) {
        const y = window.scrollY;
        heroRef.current.style.transform = `translateY(${y * 0.35}px)`;
        heroRef.current.style.opacity = `${Math.max(0, 1 - y / 600)}`;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="min-h-screen text-white overflow-x-hidden"
      style={{ background: ABYSS, fontFamily: "'Geist', 'Inter', system-ui, sans-serif" }}
    >
      <Helmet>
        <title>Lugano.ai — Private AI Infrastructure</title>
        <meta name="description" content="The sovereign AI infrastructure for organizations that cannot afford to leak. Zero-knowledge inference, air-gapped deployments, cryptographic receipts." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700;800;900&family=Geist+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
      </Helmet>

      {/* ── NAV ─────────────────────────────────────────────── */}
      <nav
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
          padding: scrolled ? "12px 0" : "20px 0",
          background: scrolled
            ? "rgba(2, 12, 27, 0.85)"
            : "transparent",
          backdropFilter: scrolled ? "blur(20px) saturate(180%)" : "none",
          borderBottom: scrolled ? "1px solid rgba(59, 158, 221, 0.12)" : "none",
        }}
      >
        <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* Logo */}
          <a href="#" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: LAKE_GRADIENT,
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 0 20px rgba(13, 114, 192, 0.4)",
            }}>
              <Lock size={16} color="white" strokeWidth={2.5} />
            </div>
            <span style={{ fontSize: "1.05rem", fontWeight: 700, letterSpacing: "-0.02em", color: "#fff" }}>
              Lugano<span style={{ color: "#3b9edd" }}>.ai</span>
            </span>
          </a>

          {/* Links */}
          <div style={{ display: "flex", alignItems: "center", gap: "32px" }} className="hidden md:flex">
            {["Platform", "Models", "Agents", "Enterprise", "Docs"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                style={{
                  fontSize: "0.82rem", fontWeight: 500, color: "rgba(226,234,246,0.65)",
                  textDecoration: "none", letterSpacing: "0.01em",
                  transition: "color 0.2s",
                }}
                onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(226,234,246,0.65)")}
              >
                {item}
              </a>
            ))}
          </div>

          {/* CTA */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <a
              href="mailto:contact@lugano.ai"
              style={{
                fontSize: "0.78rem", fontWeight: 500, color: "rgba(226,234,246,0.6)",
                textDecoration: "none", letterSpacing: "0.01em",
              }}
            >
              Sign in
            </a>
            <a
              href="mailto:contact@lugano.ai"
              style={{
                display: "inline-flex", alignItems: "center", gap: "6px",
                padding: "8px 18px", borderRadius: "8px",
                background: LAKE_GRADIENT,
                color: "#fff", fontSize: "0.82rem", fontWeight: 600,
                textDecoration: "none", letterSpacing: "0.01em",
                boxShadow: "0 0 20px rgba(13, 114, 192, 0.35)",
                transition: "box-shadow 0.2s, transform 0.2s",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.boxShadow = "0 0 32px rgba(13, 114, 192, 0.6)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.boxShadow = "0 0 20px rgba(13, 114, 192, 0.35)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
              }}
            >
              Request Access
              <ArrowRight size={13} strokeWidth={2.5} />
            </a>
          </div>
        </div>
      </nav>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", overflow: "hidden" }}>
        {/* Background layers */}
        <div ref={heroRef} style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          {/* Deep lake gradient */}
          <div style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(13, 114, 192, 0.18) 0%, rgba(2, 12, 27, 0) 70%)",
          }} />
          {/* Grid overlay */}
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: "linear-gradient(rgba(59, 158, 221, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 158, 221, 0.04) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }} />
          {/* Radial vignette */}
          <div style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(ellipse 120% 80% at 50% 100%, rgba(2, 12, 27, 0.9) 0%, transparent 60%)",
          }} />
          {/* Floating orbs */}
          <div style={{
            position: "absolute", top: "15%", left: "8%",
            width: 500, height: 500, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(13, 114, 192, 0.14) 0%, transparent 70%)",
            filter: "blur(60px)",
            animation: "pulse 8s ease-in-out infinite",
          }} />
          <div style={{
            position: "absolute", top: "30%", right: "5%",
            width: 400, height: 400, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(59, 158, 221, 0.1) 0%, transparent 70%)",
            filter: "blur(80px)",
            animation: "pulse 10s ease-in-out infinite reverse",
          }} />
          <div style={{
            position: "absolute", bottom: "20%", left: "40%",
            width: 300, height: 300, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(30, 64, 175, 0.08) 0%, transparent 70%)",
            filter: "blur(50px)",
          }} />
        </div>

        {/* Hero content */}
        <div className="container" style={{ position: "relative", zIndex: 10, paddingTop: "120px", paddingBottom: "80px" }}>
          {/* Eyebrow */}
          <div className="animate-fade-up" style={{ marginBottom: "24px", display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ height: 1, width: 32, background: "rgba(59, 158, 221, 0.6)" }} />
            <span style={{
              fontFamily: "'Geist Mono', monospace",
              fontSize: "0.65rem", letterSpacing: "0.22em",
              textTransform: "uppercase", color: "#3b9edd",
            }}>
              Private AI Infrastructure
            </span>
          </div>

          {/* Headline */}
          <h1
            className="animate-fade-up delay-100"
            style={{
              fontSize: "clamp(3rem, 7vw, 6.5rem)",
              fontWeight: 800, letterSpacing: "-0.04em",
              lineHeight: 1.0, color: "#fff",
              maxWidth: "900px", marginBottom: "28px",
            }}
          >
            Your Intelligence.{" "}
            <span style={{
              background: LAKE_GRADIENT,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              Your Vault.
            </span>
          </h1>

          {/* Subheadline */}
          <p
            className="animate-fade-up delay-200"
            style={{
              fontSize: "clamp(1rem, 2vw, 1.25rem)",
              color: "rgba(226,234,246,0.6)",
              maxWidth: "560px", lineHeight: 1.65,
              fontWeight: 400, marginBottom: "44px",
            }}
          >
            The sovereign AI platform for organizations that cannot afford to leak.
            Zero-knowledge inference. Air-gapped deployments. Cryptographic proof of privacy.
          </p>

          {/* CTAs */}
          <div className="animate-fade-up delay-300" style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
            <a
              href="mailto:contact@lugano.ai"
              style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                padding: "14px 28px", borderRadius: "10px",
                background: LAKE_GRADIENT,
                color: "#fff", fontSize: "0.9rem", fontWeight: 600,
                textDecoration: "none", letterSpacing: "0.01em",
                boxShadow: "0 0 40px rgba(13, 114, 192, 0.45), 0 4px 16px rgba(0,0,0,0.3)",
                transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.boxShadow = "0 0 60px rgba(13, 114, 192, 0.7), 0 8px 24px rgba(0,0,0,0.4)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.boxShadow = "0 0 40px rgba(13, 114, 192, 0.45), 0 4px 16px rgba(0,0,0,0.3)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
              }}
            >
              Request Access
              <ArrowRight size={15} strokeWidth={2.5} />
            </a>
            <a
              href="#platform"
              style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                padding: "14px 28px", borderRadius: "10px",
                background: "rgba(59, 158, 221, 0.08)",
                border: "1px solid rgba(59, 158, 221, 0.2)",
                color: "rgba(226,234,246,0.85)", fontSize: "0.9rem", fontWeight: 500,
                textDecoration: "none", letterSpacing: "0.01em",
                transition: "all 0.25s",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = "rgba(59, 158, 221, 0.14)";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(59, 158, 221, 0.4)";
                (e.currentTarget as HTMLElement).style.color = "#fff";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = "rgba(59, 158, 221, 0.08)";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(59, 158, 221, 0.2)";
                (e.currentTarget as HTMLElement).style.color = "rgba(226,234,246,0.85)";
              }}
            >
              Explore Platform
            </a>
          </div>

            {/* Trust logos strip */}
          <div className="animate-fade-up delay-400" style={{ marginTop: "56px", marginBottom: "0" }}>
            <p style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(122, 154, 191, 0.4)", marginBottom: "16px" }}>
              Trusted by security-first organizations
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "32px", flexWrap: "wrap" }}>
              {TRUST_LOGOS.map((logo, i) => (
                <div key={i} style={{
                  padding: "6px 14px",
                  background: "rgba(59, 158, 221, 0.04)",
                  border: "1px solid rgba(59, 158, 221, 0.1)",
                  borderRadius: "6px",
                  fontFamily: "'Geist Mono', monospace",
                  fontSize: "0.68rem", letterSpacing: "0.08em",
                  color: "rgba(122, 154, 191, 0.45)",
                  fontWeight: 500,
                  transition: "all 0.2s",
                  cursor: "default",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.color = "rgba(226,234,246,0.6)";
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(59, 158, 221, 0.2)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.color = "rgba(122, 154, 191, 0.45)";
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(59, 158, 221, 0.1)";
                }}
                >
                  {logo.name}
                </div>
              ))}
            </div>
          </div>

        {/* Stats row */}
          <div
            className="animate-fade-up delay-500"
            style={{
              display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
              gap: "1px", marginTop: "80px",
              background: "rgba(59, 158, 221, 0.1)",
              borderRadius: "12px", overflow: "hidden",
              border: "1px solid rgba(59, 158, 221, 0.12)",
            }}
          >
            {STATS.map((s, i) => (
              <div
                key={i}
                style={{
                  padding: "28px 24px",
                  background: "rgba(7, 20, 40, 0.7)",
                  backdropFilter: "blur(12px)",
                  textAlign: "center",
                }}
              >
                <div style={{
                  fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
                  fontWeight: 800, letterSpacing: "-0.04em",
                  color: "#fff", lineHeight: 1, marginBottom: "6px",
                }}>
                  {s.value}
                </div>
                <div style={{
                  fontFamily: "'Geist Mono', monospace",
                  fontSize: "0.65rem", letterSpacing: "0.12em",
                  textTransform: "uppercase", color: "rgba(122, 154, 191, 0.8)",
                }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION DIVIDER ─────────────────────────────────── */}
      <div style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(59, 158, 221, 0.2) 30%, rgba(59, 158, 221, 0.2) 70%, transparent)" }} />

      {/* ── PLATFORM / ARCHITECTURE ─────────────────────────── */}
      <section id="platform" style={{ padding: "120px 0", background: "rgba(4, 12, 28, 0.95)", position: "relative", overflow: "hidden" }}>
        {/* Subtle grid */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "linear-gradient(rgba(59, 158, 221, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 158, 221, 0.03) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }} />
        <div className="container" style={{ position: "relative" }}>
          {/* Header */}
          <div style={{ marginBottom: "72px", maxWidth: "640px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
              <div style={{ height: 1, width: 32, background: "rgba(59, 158, 221, 0.6)" }} />
              <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "#3b9edd" }}>
                The Architecture
              </span>
            </div>
            <h2 style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", fontWeight: 800, letterSpacing: "-0.03em", color: "#fff", marginBottom: "20px" }}>
              Privacy is not a feature.<br />
              <span style={{ color: "rgba(226,234,246,0.4)" }}>It is the foundation.</span>
            </h2>
            <p style={{ fontSize: "1.05rem", color: "rgba(226,234,246,0.55)", lineHeight: 1.7 }}>
              Every layer of Lugano is designed around one axiom: your data belongs to you, and no one else should ever be able to touch it — not even us.
            </p>
          </div>

          {/* Pillars grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1px", background: "rgba(59, 158, 221, 0.08)", borderRadius: "16px", overflow: "hidden", border: "1px solid rgba(59, 158, 221, 0.1)" }}>
            {ARCHITECTURE_PILLARS.map((p, i) => {
              const Icon = p.icon;
              return (
                <div
                  key={i}
                  style={{
                    padding: "36px 32px",
                    background: "rgba(7, 20, 40, 0.8)",
                    backdropFilter: "blur(12px)",
                    transition: "background 0.25s",
                    cursor: "default",
                    position: "relative",
                    overflow: "hidden",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(13, 37, 69, 0.9)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(7, 20, 40, 0.8)";
                  }}
                >
                  {/* Hover glow */}
                  <div style={{
                    position: "absolute", bottom: 0, left: 0, right: 0, height: 2,
                    background: LAKE_GRADIENT,
                    transform: "scaleX(0)", transformOrigin: "left",
                    transition: "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
                  }} className="pillar-underline" />

                  <div style={{
                    width: 44, height: 44, borderRadius: 10,
                    background: "rgba(13, 114, 192, 0.15)",
                    border: "1px solid rgba(59, 158, 221, 0.2)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    marginBottom: "20px",
                  }}>
                    <Icon size={20} color="#3b9edd" strokeWidth={1.8} />
                  </div>
                  <div style={{
                    fontFamily: "'Geist Mono', monospace",
                    fontSize: "0.6rem", letterSpacing: "0.18em",
                    textTransform: "uppercase", color: "#3b9edd",
                    marginBottom: "10px",
                  }}>
                    {p.tag}
                  </div>
                  <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#fff", marginBottom: "12px", letterSpacing: "-0.01em" }}>
                    {p.label}
                  </h3>
                  <p style={{ fontSize: "0.875rem", color: "rgba(226,234,246,0.5)", lineHeight: 1.65 }}>
                    {p.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── SECTION DIVIDER ─────────────────────────────────── */}
      <div style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(59, 158, 221, 0.15) 30%, rgba(59, 158, 221, 0.15) 70%, transparent)" }} />

      {/* ── VERTICALS — "Built for Organizations That Cannot Afford to Leak" ── */}
      <section id="enterprise" style={{ padding: "120px 0", background: ABYSS, position: "relative", overflow: "hidden" }}>
        {/* Background radial */}
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: 900, height: 600,
          background: "radial-gradient(ellipse, rgba(13, 114, 192, 0.07) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <div className="container" style={{ position: "relative" }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "72px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", marginBottom: "20px" }}>
              <div style={{ height: 1, width: 32, background: "rgba(59, 158, 221, 0.6)" }} />
              <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "#3b9edd" }}>
                Use Cases by Vertical
              </span>
              <div style={{ height: 1, width: 32, background: "rgba(59, 158, 221, 0.6)" }} />
            </div>
            <h2 style={{ fontSize: "clamp(2.2rem, 5vw, 4rem)", fontWeight: 800, letterSpacing: "-0.04em", color: "#fff", lineHeight: 1.05 }}>
              Built for Organizations<br />
              <span style={{ color: "rgba(226,234,246,0.35)" }}>That Cannot Afford to Leak</span>
            </h2>
          </div>

          {/* Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "16px" }}>
            {VERTICALS.map((v, i) => {
              const Icon = v.icon;
              return (
                <div
                  key={i}
                  style={{
                    borderRadius: "16px",
                    padding: "36px 32px",
                    background: v.featured
                      ? "rgba(7, 20, 40, 0.95)"
                      : "rgba(7, 20, 40, 0.6)",
                    border: v.featured
                      ? "1px solid rgba(59, 158, 221, 0.4)"
                      : "1px solid rgba(13, 37, 69, 0.8)",
                    boxShadow: v.featured
                      ? "0 0 0 1px rgba(59, 158, 221, 0.1), 0 0 60px rgba(13, 114, 192, 0.18), 0 24px 48px rgba(0,0,0,0.3)"
                      : "0 4px 24px rgba(0,0,0,0.2)",
                    backdropFilter: "blur(20px)",
                    transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                    position: "relative",
                    overflow: "hidden",
                  }}
                  onMouseEnter={e => {
                    if (!v.featured) {
                      (e.currentTarget as HTMLElement).style.borderColor = "rgba(59, 158, 221, 0.25)";
                      (e.currentTarget as HTMLElement).style.boxShadow = "0 0 40px rgba(13, 114, 192, 0.12), 0 8px 32px rgba(0,0,0,0.25)";
                    }
                  }}
                  onMouseLeave={e => {
                    if (!v.featured) {
                      (e.currentTarget as HTMLElement).style.borderColor = "rgba(13, 37, 69, 0.8)";
                      (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 24px rgba(0,0,0,0.2)";
                    }
                  }}
                >
                  {/* Top glow line for featured */}
                  {v.featured && (
                    <div style={{
                      position: "absolute", top: 0, left: "20%", right: "20%", height: 1,
                      background: "linear-gradient(90deg, transparent, rgba(59, 158, 221, 0.6), transparent)",
                    }} />
                  )}

                  {/* Icon + Title */}
                  <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
                    <div style={{
                      width: 52, height: 52, borderRadius: 12,
                      background: v.featured
                        ? "rgba(13, 114, 192, 0.2)"
                        : "rgba(59, 158, 221, 0.08)",
                      border: v.featured
                        ? "1px solid rgba(59, 158, 221, 0.3)"
                        : "1px solid rgba(59, 158, 221, 0.12)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                    }}>
                      <Icon size={24} color={v.featured ? "#7dd3fc" : "#3b9edd"} strokeWidth={1.6} />
                    </div>
                    <h3 style={{
                      fontSize: "1.2rem", fontWeight: 700,
                      color: "#fff", letterSpacing: "-0.02em", lineHeight: 1.2,
                    }}>
                      {v.title}
                    </h3>
                  </div>

                  {/* Subtitle */}
                  <p style={{ fontSize: "0.875rem", color: "rgba(226,234,246,0.55)", lineHeight: 1.65, marginBottom: "24px" }}>
                    {v.subtitle}
                  </p>

                  {/* Bullets */}
                  <ul style={{ listStyle: "none", padding: 0, margin: "0 0 28px", display: "flex", flexDirection: "column", gap: "10px" }}>
                    {v.bullets.map((b, j) => (
                      <li key={j} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                        <div style={{
                          width: 5, height: 5, borderRadius: "50%",
                          background: v.featured ? "#7dd3fc" : "#3b9edd",
                          marginTop: "7px", flexShrink: 0,
                        }} />
                        <span style={{ fontSize: "0.85rem", color: "rgba(226,234,246,0.65)", lineHeight: 1.5 }}>{b}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <a
                    href="mailto:contact@lugano.ai"
                    style={{
                      display: "inline-flex", alignItems: "center", gap: "6px",
                      fontSize: "0.82rem", fontWeight: 600,
                      color: v.featured ? "#7dd3fc" : "#3b9edd",
                      textDecoration: "none",
                      transition: "gap 0.2s",
                    }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.gap = "10px"}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.gap = "6px"}
                  >
                    Learn more
                    <ArrowRight size={13} strokeWidth={2.5} />
                  </a>
                </div>
              );
            })}
          </div>

          {/* Bottom stats strip */}
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
            gap: "1px", marginTop: "48px",
            background: "rgba(59, 158, 221, 0.08)",
            borderRadius: "12px", overflow: "hidden",
            border: "1px solid rgba(59, 158, 221, 0.1)",
          }}>
            {[
              { icon: "👥", value: "100+", label: "Enterprise Clients" },
              { icon: "🛡️", value: "99.9%", label: "Uptime SLA" },
              { icon: "🔒", value: "Zero", label: "Data Breaches" },
            ].map((s, i) => (
              <div key={i} style={{
                padding: "28px 24px", background: "rgba(7, 20, 40, 0.7)",
                backdropFilter: "blur(12px)", textAlign: "center",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "16px",
              }}>
                <span style={{ fontSize: "1.8rem" }}>{s.icon}</span>
                <div>
                  <div style={{ fontSize: "1.8rem", fontWeight: 800, letterSpacing: "-0.04em", color: "#fff", lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(122, 154, 191, 0.7)", marginTop: "4px" }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION DIVIDER ─────────────────────────────────── */}
      <div style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(59, 158, 221, 0.15) 30%, rgba(59, 158, 221, 0.15) 70%, transparent)" }} />

      {/* ── AGENTS — "Make Your Agents Fully Private" ─────────── */}
      <section id="agents" style={{ padding: "120px 0", background: "rgba(3, 10, 22, 0.98)", position: "relative", overflow: "hidden" }}>
        {/* Ambient glow */}
        <div style={{
          position: "absolute", bottom: "-20%", right: "-10%",
          width: 700, height: 700,
          background: "radial-gradient(circle, rgba(13, 114, 192, 0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <div className="container" style={{ position: "relative" }}>
          <div style={{ textAlign: "center", marginBottom: "72px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", marginBottom: "20px" }}>
              <div style={{ height: 1, width: 32, background: "rgba(59, 158, 221, 0.6)" }} />
              <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "#3b9edd" }}>
                Agent Infrastructure
              </span>
              <div style={{ height: 1, width: 32, background: "rgba(59, 158, 221, 0.6)" }} />
            </div>
            <h2 style={{ fontSize: "clamp(2.2rem, 5vw, 4rem)", fontWeight: 800, letterSpacing: "-0.04em", color: "#fff", lineHeight: 1.05, marginBottom: "20px" }}>
              Make Your Agents<br />
              <span style={{
                background: LAKE_GRADIENT,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
                Fully Private
              </span>
            </h2>
            <p style={{ fontSize: "1.05rem", color: "rgba(226,234,246,0.5)", maxWidth: "480px", margin: "0 auto", lineHeight: 1.65 }}>
              Any agent framework. Any workflow. Zero data leakage.
            </p>
          </div>

          {/* Agent cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
            {AGENTS.map((agent, i) => (
              <div
                key={i}
                style={{
                  borderRadius: "16px",
                  padding: "40px 32px",
                  background: agent.featured
                    ? "rgba(7, 20, 40, 0.95)"
                    : "rgba(7, 20, 40, 0.5)",
                  border: agent.featured
                    ? "1px solid rgba(59, 158, 221, 0.4)"
                    : "1px solid rgba(13, 37, 69, 0.7)",
                  boxShadow: agent.featured
                    ? "0 0 60px rgba(13, 114, 192, 0.2), 0 24px 48px rgba(0,0,0,0.3)"
                    : "none",
                  backdropFilter: "blur(20px)",
                  textAlign: "center",
                  transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                  position: "relative",
                  overflow: "hidden",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
                  if (!agent.featured) {
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(59, 158, 221, 0.25)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 0 40px rgba(13, 114, 192, 0.12), 0 16px 40px rgba(0,0,0,0.25)";
                  }
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                  if (!agent.featured) {
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(13, 37, 69, 0.7)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "none";
                  }
                }}
              >
                {/* Top glow for featured */}
                {agent.featured && (
                  <div style={{
                    position: "absolute", top: 0, left: "15%", right: "15%", height: 1,
                    background: "linear-gradient(90deg, transparent, rgba(59, 158, 221, 0.7), transparent)",
                  }} />
                )}

                {/* Icon */}
                <div style={{
                  width: 80, height: 80, borderRadius: 16,
                  background: agent.featured
                    ? "rgba(13, 114, 192, 0.2)"
                    : "rgba(59, 158, 221, 0.07)",
                  border: `1px solid ${agent.featured ? "rgba(59, 158, 221, 0.35)" : "rgba(59, 158, 221, 0.12)"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 24px",
                  fontSize: "2rem",
                  boxShadow: agent.featured ? `0 0 30px ${agent.color}30` : "none",
                }}>
                  {agent.icon}
                </div>

                <h3 style={{ fontSize: "1.3rem", fontWeight: 700, color: "#fff", letterSpacing: "-0.02em", marginBottom: "12px" }}>
                  {agent.name}
                </h3>
                <p style={{ fontSize: "0.875rem", color: "rgba(226,234,246,0.5)", lineHeight: 1.6 }}>
                  {agent.tagline}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION DIVIDER ─────────────────────────────────── */}
      <div style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(59, 158, 221, 0.15) 30%, rgba(59, 158, 221, 0.15) 70%, transparent)" }} />

      {/* ── PRIVATE MODELS ──────────────────────────────────── */}
      <section id="models" style={{ padding: "120px 0", background: ABYSS, position: "relative", overflow: "hidden" }}>
        {/* Grid */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "linear-gradient(rgba(59, 158, 221, 0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 158, 221, 0.025) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }} />
        {/* Top glow */}
        <div style={{
          position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
          width: 800, height: 400,
          background: "radial-gradient(ellipse, rgba(13, 114, 192, 0.1) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <div className="container" style={{ position: "relative" }}>
          <div style={{ textAlign: "center", marginBottom: "72px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", marginBottom: "20px" }}>
              <div style={{ height: 1, width: 32, background: "rgba(59, 158, 221, 0.6)" }} />
              <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "#3b9edd" }}>
                Open-Source Models
              </span>
              <div style={{ height: 1, width: 32, background: "rgba(59, 158, 221, 0.6)" }} />
            </div>
            <h2 style={{ fontSize: "clamp(2.2rem, 5vw, 4rem)", fontWeight: 800, letterSpacing: "-0.04em", color: "#fff", lineHeight: 1.05, marginBottom: "20px" }}>
              Private Models Available
            </h2>
            <p style={{ fontSize: "1.05rem", color: "rgba(226,234,246,0.5)", maxWidth: "480px", margin: "0 auto", lineHeight: 1.65 }}>
              Run the world's best open-source models with zero data exposure.
            </p>
          </div>

          {/* Model grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "16px" }}>
            {MODELS.map((m, i) => (
              <div
                key={i}
                style={{
                  borderRadius: "14px",
                  padding: "28px",
                  background: m.highlight
                    ? "rgba(7, 20, 40, 0.95)"
                    : "rgba(7, 20, 40, 0.6)",
                  border: m.highlight
                    ? "1px solid rgba(59, 158, 221, 0.4)"
                    : "1px solid rgba(13, 37, 69, 0.8)",
                  boxShadow: m.highlight
                    ? "0 0 60px rgba(13, 114, 192, 0.18), 0 16px 40px rgba(0,0,0,0.25)"
                    : "none",
                  backdropFilter: "blur(16px)",
                  transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                  cursor: "pointer",
                  position: "relative",
                  overflow: "hidden",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)";
                  if (!m.highlight) {
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(59, 158, 221, 0.25)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 0 40px rgba(13, 114, 192, 0.1), 0 8px 32px rgba(0,0,0,0.2)";
                  }
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                  if (!m.highlight) {
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(13, 37, 69, 0.8)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "none";
                  }
                }}
              >
                {/* Top glow for highlighted */}
                {m.highlight && (
                  <div style={{
                    position: "absolute", top: 0, left: "20%", right: "20%", height: 1,
                    background: "linear-gradient(90deg, transparent, rgba(59, 158, 221, 0.6), transparent)",
                  }} />
                )}

                {/* Header row */}
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    {/* Model color dot */}
                    <div style={{
                      width: 44, height: 44, borderRadius: 10,
                      background: `${m.color}18`,
                      border: `1px solid ${m.color}35`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                    }}>
                      <div style={{ width: 14, height: 14, borderRadius: "50%", background: m.color, boxShadow: `0 0 10px ${m.color}80` }} />
                    </div>
                    <div>
                      <div style={{ fontSize: "1rem", fontWeight: 700, color: "#fff", letterSpacing: "-0.01em", marginBottom: "2px" }}>
                        {m.name}
                      </div>
                      <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.68rem", color: "rgba(122, 154, 191, 0.7)", letterSpacing: "0.04em" }}>
                        {m.org}
                      </div>
                    </div>
                  </div>
                  {/* Badge */}
                  <span style={{
                    display: "inline-flex", alignItems: "center",
                    padding: "3px 10px",
                    background: `${m.color}15`,
                    border: `1px solid ${m.color}30`,
                    borderRadius: "4px",
                    fontFamily: "'Geist Mono', monospace",
                    fontSize: "0.62rem", color: m.color,
                    letterSpacing: "0.06em", whiteSpace: "nowrap",
                    flexShrink: 0,
                  }}>
                    {m.badge}
                  </span>
                </div>

                {/* Params row */}
                <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
                  {[m.params, m.context].map((tag, j) => (
                    <span key={j} style={{
                      padding: "4px 10px",
                      background: "rgba(13, 114, 192, 0.1)",
                      border: "1px solid rgba(59, 158, 221, 0.15)",
                      borderRadius: "4px",
                      fontFamily: "'Geist Mono', monospace",
                      fontSize: "0.68rem", color: "#7dd3fc",
                      letterSpacing: "0.04em",
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Benchmark scores */}
                <div style={{
                  padding: "14px 16px",
                  background: "rgba(2, 12, 27, 0.6)",
                  borderRadius: "8px",
                  border: "1px solid rgba(13, 37, 69, 0.8)",
                  display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px",
                }}>
                  {[
                    { label: "MMLU", value: m.benchmarks.mmlu },
                    { label: "HumanEval", value: m.benchmarks.humaneval },
                    { label: "MATH", value: m.benchmarks.math },
                  ].map((b, j) => (
                    <div key={j} style={{ textAlign: "center" }}>
                      <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(122, 154, 191, 0.6)", marginBottom: "4px" }}>
                        {b.label}
                      </div>
                      <div style={{ fontSize: "1rem", fontWeight: 700, color: "#fff", letterSpacing: "-0.02em" }}>
                        {b.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* View all CTA */}
          <div style={{ textAlign: "center", marginTop: "48px" }}>
            <a
              href="mailto:contact@lugano.ai"
              style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                fontSize: "0.875rem", fontWeight: 600,
                color: "#3b9edd", textDecoration: "none",
                padding: "12px 24px",
                border: "1px solid rgba(59, 158, 221, 0.25)",
                borderRadius: "8px",
                background: "rgba(59, 158, 221, 0.06)",
                transition: "all 0.25s",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = "rgba(59, 158, 221, 0.12)";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(59, 158, 221, 0.4)";
                (e.currentTarget as HTMLElement).style.color = "#7dd3fc";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = "rgba(59, 158, 221, 0.06)";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(59, 158, 221, 0.25)";
                (e.currentTarget as HTMLElement).style.color = "#3b9edd";
              }}
            >
              View all models
              <ArrowRight size={14} strokeWidth={2.5} />
            </a>
          </div>
        </div>
      </section>

      {/* ── SECTION DIVIDER ─────────────────────────────────── */}
      <div style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(59, 158, 221, 0.15) 30%, rgba(59, 158, 221, 0.15) 70%, transparent)" }} />

      {/* ── SOCIAL PROOF TICKER ─────────────────────────────── */}
      <section style={{ padding: "40px 0", background: "rgba(3, 10, 22, 0.99)", overflow: "hidden", borderTop: "1px solid rgba(59, 158, 221, 0.06)", borderBottom: "1px solid rgba(59, 158, 221, 0.06)" }}>
        <div style={{ display: "flex", gap: "64px", animation: "ticker 35s linear infinite", width: "max-content" }}>
          {[...Array(2)].map((_, rep) => (
            [
              { metric: "Zero Data Breaches", sub: "Since inception" },
              { metric: "100+ Enterprise Clients", sub: "Across 18 countries" },
              { metric: "99.9% Uptime SLA", sub: "Guaranteed" },
              { metric: "SOC 2 Type II", sub: "Certified" },
              { metric: "FedRAMP Ready", sub: "IL5 Compliant" },
              { metric: "<50ms Inference", sub: "P99 latency" },
              { metric: "Air-Gapped by Default", sub: "No exceptions" },
              { metric: "ZK Proof on Every Call", sub: "Cryptographic" },
            ].map((item, i) => (
              <div key={`${rep}-${i}`} style={{ display: "flex", alignItems: "center", gap: "48px", flexShrink: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#3b9edd", flexShrink: 0 }} />
                  <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.72rem", letterSpacing: "0.06em", color: "rgba(226,234,246,0.5)", whiteSpace: "nowrap" }}>
                    {item.metric}
                  </span>
                  <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.65rem", color: "rgba(122, 154, 191, 0.35)", whiteSpace: "nowrap" }}>
                    — {item.sub}
                  </span>
                </div>
              </div>
            ))
          ))}
        </div>
      </section>

      {/* ── SECTION DIVIDER ─────────────────────────────────── */}
      <div style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(59, 158, 221, 0.15) 30%, rgba(59, 158, 221, 0.15) 70%, transparent)" }} />

      {/* ── TRUST / ZK PROOF SECTION ────────────────────────── */}
      <section style={{ padding: "120px 0", background: "rgba(4, 12, 28, 0.98)", position: "relative", overflow: "hidden" }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "linear-gradient(rgba(59, 158, 221, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 158, 221, 0.03) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }} />
        <div className="container" style={{ position: "relative" }}>
          <div style={{
            maxWidth: "860px", margin: "0 auto",
            padding: "72px 64px",
            background: "rgba(7, 20, 40, 0.8)",
            backdropFilter: "blur(24px)",
            borderRadius: "20px",
            border: "1px solid rgba(59, 158, 221, 0.2)",
            boxShadow: "0 0 80px rgba(13, 114, 192, 0.12), 0 32px 64px rgba(0,0,0,0.4)",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}>
            {/* Corner accents */}
            <div style={{ position: "absolute", top: 0, left: 0, width: 60, height: 60, borderTop: "1px solid rgba(59, 158, 221, 0.4)", borderLeft: "1px solid rgba(59, 158, 221, 0.4)", borderRadius: "20px 0 0 0" }} />
            <div style={{ position: "absolute", top: 0, right: 0, width: 60, height: 60, borderTop: "1px solid rgba(59, 158, 221, 0.4)", borderRight: "1px solid rgba(59, 158, 221, 0.4)", borderRadius: "0 20px 0 0" }} />
            <div style={{ position: "absolute", bottom: 0, left: 0, width: 60, height: 60, borderBottom: "1px solid rgba(59, 158, 221, 0.4)", borderLeft: "1px solid rgba(59, 158, 221, 0.4)", borderRadius: "0 0 0 20px" }} />
            <div style={{ position: "absolute", bottom: 0, right: 0, width: 60, height: 60, borderBottom: "1px solid rgba(59, 158, 221, 0.4)", borderRight: "1px solid rgba(59, 158, 221, 0.4)", borderRadius: "0 0 20px 0" }} />

            {/* Top glow */}
            <div style={{
              position: "absolute", top: 0, left: "25%", right: "25%", height: 1,
              background: "linear-gradient(90deg, transparent, rgba(59, 158, 221, 0.7), transparent)",
            }} />

            <div style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              padding: "6px 16px",
              background: "rgba(13, 114, 192, 0.15)",
              border: "1px solid rgba(59, 158, 221, 0.25)",
              borderRadius: "100px",
              marginBottom: "32px",
            }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#3b9edd", boxShadow: "0 0 8px #3b9edd" }} />
              <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "#7dd3fc" }}>
                Zero-Knowledge Guarantee
              </span>
            </div>

            <blockquote style={{
              fontSize: "clamp(1.4rem, 3vw, 2.2rem)",
              fontWeight: 700, letterSpacing: "-0.03em",
              color: "#fff", lineHeight: 1.25,
              margin: "0 0 32px",
            }}>
              "Intelligence without sovereignty<br />
              <span style={{ color: "rgba(226,234,246,0.4)" }}>is just surveillance."</span>
            </blockquote>

            <p style={{ fontSize: "0.95rem", color: "rgba(226,234,246,0.5)", lineHeight: 1.7, maxWidth: "560px", margin: "0 auto 40px" }}>
              Lugano is the only AI infrastructure that can prove — cryptographically — that your data was never exposed. Not to us. Not to anyone.
            </p>

            <a
              href="mailto:contact@lugano.ai"
              style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                padding: "14px 32px", borderRadius: "10px",
                background: LAKE_GRADIENT,
                color: "#fff", fontSize: "0.9rem", fontWeight: 600,
                textDecoration: "none",
                boxShadow: "0 0 40px rgba(13, 114, 192, 0.45)",
                transition: "all 0.25s",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.boxShadow = "0 0 60px rgba(13, 114, 192, 0.7)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.boxShadow = "0 0 40px rgba(13, 114, 192, 0.45)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
              }}
            >
              Request Access
              <ArrowRight size={15} strokeWidth={2.5} />
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────── */}
      <footer style={{
        padding: "64px 0 40px",
        background: "#010810",
        borderTop: "1px solid rgba(59, 158, 221, 0.08)",
      }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "48px", marginBottom: "64px" }} className="footer-grid">
            {/* Brand */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: LAKE_GRADIENT,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 0 16px rgba(13, 114, 192, 0.3)",
                }}>
                  <Lock size={16} color="white" strokeWidth={2.5} />
                </div>
                <span style={{ fontSize: "1rem", fontWeight: 700, letterSpacing: "-0.02em", color: "#fff" }}>
                  Lugano<span style={{ color: "#3b9edd" }}>.ai</span>
                </span>
              </div>
              <p style={{ fontSize: "0.85rem", color: "rgba(122, 154, 191, 0.7)", lineHeight: 1.7, maxWidth: "280px" }}>
                The sovereign AI infrastructure for organizations that cannot afford to leak.
              </p>
            </div>

            {/* Links */}
            {[
              { title: "Platform", links: ["Architecture", "Models", "Agents", "Pricing"] },
              { title: "Company", links: ["About", "Blog", "Careers", "Press"] },
              { title: "Legal", links: ["Privacy", "Terms", "Security", "Compliance"] },
            ].map((col, i) => (
              <div key={i}>
                <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "#3b9edd", marginBottom: "16px" }}>
                  {col.title}
                </div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
                  {col.links.map((link) => (
                    <li key={link}>
                      <a href="#" style={{ fontSize: "0.85rem", color: "rgba(122, 154, 191, 0.65)", textDecoration: "none", transition: "color 0.2s" }}
                        onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                        onMouseLeave={e => (e.currentTarget.style.color = "rgba(122, 154, 191, 0.65)")}
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            paddingTop: "24px",
            borderTop: "1px solid rgba(59, 158, 221, 0.08)",
            flexWrap: "wrap", gap: "12px",
          }}>
            <p style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.1em", color: "rgba(122, 154, 191, 0.4)" }}>
              © 2026 LUGANO.AI — ALL RIGHTS RESERVED
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 8px #22c55e" }} />
              <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(122, 154, 191, 0.5)" }}>
                All systems operational
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* ── Inline responsive styles ─────────────────────────── */}
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.08); opacity: 1; }
        }
        /* Glassmorphism enhancement for nav */
        nav {
          -webkit-backdrop-filter: blur(20px) saturate(180%);
        }
        /* Crisp text rendering */
        h1, h2, h3 {
          text-rendering: optimizeLegibility;
          -webkit-font-smoothing: antialiased;
        }
        /* Agent card icon glow on hover */
        .agent-card:hover .agent-icon {
          box-shadow: 0 0 40px currentColor;
        }
        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 480px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
          }
        }
        .lugano-card:hover .pillar-underline,
        div:hover > .pillar-underline {
          transform: scaleX(1) !important;
        }
      `}</style>
    </div>
  );
}
