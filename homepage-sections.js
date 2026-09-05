(() => {
  const ROOT_ID = "lugano-extra-sections";
  const BRAND_MARK_SRC = "logo-mark.webp?v=brand-manus-parity-20260622";
  const USE_CASES_SECTION_ID = "use-cases";
  const USE_CASES_HASH = "#/?section=use-cases";
  const MAX_MOUNT_ATTEMPTS = 180;
  const CARD_SELECTOR = [
    "#root .feature-card",
    "#root .comparison-card",
    "#root .stat-glass-card",
    "#root .lgx-why-now-stat",
    "#root .lgx-tier-card",
    "#lugano-extra-sections .lgx-card",
  ].join(", ");
  const CIPHER_CHARS = "0123456789ABCDEF";
  const CIPHER_CELL_WIDTH = 7;
  const CIPHER_CELL_HEIGHT = 14;
  const CIPHER_FONT_SIZE = 11;
  const CIPHER_UPDATE_MIN = 1400;
  const CIPHER_UPDATE_RANGE = 1800;
  const CIPHER_FLASH_DURATION = 320;
  const CTA_LABEL_TEXT = "Waitlist";
  const HERO_ART_DESKTOP_SRC = "assets/lugano-engraving-v1.webp";
  const HERO_ART_MOBILE_SRC = "assets/lugano-engraving-v1-mobile.webp";
  const HERO_WATER_START = 0.79;
  const HERO_WATER_END = 0.995;
  const HERO_PARALLAX_LIMIT = 6;
  const HERO_PROOF_FACTS = [
    "Cryptographically auditable",
    "Any model",
    "Zero-trust by default",
  ];
  const HERO_VERIFICATION_ROWS = [
    { label: "TDX quote verified", digest: "4971...ba575" },
    { label: "GPU attestation verified", digest: "c8f2...3e41a" },
    { label: "Proof verification", digest: "[REDACTED]" },
    { label: "Constraint check", digest: "[REDACTED]" },
    { label: "Nonce binding verified", digest: "a1d9...7f283" },
    { label: "Signing key bound", digest: "e3b7...9c064" },
    { label: "Receipt verification", digest: "f6a4...2d817" },
    { label: "Disclosure verification", digest: "7f93...6c4e2" },
    { label: "Payload integrity", digest: "b2a6...8d5f1" },
    { label: "No prompt retention", digest: "0 retained" },
  ];
  let enhancementFrame = 0;
  let heroDepthController = null;
  let heroRouteFrame = 0;
  let applyScrollFrame = 0;
  let applyScrollRoute = "";
  let lastHeaderPointerActivation = { key: "", timestamp: 0 };
  const CTA_LABELS = new Set([
    "apply for beta",
    "apply for access",
    "request a demo",
    "request access",
    "request briefing",
    "request demo",
  ]);
  const HEADER_NAV_ORDER = [
    "Platform",
    "Architecture",
    "Privacy",
    "Use Cases",
    "Docs",
  ];
  const SECTION_NAV_TARGETS = {
    architecture: "architecture",
    platform: "platform",
    privacy: "privacy",
    "use cases": USE_CASES_SECTION_ID,
  };
  const HEADER_NAV_ACTIVATION_EVENTS = ["pointerup", "click"];
  const HEADER_NAV_CLICK_SELECTOR = "a, button";
  const WHY_NOW_SECTION_ID = "why-now";
  const PRIVACY_LEVELS_SECTION_ID = "privacy-levels";
  const PRIVACY_POSITIONING_ID = "lugano-privacy-positioning";
  const PRIVACY_LEVELS = ["Tier 1", "Tier 2", "[REDACTED]", "[CLASSIFIED]"];
  const WHAT_WE_DO_DUPLICATE_CALLOUT =
    "Not private by policy. Private by architecture you can audit yourself.";
  const PLATFORM_STEP_UPDATES = {
    "/02": {
      title: "Privacy Routing",
      description:
        "Access controls, model permissions, and privacy boundaries are enforced at the protocol layer. Sensitive data stays inside the verified path.",
    },
    "/04": {
      title: "Attestation Record",
      description:
        "Each run returns verifiable privacy attestations across 10+ checks, covering execution state, routing, policy, receipt integrity, disclosure scope, and retention posture.",
    },
  };
  const TEXT_UPDATES = {
    Auditability: "Verification / Auditability",
    "Private by architecture, not by policy.": "AI Privacy by Proof",
  };
  const HERO_STAT_CARD_UPDATES = [
    { label: "DATA / PROMPTS", value: "Privacy, even from us." },
    { label: "RETENTION", value: "Can’t leak what we don’t keep." },
    { label: "EVERY REQUEST", value: "Receipts or it didn’t happen." },
    { label: "THREAT MODEL", value: "Paranoid by design." },
  ];
  const BASE_USE_CASE_UPDATES = {
    "Regulated industries": {
      title: "Regulated Industries",
      subtitle:
        "Deploy AI against sensitive internal data while preserving reviewable privacy boundaries.",
      body:
        "Internal knowledge work. Sensitive analysis. Legal, finance, healthcare, and operations workflows.",
    },
  };

  const useCases = [
    {
      title: "Enterprise",
      icon: "enterprise",
      image: "/assets/lugano-enterprise-engraving.webp",
      imageAlt: "Cobalt engraving of a Swiss lakeside office complex within a private perimeter",
      summary:
        "Deploy AI across operations. Prove your data posture.",
      bullets: [
        "Use frontier models across your organization without new exposure surfaces",
        "Protect IP, trade secrets, and sensitive workflows",
        "We handle everything for you. Verifiably private.",
      ],
    },
    {
      title: "Government and defense",
      icon: "defense",
      image: "/assets/lugano-sovereign-engraving.webp",
      imageAlt: "Cobalt engraving of a fortified Swiss infrastructure complex within an Alpine perimeter",
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
      title: "Regulated Industries",
      icon: "regulated",
      image: "/assets/lugano-regulated-engraving.webp",
      imageAlt: "Cobalt engraving of Swiss institutions linked by precise audit paths",
      summary:
        "Deploy AI against sensitive internal data while preserving reviewable privacy boundaries.",
      bullets: [
        "Internal knowledge work.",
        "Sensitive analysis.",
        "Legal, finance, healthcare, and operations workflows.",
      ],
    },
  ];

  const agents = [
    {
      title: "Hermes Agent",
      logo: "brand-assets/hermes-agent.webp",
      logoAlt: "Hermes Agent logo",
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
      emoji: "🤖",
      summary:
        "Run agentic workflows without turning tools, logs, and intermediate steps into exposure surfaces.",
      bullets: [
        "Private tool use.",
        "Reduced transcript leakage.",
        "Reviewable action evidence.",
      ],
      featured: true,
    },
  ];

  const models = [
    {
      title: "GLM-5.3",
      maker: "Z.ai",
      logo: "brand-assets/zai.webp",
      logoAlt: "Z.ai logo",
      specs: "753B parameters / 1M context",
      source: "https://huggingface.co/zai-org/GLM-5.3",
      benchmarks: [
        { label: "Focus", value: "Coding" },
        { label: "Reasoning", value: "3 levels" },
        { label: "Weights", value: "Custom license" },
      ],
      featured: true,
    },
    {
      title: "Kimi K3",
      maker: "Moonshot AI",
      logo: "brand-assets/kimi.ico",
      logoAlt: "Kimi logo",
      specs: "2.8T MoE / 104B active",
      source: "https://huggingface.co/moonshotai/Kimi-K3",
      benchmarks: [
        { label: "Context", value: "1M" },
        { label: "Vision", value: "Native" },
        { label: "Weights", value: "Custom license" },
      ],
    },
    {
      title: "DeepSeek V4 Pro · 0813",
      maker: "DeepSeek",
      logo: "brand-assets/deepseek.ico",
      logoAlt: "DeepSeek logo",
      specs: "1.6T MoE / 49B active",
      source: "https://huggingface.co/deepseek-ai/DeepSeek-V4-Pro-0813",
      benchmarks: [
        { label: "Context", value: "1M" },
        { label: "Reasoning", value: "3 levels" },
        { label: "License", value: "MIT" },
      ],
    },
    {
      title: "MiniMax M3",
      maker: "MiniMax",
      logo: "brand-assets/minimax.webp",
      logoAlt: "MiniMax logo",
      specs: "428B MoE / 23B active",
      source: "https://huggingface.co/MiniMaxAI/MiniMax-M3",
      benchmarks: [
        { label: "Context", value: "1M" },
        { label: "Vision", value: "Native" },
        { label: "Weights", value: "Community" },
      ],
    },
    {
      title: "GLM-5.3 Flash",
      maker: "Z.ai",
      logo: "brand-assets/zai.webp",
      logoAlt: "Z.ai logo",
      specs: "320B MoE / 18B active",
      source: "https://huggingface.co/zai-org/GLM-5.3-Flash",
      benchmarks: [
        { label: "Focus", value: "Multimodal" },
        { label: "Reasoning", value: "3 levels" },
        { label: "License", value: "MIT" },
      ],
    },
    {
      title: "MiMo-V2.5-Pro",
      maker: "Xiaomi",
      logo: "brand-assets/xiaomi.svg",
      logoAlt: "Xiaomi logo",
      specs: "1.02T MoE / 42B active",
      source: "https://huggingface.co/XiaomiMiMo/MiMo-V2.5-Pro",
      benchmarks: [
        { label: "Context", value: "1M" },
        { label: "Focus", value: "Agentic coding" },
        { label: "License", value: "MIT" },
      ],
    },
  ];

  const escapeHtml = (value) =>
    value
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");

  const iconMarkup = (name) => {
    const icons = {
      enterprise:
        '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M7 27V9l9-4 9 4v18" /><path d="M11 27v-8h10v8M12 13h2M18 13h2M12 17h2M18 17h2" /></svg>',
      defense:
        '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 4l10 4v7c0 7-4 11-10 13C10 26 6 22 6 15V8l10-4z" /><path d="M16 10v11M11 15h10" /></svg>',
      finance:
        '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M7 24h18M9 21v-6M15 21V9M21 21V12" /><path d="M8 12l7-6 5 4 5-5" /></svg>',
      regulated:
        '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M7 25h18" /><path d="M9 21h14M11 21V11M16 21V11M21 21V11" /><path d="M6 11h20L16 5 6 11z" /></svg>',
      hermes:
        '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M8 18c0-5 4-9 9-9h7" /><path d="M20 5l4 4-4 4M24 16c0 5-4 9-9 9H8" /><path d="M12 29l-4-4 4-4" /></svg>',
      openclaw:
        '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M8 22c4-9 8-13 16-13" /><path d="M10 24c6 3 12 2 16-3M17 14l4 4M22 10l4 4" /></svg>',
      custom:
        '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M8 10h16v12H8z" /><path d="M12 10V7h8v3M12 22v3h8v-3" /><path d="M13 16h.1M19 16h.1" /></svg>',
      kimi:
        '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M6 18c4-9 11-12 20-10-2 8-7 14-18 18" /><path d="M12 20l8-8M17 24l9-9" /></svg>',
      deepseek:
        '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M8 18c2-8 8-12 15-11 3 5 2 12-3 16-4 3-9 3-12-1" /><path d="M18 10l-2 5 5-2M12 24c-3 0-5-2-6-5" /></svg>',
      glm:
        '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M8 23V9l8 7 8-7v14" /><path d="M8 9h5l3 7 3-7h5" /></svg>',
      minimax:
        '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M7 22V10l9 12 9-12v12" /><path d="M7 10h5l4 6 4-6h5" /></svg>',
      qwen:
        '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 5l9 5v12l-9 5-9-5V10l9-5z" /><path d="M12 14l4-3 4 3v5l-4 3-4-3z" /></svg>',
      ring:
        '<svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="9" /><path d="M9 16h14M16 7v18" /></svg>',
    };

    return icons[name] || icons.custom;
  };

  const listMarkup = (items) =>
    items.map((item) => `<li>${escapeHtml(item)}</li>`).join("");

  const privacyLevelMarkup = (items) =>
    items
      .map((item) => {
        const isRestricted = item.startsWith("[");
        const className = isRestricted
          ? "lgx-tier-card is-restricted"
          : "lgx-tier-card";
        return `<span class="${className}"><span class="lgx-tier-label">${escapeHtml(item)}</span></span>`;
      })
      .join("");

  const randomCipherCharacter = () =>
    CIPHER_CHARS[Math.floor(Math.random() * CIPHER_CHARS.length)];

  const createCipherGrid = (columns, rows) =>
    Array.from({ length: rows }, () =>
      Array.from({ length: columns }, () => ({
        character: randomCipherCharacter(),
        flashUntil: 0,
        nextUpdate: performance.now() + Math.random() * CIPHER_UPDATE_RANGE,
      })),
    );

  const brandMarkMarkup = (item, sizeClass) => {
    if (item.logo) {
      return `
        <div class="lgx-icon lgx-brand-icon ${sizeClass}">
          <img src="${escapeHtml(item.logo)}" alt="${escapeHtml(item.logoAlt || `${item.title} logo`)}" loading="eager" decoding="async">
        </div>`;
    }

    if (item.emoji) {
      return `
        <div class="lgx-icon lgx-brand-icon lgx-emoji-icon ${sizeClass}" aria-label="${escapeHtml(item.title)} mark">
          <span aria-hidden="true">${escapeHtml(item.emoji)}</span>
        </div>`;
    }

    return `<div class="lgx-icon ${sizeClass}">${iconMarkup(item.icon)}</div>`;
  };

  const verticalCardMarkup = (item) => `
    <article class="lgx-card lgx-vertical-card${item.featured ? " is-featured" : ""}">
      <figure class="lgx-card-media">
        <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.imageAlt)}" loading="lazy" decoding="async" width="1792" height="1024">
      </figure>
      <div class="lgx-card-body">
        <div class="lgx-card-head">
          <div class="lgx-icon">${iconMarkup(item.icon)}</div>
          <h3>${escapeHtml(item.title)}</h3>
        </div>
        <p>${escapeHtml(item.summary)}</p>
        <ul>${listMarkup(item.bullets)}</ul>
      </div>
    </article>`;

  const agentCardMarkup = (item) => `
    <article class="lgx-card lgx-agent-card${item.featured ? " is-featured" : ""}">
      ${brandMarkMarkup(item, "lgx-icon-large")}
      <h3>${escapeHtml(item.title)}</h3>
      <p>${escapeHtml(item.summary)}</p>
      ${item.bullets ? `<ul class="lgx-agent-list">${listMarkup(item.bullets)}</ul>` : ""}
    </article>`;

  const modelCardMarkup = (item) => `
    <article class="lgx-card lgx-model-card${item.featured ? " is-featured" : ""}">
      ${brandMarkMarkup(item, "lgx-icon-model")}
      <div class="lgx-model-copy">
        <h3><a class="lgx-model-source" href="${escapeHtml(item.source)}" target="_blank" rel="noopener noreferrer" aria-label="${escapeHtml(item.title)} model card (opens in a new tab)">${escapeHtml(item.title)}</a></h3>
        <p>${escapeHtml(item.maker)}</p>
        <div class="lgx-model-spec">${escapeHtml(item.specs)}</div>
        <dl>
          ${item.benchmarks
            .map(
              (benchmark) =>
                `<div><dt>${escapeHtml(benchmark.label)}</dt><dd>${escapeHtml(
                  benchmark.value,
                )}</dd></div>`,
            )
            .join("")}
        </dl>
      </div>
    </article>`;

  const buildSections = () => {
    const wrapper = document.createElement("div");
    wrapper.id = ROOT_ID;
    wrapper.className = "lgx-root";
    wrapper.innerHTML = `
      <section id="${USE_CASES_SECTION_ID}" class="lgx-section" aria-labelledby="use-cases-title">
        <div class="lgx-shell">
          <div class="lgx-centered-heading">
            <div class="lgx-kicker"><span></span>Use Cases<span></span></div>
            <h2 id="use-cases-title">Built for sensitive environments</h2>
          </div>
          <div class="lgx-vertical-grid">${useCases.map(verticalCardMarkup).join("")}</div>
        </div>
      </section>

      <section id="private-agents" class="lgx-section" aria-labelledby="agents-title">
        <div class="lgx-shell">
          <div class="lgx-centered-heading">
            <h2 id="agents-title">Make Your Agents Fully Private</h2>
            <p>Any agent framework. Any workflow. Zero data leakage.</p>
            <p class="lgx-product-surface lgx-agent-product-kicker">Private Chat <span aria-hidden="true">&middot;</span> Private Agents <span aria-hidden="true">&middot;</span> Private API <span aria-hidden="true">&mdash;</span> in private beta.</p>
          </div>
          <div class="lgx-agent-grid">${agents.map(agentCardMarkup).join("")}</div>
        </div>
      </section>

      <section id="private-models" class="lgx-section" aria-labelledby="models-title">
        <div class="lgx-shell">
          <div class="lgx-centered-heading">
            <h2 id="models-title">Private Models Available</h2>
            <p>Run leading open models inside a verifiable privacy boundary</p>
          </div>
          <div class="lgx-model-grid">${models.map(modelCardMarkup).join("")}</div>
          <div class="lgx-model-note">Model availability varies by private beta environment. Open-weight releases and specifications checked against official model cards on September 5, 2026. Licenses vary by model. Select a model name for its source.</div>
        </div>
      </section>`;

    return wrapper;
  };

  const buildWhyNowStrip = () => {
    const section = document.createElement("section");
    section.id = WHY_NOW_SECTION_ID;
    section.className = "lgx-why-now-section";
    section.setAttribute("aria-labelledby", "why-now-title");
    section.innerHTML = `
      <div class="lgx-shell lgx-why-now-grid">
        <div class="lgx-why-now-copy">
          <div class="lgx-kicker"><span></span>[ THE TRUST GAP ]<span></span></div>
          <h2 id="why-now-title"><span>The industry is obsessed with capability.</span> <em>The market is blocked by trust.</em></h2>
        </div>
        <aside class="lgx-why-now-stat" aria-label="Enterprise AI restriction statistic">
          <strong>67%</strong>
          <p>of enterprises restrict AI use over data exposure concerns.</p>
          <cite>Cisco Data Privacy Benchmark</cite>
        </aside>
      </div>`;

    return section;
  };

  const privacyTierBandMarkup = () => `
    <div id="${PRIVACY_POSITIONING_ID}" class="lgx-privacy-positioning lgx-tier-positioning">
      <div class="lgx-tier-band" aria-label="Privacy levels">
        <div class="lgx-tier-row">${privacyLevelMarkup(PRIVACY_LEVELS)}</div>
      </div>
    </div>`;

  const getSectionHash = (sectionId) => `#/?section=${sectionId}`;

  const getHashSectionId = () => {
    const hash = window.location.hash.toLowerCase();

    if (hash === `#${USE_CASES_SECTION_ID}` || hash === USE_CASES_HASH) {
      return USE_CASES_SECTION_ID;
    }

    const directSectionId = hash.slice(1);

    if (Object.values(SECTION_NAV_TARGETS).includes(directSectionId)) {
      return directSectionId;
    }

    if (!hash.startsWith("#/")) {
      return "";
    }

    const [, queryString = ""] = hash.split("?");
    const sectionId = new URLSearchParams(queryString).get("section") || "";
    return Object.values(SECTION_NAV_TARGETS).includes(sectionId) ? sectionId : "";
  };

  const shouldMount = () => {
    const hash = window.location.hash.toLowerCase();
    return (
      hash === "" ||
      hash === "#" ||
      hash === "#/" ||
      Boolean(getHashSectionId()) ||
      hash.startsWith("#/?")
    );
  };

  const getApplyRouteKey = () => window.location.hash.toLowerCase();

  const isApplyRoute = () => getApplyRouteKey().startsWith("#/apply");

  const scrollToTopImmediately = () => {
    const documentElement = document.documentElement;
    const previousScrollBehavior = documentElement.style.scrollBehavior;

    documentElement.style.scrollBehavior = "auto";
    window.scrollTo({ left: 0, top: 0, behavior: "auto" });

    window.requestAnimationFrame(() => {
      documentElement.style.scrollBehavior = previousScrollBehavior;
    });
  };

  const cancelApplyScrollReset = () => {
    if (!applyScrollFrame) {
      return;
    }

    window.cancelAnimationFrame(applyScrollFrame);
    applyScrollFrame = 0;
  };

  const resetApplyScrollWhenReady = (routeKey, attempt = 0) => {
    if (!isApplyRoute() || getApplyRouteKey() !== routeKey) {
      applyScrollFrame = 0;
      return;
    }

    if (!document.querySelector("#root .apply-form")) {
      if (attempt >= MAX_MOUNT_ATTEMPTS) {
        applyScrollFrame = 0;
        return;
      }

      applyScrollFrame = window.requestAnimationFrame(() => {
        resetApplyScrollWhenReady(routeKey, attempt + 1);
      });
      return;
    }

    applyScrollFrame = 0;
    applyScrollRoute = routeKey;
    scrollToTopImmediately();
  };

  const scheduleApplyScrollReset = () => {
    const routeKey = getApplyRouteKey();

    if (!isApplyRoute()) {
      applyScrollRoute = "";
      cancelApplyScrollReset();
      return;
    }

    if (applyScrollRoute === routeKey || applyScrollFrame) {
      return;
    }

    cancelApplyScrollReset();
    applyScrollFrame = window.requestAnimationFrame(() => resetApplyScrollWhenReady(routeKey));
  };

  const syncApplyScrollReset = () => {
    if (!isApplyRoute()) {
      applyScrollRoute = "";
      cancelApplyScrollReset();
      return;
    }

    scheduleApplyScrollReset();
  };

  const updateCtas = () => {
    document.querySelectorAll("a, button").forEach((element) => {
      const normalizedText = element.textContent.trim().replace(/\s+/g, " ").toLowerCase();

      if (CTA_LABELS.has(normalizedText)) {
        element.textContent = CTA_LABEL_TEXT;
      }
    });
  };

  const updateApplyWebsiteField = () => {
    document.querySelectorAll("form label").forEach((label) => {
      const normalizedText = label.textContent.trim().replace(/\s+/g, " ").toLowerCase();

      if (normalizedText !== "x profile") {
        return;
      }

      label.textContent = "Website URL";

      const input = label.parentElement?.querySelector("input");

      if (!input) {
        return;
      }

      input.type = "url";
      input.inputMode = "url";
      input.autocomplete = "url";
      input.placeholder = "https://company.com";
    });
  };

  const normalizeLiveHeadings = () => {
    document.querySelectorAll("#root section").forEach((section) => {
      const label = section.querySelector(".bracket-label");
      const heading = section.querySelector("h2");
      const headingBlock = label?.parentElement;

      if (!label || !heading || !headingBlock) {
        return;
      }

      section.classList.add("lgx-live-section");
      headingBlock.classList.add("lgx-live-heading");

      const labelSlug = label.textContent
        .replace(/[\[\]]/g, "")
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

      if (labelSlug) {
        if (labelSlug === "who-it-s-for") {
          section.remove();
          return;
        }

        section.classList.add(`lgx-live-${labelSlug}`);
      }
    });
  };

  const scrollToSection = (sectionId, shouldUpdateHash = false) => {
    const section = document.getElementById(sectionId);

    if (!section) {
      return false;
    }

    const navOffset = document.querySelector("nav")?.getBoundingClientRect().height || 0;
    const top = section.getBoundingClientRect().top + window.scrollY - navOffset;
    window.scrollTo({ top, behavior: "smooth" });

    const targetHash = getSectionHash(sectionId);

    if (shouldUpdateHash && window.location.hash !== targetHash) {
      window.history.pushState(null, "", targetHash);
    }

    return true;
  };

  const scrollToSectionWhenReady = (sectionId, attempt = 0) => {
    if (scrollToSection(sectionId)) {
      return;
    }

    if (attempt >= MAX_MOUNT_ATTEMPTS) {
      return;
    }

    mount();
    window.requestAnimationFrame(() => scrollToSectionWhenReady(sectionId, attempt + 1));
  };

  const getVisibleMobileMenu = () =>
    [...document.querySelectorAll("nav div")].find((element) => {
      const rect = element.getBoundingClientRect();
      return (
        getComputedStyle(element).position === "fixed" &&
        rect.width > 0 &&
        rect.height > 0
      );
    });

  const closeVisibleMobileMenu = () => {
    if (!getVisibleMobileMenu()) {
      return;
    }

    [...document.querySelectorAll("nav button")]
      .find((button) => {
        const rect = button.getBoundingClientRect();
        return (
          button.className.toString().includes("md:hidden") &&
          rect.width > 0 &&
          rect.height > 0
        );
      })
      ?.click();
  };

  const getNormalizedNavText = (element) =>
    element.textContent.trim().replace(/\s+/g, " ");

  const scrollHomeToTopWhenReady = (attempt = 0) => {
    if (!shouldMount()) {
      return;
    }

    scrollToTopImmediately();

    if (attempt >= 24) {
      return;
    }

    window.setTimeout(() => scrollHomeToTopWhenReady(attempt + 1), 50);
  };

  const navigateHomeFromHeader = () => {
    closeVisibleMobileMenu();

    if (window.location.hash !== "#/") {
      window.location.hash = "#/";
    }

    scrollHomeToTopWhenReady();
  };

  const navigateToHeaderSection = (sectionId) => {
    closeVisibleMobileMenu();

    if (!document.getElementById(sectionId)) {
      window.location.hash = getSectionHash(sectionId);
      window.requestAnimationFrame(() => scrollToSectionWhenReady(sectionId));
      return;
    }

    scrollToSection(sectionId, true);
  };

  const bindHeaderNavClickCapture = () => {
    if (document.documentElement.dataset.lgxHeaderNavCaptureBound === "true") {
      return;
    }

    document.documentElement.dataset.lgxHeaderNavCaptureBound = "true";

    const handleHeaderActivation = (event) => {
      if (event.type === "pointerup" && event.button !== 0) {
        return;
      }

      if (!(event.target instanceof Element)) {
        return;
      }

      const item = event.target.closest(HEADER_NAV_CLICK_SELECTOR);

      if (!item || !item.closest("nav")) {
        return;
      }

      const normalizedText = getNormalizedNavText(item).toLowerCase();
      const sectionId = SECTION_NAV_TARGETS[normalizedText];

      if (normalizedText !== "lugano.ai" && !sectionId) {
        return;
      }

      const activationKey = `${normalizedText}:${sectionId || "home"}`;
      const timestamp = performance.now();

      if (
        event.type === "click" &&
        lastHeaderPointerActivation.key === activationKey &&
        timestamp - lastHeaderPointerActivation.timestamp < 500
      ) {
        event.preventDefault();
        event.stopImmediatePropagation();
        return;
      }

      event.preventDefault();
      event.stopImmediatePropagation();

      if (event.type === "pointerup") {
        lastHeaderPointerActivation = { key: activationKey, timestamp };
      }

      if (normalizedText === "lugano.ai") {
        navigateHomeFromHeader();
        return;
      }

      navigateToHeaderSection(sectionId);
    };

    HEADER_NAV_ACTIVATION_EVENTS.forEach((eventName) => {
      document.addEventListener(
        eventName,
        handleHeaderActivation,
        true,
      );
    });
  };

  const bindLogoHomeNav = () => {
    const nav = document.querySelector("nav");

    if (!nav) {
      return;
    }

    [...nav.querySelectorAll("a")].forEach((link) => {
      const normalizedText = getNormalizedNavText(link).toLowerCase();

      if (normalizedText !== "lugano.ai" || link.dataset.lgxHomeNavBound === "true") {
        return;
      }

      link.dataset.lgxHomeNavBound = "true";
      link.href = "#/";
      link.addEventListener("click", (event) => {
        event.preventDefault();
        navigateHomeFromHeader();
      });
    });
  };

  const bindSectionNavItem = (item) => {
    const normalizedText = getNormalizedNavText(item).toLowerCase();
    const sectionId = SECTION_NAV_TARGETS[normalizedText];

    if (!sectionId || item.dataset.lgxSectionNavBound === "true") {
      return;
    }

    item.dataset.lgxSectionNavBound = "true";
    item.dataset.lgxSectionNav = sectionId;

    if (item.tagName.toLowerCase() === "a") {
      item.href = getSectionHash(sectionId);
    }

    item.addEventListener("click", (event) => {
      event.preventDefault();
      navigateToHeaderSection(sectionId);
    });
  };

  const createSectionNavItem = (label, referenceItem) => {
    const item = document.createElement("a");
    const sectionId = SECTION_NAV_TARGETS[label.toLowerCase()];
    item.href = getSectionHash(sectionId);
    item.textContent = label;
    item.className = referenceItem.className.toString();
    item.setAttribute("style", referenceItem.getAttribute("style") || "");
    item.dataset.lgxSectionNav = sectionId;
    bindSectionNavItem(item);
    return item;
  };

  const createUseCasesNavItem = (referenceItem) => {
    const item = createSectionNavItem("Use Cases", referenceItem);
    item.dataset.lgxUseCasesNav = "true";
    return item;
  };

  const createDocsNavItem = (referenceItem) => {
    const item = document.createElement("a");
    item.href = "/docs";
    item.textContent = "Docs";
    item.className = referenceItem.className.toString();
    item.dataset.lgxDocsNav = "true";
    return item;
  };

  const updateUseCasesNav = () => {
    const nav = document.querySelector("nav");

    if (!nav) {
      return;
    }

    [...nav.querySelectorAll("[data-lgx-use-cases-nav='true']")].forEach(bindSectionNavItem);

    [...nav.querySelectorAll("div")].forEach((container) => {
      const children = [...container.children];
      const labels = children.map((child) => getNormalizedNavText(child).toLowerCase());
      const platformItemIndex = labels.indexOf("platform");

      if (
        platformItemIndex === -1 ||
        !labels.includes("privacy") ||
        !labels.includes("architecture") ||
        labels.includes("use cases")
      ) {
        return;
      }

      const platformItem = children[platformItemIndex];
      container.insertBefore(createUseCasesNavItem(platformItem), platformItem);
    });
  };

  const updateDocsNav = () => {
    const nav = document.querySelector("nav");

    if (!nav) {
      return;
    }

    [...nav.querySelectorAll("div")].forEach((container) => {
      const children = [...container.children];
      const labels = children.map((child) => getNormalizedNavText(child).toLowerCase());
      const platformItemIndex = labels.indexOf("platform");

      if (platformItemIndex === -1 || labels.includes("docs")) {
        return;
      }

      const platformItem = children[platformItemIndex];
      container.insertBefore(createDocsNavItem(platformItem), platformItem.nextSibling);
    });
  };

  const normalizeHeaderNavOrder = () => {
    const nav = document.querySelector("nav");

    if (!nav) {
      return;
    }

    const orderedLabels = HEADER_NAV_ORDER.map((label) => label.toLowerCase());

    [...nav.querySelectorAll("div")].forEach((container) => {
      const children = [...container.children];
      const itemsByLabel = new Map();
      const ctaItems = [];

      children.forEach((child) => {
        const normalizedText = getNormalizedNavText(child).toLowerCase();
        const navLabel = HEADER_NAV_ORDER.find(
          (label) => label.toLowerCase() === normalizedText,
        );
        let navItem = child;

        if (SECTION_NAV_TARGETS[normalizedText] && child.tagName.toLowerCase() !== "a") {
          navItem = createSectionNavItem(navLabel || child.textContent.trim(), child);
          child.replaceWith(navItem);
        } else {
          bindSectionNavItem(navItem);
        }

        if (orderedLabels.includes(normalizedText) && !itemsByLabel.has(normalizedText)) {
          itemsByLabel.set(normalizedText, navItem);
        }

        if (CTA_LABELS.has(normalizedText) || normalizedText === CTA_LABEL_TEXT.toLowerCase()) {
          ctaItems.push(navItem);
        }
      });

      if (
        !itemsByLabel.has("platform") ||
        !itemsByLabel.has("architecture") ||
        !itemsByLabel.has("privacy")
      ) {
        return;
      }

      const platformItem = itemsByLabel.get("platform");

      if (!itemsByLabel.has("use cases")) {
        const useCasesItem = createUseCasesNavItem(platformItem);
        itemsByLabel.set("use cases", useCasesItem);
      }

      if (!itemsByLabel.has("docs")) {
        const docsItem = createDocsNavItem(platformItem);
        itemsByLabel.set("docs", docsItem);
      }

      orderedLabels.forEach((label) => {
        const item = itemsByLabel.get(label);

        if (item) {
          container.appendChild(item);
        }
      });

      ctaItems.forEach((item) => {
        container.appendChild(item);
      });
    });
  };

  const updateFooterDocsLink = () => {
    document.querySelectorAll("footer").forEach((footer) => {
      const footerLinkTargets = {
        Contact: "/#/apply",
        "Privacy Policy": "/privacy/",
        Security: "/security/",
        Terms: "/terms/",
      };

      Object.entries(footerLinkTargets).forEach(([label, href]) => {
        [...footer.querySelectorAll("span, a")].forEach((element) => {
          const normalizedText = element.textContent.trim().replace(/\s+/g, " ");
          const normalizedLabel = normalizedText === "Terms of Service" ? "Terms" : normalizedText;

          if (normalizedLabel !== label) {
            return;
          }

          if (element.tagName.toLowerCase() === "a") {
            if (element.getAttribute("href") !== href) {
              element.setAttribute("href", href);
            }

            if (element.textContent.trim() !== label) {
              element.textContent = label;
            }

            return;
          }

          const link = document.createElement("a");
          link.href = href;
          link.textContent = label;
          link.className = element.className.toString();
          link.setAttribute(
            "style",
            element.getAttribute("style") || "color: inherit; text-decoration: none;",
          );
          element.replaceWith(link);
        });
      });

      [...footer.querySelectorAll("a")].forEach((link) => {
        const normalizedText = link.textContent.trim().replace(/\s+/g, " ");
        const href = link.getAttribute("href") || "";

        if (normalizedText === "Lugano.ai" && ["", "#", "#/"].includes(href)) {
          link.setAttribute("href", "/");
        }
      });

      const existingDocsLink = [...footer.querySelectorAll("a")].find(
        (link) => link.textContent.trim().toLowerCase() === "docs",
      );

      if (existingDocsLink) {
        existingDocsLink.setAttribute("href", "/docs");
        return;
      }

      const referenceLink = footer.querySelector("a");

      if (!referenceLink?.parentElement) {
        return;
      }

      const docsLink = document.createElement("a");
      docsLink.href = "/docs";
      docsLink.textContent = "Docs";
      docsLink.className = referenceLink.className.toString();
      docsLink.setAttribute(
        "style",
        referenceLink.getAttribute("style") || "color: inherit; text-decoration: none;",
      );
      referenceLink.parentElement.appendChild(docsLink);
    });
  };

  const normalizeBrandMarkAssets = () => {
    document.querySelectorAll("nav a, footer a").forEach((link) => {
      const normalizedText = getNormalizedNavText(link).toLowerCase();

      if (normalizedText === "lugano.ai") {
        link.classList.add("lgx-brand-link");
      }
    });

    document.querySelectorAll("img").forEach((image) => {
      const source = image.getAttribute("src") || "";
      const sourcePath = source.split("?")[0];

      if (!sourcePath.endsWith("/logo-mark.svg") && sourcePath !== "logo-mark.svg") {
        return;
      }

      image.setAttribute("src", BRAND_MARK_SRC);
      image.alt = "";
      image.decoding = "async";
      image.classList.add("lgx-brand-mark-image");
      image.closest("a")?.classList.add("lgx-brand-link");
    });
  };

  const normalizeSectionBackgrounds = () => {
    const contentSections = [
      ...document.querySelectorAll("#root section, #lugano-extra-sections section"),
    ].filter(
      (section) =>
        section.querySelector("h2") &&
        !section.classList.contains("lgx-why-now-section"),
    );

    contentSections.forEach((section, index) => {
      section.classList.toggle("lgx-gradient-band", index % 2 === 0);
    });
  };

  const ensureWhyNowStrip = () => {
    if (document.getElementById(WHY_NOW_SECTION_ID)) {
      return;
    }

    const problemSection = [...document.querySelectorAll("#root section")].find((section) => {
      if (section.classList.contains("lgx-live-the-problem")) {
        return true;
      }

      const label = section.querySelector(".bracket-label")?.textContent.trim();
      return label === "[ THE PROBLEM ]";
    });

    if (!problemSection?.parentElement) {
      return;
    }

    problemSection.insertAdjacentElement("afterend", buildWhyNowStrip());
  };

  const enhancePrivacyPositioning = () => {
    const privacySection = document.getElementById("privacy");

    if (!privacySection || privacySection.querySelector(`#${PRIVACY_POSITIONING_ID}`)) {
      return;
    }

    const contentShell = privacySection.querySelector(":scope > div");

    if (!contentShell) {
      return;
    }

    contentShell.insertAdjacentHTML("beforeend", privacyTierBandMarkup());
  };

  const ensurePrivacyLevelsSection = () => {
    document.getElementById(PRIVACY_LEVELS_SECTION_ID)?.remove();
  };

  const removeWhatWeDoDuplicateCallout = () => {
    const whatWeDoSection =
      document.querySelector(".lgx-live-what-we-do") ||
      [...document.querySelectorAll("#root section")].find(
        (section) =>
          section.querySelector(".bracket-label")?.textContent.trim() === "[ WHAT WE DO ]",
      );

    whatWeDoSection
      ?.querySelectorAll(".lgx-live-heading > div:not(.bracket-label) > .relative")
      .forEach((callout) => {
        const normalizedText = callout.textContent.trim().replace(/\s+/g, " ");

        if (normalizedText === WHAT_WE_DO_DUPLICATE_CALLOUT) {
          callout.remove();
        }
      });
  };

  const ensurePlatformOrder = () => {
    const whatWeDoSection =
      document.querySelector(".lgx-live-what-we-do") ||
      [...document.querySelectorAll("#root section")].find(
        (section) =>
          section.querySelector(".bracket-label")?.textContent.trim() === "[ WHAT WE DO ]",
      );
    const platformSection = document.getElementById("platform");

    if (!whatWeDoSection?.parentElement || !platformSection) {
      return;
    }

    if (whatWeDoSection.nextElementSibling !== platformSection) {
      whatWeDoSection.insertAdjacentElement("afterend", platformSection);
    }
  };

  const updatePlatformHeadingCopy = () => {
    const platformSection = document.getElementById("platform");
    const headingBlock = platformSection?.querySelector(".lgx-live-heading");
    const label = headingBlock?.querySelector(".bracket-label");
    const heading = headingBlock?.querySelector("h2");

    if (!platformSection || !headingBlock) {
      return;
    }

    if (label && label.textContent.trim() !== "[ HOW IT WORKS ]") {
      label.textContent = "[ HOW IT WORKS ]";
    }

    if (heading && heading.textContent.trim() !== "Privacy by proof, not promise.") {
      heading.textContent = "Privacy by proof, not promise.";
    }

    headingBlock.querySelectorAll("p").forEach((paragraph) => {
      if (paragraph.textContent.trim() === "Nothing you have to build.") {
        paragraph.remove();
      }
    });
  };

  const updateHeroLeadCopy = () => {
    const oldCopy =
      "Unverifiable privacy is just marketing. Lugano.ai is private AI infrastructure: cryptographically auditable, perimeter-locked, zero-trust by default.";
    const newCopy =
      "Unverifiable privacy is just marketing. Lugano.ai is provably private AI infrastructure: any model, cryptographically auditable, zero-trust by default.";
    const target = [...document.querySelectorAll("#root section p")].find((paragraph) =>
      [oldCopy, newCopy].includes(paragraph.textContent.trim()),
    );

    if (target && target.textContent.trim() !== newCopy) {
      target.textContent = newCopy;
    }
  };

  const getHeroSection = () =>
    document.querySelector("#root section.flex-col.justify-between:first-of-type");

  const getProofButton = (hero) =>
    [...hero.querySelectorAll("button")].find((button) =>
      button.textContent.trim().replace(/\s+/g, " ").includes("Verified Private"),
    );

  const getDirectHeroChildContaining = (heroContent, target) =>
    [...heroContent.children].find((child) => child.contains(target));

  const proofCheckMarkup = () => `
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M3.25 8.35 6.35 11.4 12.85 4.6" />
    </svg>`;

  const staticProofPanelMarkup = () => `
    <div class="lgx-proof-panel-inner">
      <div class="lgx-proof-panel-top">
        <span class="lgx-proof-status">Verified Private AI</span>
        <span class="lgx-proof-count">10+ checks</span>
      </div>
      <div class="lgx-proof-ledger" role="list" aria-label="Lugano privacy guarantees">
        ${HERO_PROOF_FACTS
          .map(
            (label) => `
              <span class="lgx-proof-row" data-lugano-attestation-row role="listitem">
                <span class="lgx-proof-check">${proofCheckMarkup()}</span>
                <span class="lgx-proof-label">${escapeHtml(label)}</span>
              </span>`,
          )
          .join("")}
      </div>
    </div>`;

  const heroVerificationLedgerMarkup = () => `
    <div class="lgx-hero-ledger-shell">
      <header class="lgx-hero-ledger-heading">
        <p class="lgx-hero-ledger-kicker">10+ checks</p>
        <h2 id="lugano-proof-ledger-heading">Verified Private AI</h2>
      </header>
      <ol class="lgx-hero-ledger-list" aria-label="Verification checks">
        ${HERO_VERIFICATION_ROWS.map(
          ({ digest, label }, index) => `
            <li class="lgx-hero-ledger-row">
              <span class="lgx-hero-ledger-index">${String(index + 1).padStart(2, "0")}</span>
              <span class="lgx-hero-ledger-label">${escapeHtml(label)}</span>
              <code class="lgx-hero-ledger-digest">${escapeHtml(digest)}</code>
            </li>`,
        ).join("")}
      </ol>
    </div>`;

  const removeHeroVerificationLedger = () => {
    document.getElementById("lugano-proof-ledger")?.remove();
  };

  const ensureHeroVerificationLedger = (hero) => {
    let ledger = document.getElementById("lugano-proof-ledger");

    if (!ledger) {
      ledger = document.createElement("section");
      ledger.id = "lugano-proof-ledger";
      ledger.className = "lgx-hero-verification-ledger";
      ledger.setAttribute("aria-labelledby", "lugano-proof-ledger-heading");
      ledger.innerHTML = heroVerificationLedgerMarkup();
    }

    if (hero.nextElementSibling !== ledger) {
      hero.insertAdjacentElement("afterend", ledger);
    }

    return ledger;
  };

  const stopAndRemoveHeroVideo = (artStage) => {
    artStage.querySelectorAll("video").forEach((video) => {
      video.pause();
      video.removeAttribute("src");
      video.querySelectorAll("source").forEach((source) => source.removeAttribute("src"));
      video.load();
    });
  };

  const ensureHeroArt = (hero) => {
    const artStage = hero.querySelector(":scope > .absolute");

    if (!artStage) {
      return null;
    }

    artStage.classList.add("lgx-hero-art-stage");
    artStage.setAttribute("aria-hidden", "true");

    if (artStage.querySelector(".lgx-hero-art")) {
      return artStage;
    }

    stopAndRemoveHeroVideo(artStage);

    const picture = document.createElement("picture");
    picture.className = "lgx-hero-art-picture";
    picture.innerHTML = `
      <source media="(max-width: 760px)" srcset="${HERO_ART_MOBILE_SRC}" />
      <img
        class="lgx-hero-art"
        src="${HERO_ART_DESKTOP_SRC}"
        alt=""
        decoding="async"
        fetchpriority="high"
      />`;

    artStage.replaceChildren(picture);
    return artStage;
  };

  const ensureHeroCaption = (heroContent) => {
    let caption = heroContent.querySelector(":scope > [data-lugano-hero-caption='true']");

    if (caption) {
      return caption;
    }

    caption = document.createElement("div");
    caption.className = "lgx-hero-caption";
    caption.dataset.luganoHeroCaption = "true";
    caption.innerHTML = `
      <span class="lgx-hero-location">Lugano, Switzerland</span>
      <span class="lgx-hero-caption-rule" aria-hidden="true"></span>
      <button class="lgx-hero-motion-toggle" type="button" aria-pressed="false">
        Pause landscape animation
      </button>`;
    heroContent.appendChild(caption);
    return caption;
  };

  const updateHeroTypography = (hero) => {
    const eyebrow = hero.querySelector(".bracket-label");
    const heading = hero.querySelector("h1");

    if (eyebrow && eyebrow.textContent.trim() !== "PRIVATE AI INFRASTRUCTURE") {
      eyebrow.textContent = "PRIVATE AI INFRASTRUCTURE";
    }

    if (!heading || heading.dataset.lgxHeroHeading === "full-proof") {
      return;
    }

    const headingLine = document.createElement("span");
    headingLine.className = "lgx-hero-heading-line";
    headingLine.textContent = "AI Privacy by ";

    const proofLine = document.createElement("span");
    proofLine.className = "lgx-hero-proof-line";

    const trust = document.createElement("del");
    trust.className = "lgx-trust-crossed";
    trust.textContent = "trust me bro";
    const proof = document.createElement("em");
    proof.textContent = "proof.";
    proofLine.append(trust, document.createTextNode(" "), proof);
    heading.replaceChildren(headingLine, proofLine);
    heading.dataset.lgxHeroHeading = "full-proof";
  };

  const clearHeroWater = (state) => {
    state.context.clearRect(0, 0, state.width, state.height);
  };

  const resizeHeroWater = (state) => {
    const rect = state.stage.getBoundingClientRect();
    const width = Math.max(1, Math.round(rect.width));
    const height = Math.max(1, Math.round(rect.height));
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);

    if (
      state.width === width &&
      state.height === height &&
      state.pixelRatio === pixelRatio
    ) {
      return;
    }

    state.width = width;
    state.height = height;
    state.pixelRatio = pixelRatio;
    state.canvas.width = width * pixelRatio;
    state.canvas.height = height * pixelRatio;
    state.canvas.style.width = `${width}px`;
    state.canvas.style.height = `${height}px`;
    state.context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  };

  const drawHeroWater = (state, timestamp) => {
    const { image, context, height, width } = state;

    if (!image.complete || !image.naturalWidth || !width || !height) {
      return;
    }

    clearHeroWater(state);

    const lakeTop = Math.round(height * HERO_WATER_START);
    const lakeBottom = Math.round(height * HERO_WATER_END);
    const sliceHeight = Math.max(4, Math.ceil((lakeBottom - lakeTop) / 17));
    const waveTime = timestamp * 0.0011;

    context.save();
    context.globalAlpha = 0.12;

    for (let y = lakeTop, index = 0; y < lakeBottom; y += sliceHeight, index += 1) {
      const offset =
        Math.sin(waveTime + index * 0.78) * 2.35 + Math.sin(waveTime * 0.54 + index) * 1.1;

      context.save();
      context.beginPath();
      context.rect(0, y, width, Math.min(sliceHeight + 1, lakeBottom - y));
      context.clip();
      context.drawImage(image, offset, 0, width, height);
      context.restore();
    }

    context.restore();
  };

  const destroyHeroDepth = () => {
    heroDepthController?.destroy();
    heroDepthController = null;
  };

  const ensureHeroDepth = (hero, artStage, caption) => {
    if (heroDepthController?.hero === hero && heroDepthController.stage === artStage) {
      return;
    }

    destroyHeroDepth();

    const image = artStage.querySelector(".lgx-hero-art");
    const motionToggle = caption?.querySelector(".lgx-hero-motion-toggle");
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d", { alpha: true });

    if (
      !image ||
      !context ||
      typeof ResizeObserver !== "function" ||
      typeof IntersectionObserver !== "function"
    ) {
      motionToggle?.remove();
      return;
    }

    canvas.className = "lgx-hero-water";
    canvas.setAttribute("aria-hidden", "true");
    artStage.appendChild(canvas);

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const state = {
      active: false,
      canvas,
      caption,
      context,
      hero,
      image,
      manualMotionOptIn: false,
      motionToggle,
      pixelRatio: 0,
      raf: 0,
      reducedMotion,
      stage: artStage,
      userPaused: reducedMotion.matches,
      visible: true,
      width: 0,
      height: 0,
    };

    const stop = () => {
      state.active = false;

      if (state.raf) {
        window.cancelAnimationFrame(state.raf);
        state.raf = 0;
      }

      clearHeroWater(state);
    };

    const run = (timestamp) => {
      if (!state.active) {
        return;
      }

      drawHeroWater(state, timestamp);
      state.raf = window.requestAnimationFrame(run);
    };

    const start = () => {
      if (state.active) {
        return;
      }

      state.active = true;
      state.raf = window.requestAnimationFrame(run);
    };

    const resetParallax = () => {
      state.stage.style.setProperty("--lgx-hero-parallax-x", "0px");
      state.stage.style.setProperty("--lgx-hero-parallax-y", "0px");
    };

    const updateMotionToggle = () => {
      if (!state.motionToggle) {
        return;
      }

      const isPlaying = !state.userPaused;
      state.motionToggle.setAttribute("aria-pressed", String(isPlaying));
      state.motionToggle.textContent = isPlaying
        ? "Pause landscape animation"
        : "Play landscape animation";
    };

    const updateMotion = () => {
      const canAnimate =
        !state.userPaused &&
        (!state.reducedMotion.matches || state.manualMotionOptIn) &&
        state.visible &&
        !document.hidden &&
        state.image.complete &&
        state.image.naturalWidth > 0;

      if (canAnimate) {
        start();
      } else {
        stop();
        resetParallax();
      }
    };

    const onPointerMove = (event) => {
      if (
        state.userPaused ||
        (state.reducedMotion.matches && !state.manualMotionOptIn) ||
        event.pointerType === "touch"
      ) {
        return;
      }

      const rect = state.stage.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * HERO_PARALLAX_LIMIT * 2;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * HERO_PARALLAX_LIMIT * 1.25;
      state.stage.style.setProperty("--lgx-hero-parallax-x", `${x.toFixed(2)}px`);
      state.stage.style.setProperty("--lgx-hero-parallax-y", `${y.toFixed(2)}px`);
    };

    const onImageLoad = () => {
      resizeHeroWater(state);
      updateMotion();
    };

    const onToggle = () => {
      state.userPaused = !state.userPaused;
      state.manualMotionOptIn = state.reducedMotion.matches && !state.userPaused;
      if (state.manualMotionOptIn) {
        state.hero.dataset.lgxHeroMotion = "manual";
      } else {
        delete state.hero.dataset.lgxHeroMotion;
      }
      updateMotionToggle();
      updateMotion();
    };

    const resizeObserver = new ResizeObserver(() => {
      resizeHeroWater(state);
    });
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        state.visible = entry.isIntersecting;
        updateMotion();
      },
      { threshold: 0.01 },
    );
    const onVisibilityChange = () => updateMotion();
    const onMotionPreferenceChange = () => {
      if (state.reducedMotion.matches) {
        state.userPaused = true;
        state.manualMotionOptIn = false;
        delete state.hero.dataset.lgxHeroMotion;
      }

      updateMotionToggle();
      updateMotion();
    };

    resizeHeroWater(state);
    resizeObserver.observe(artStage);
    intersectionObserver.observe(artStage);
    image.addEventListener("load", onImageLoad);
    artStage.addEventListener("pointermove", onPointerMove, { passive: true });
    artStage.addEventListener("pointerleave", resetParallax, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);
    reducedMotion.addEventListener?.("change", onMotionPreferenceChange);
    reducedMotion.addListener?.(onMotionPreferenceChange);
    motionToggle?.addEventListener("click", onToggle);
    updateMotionToggle();
    updateMotion();

    state.destroy = () => {
      stop();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      image.removeEventListener("load", onImageLoad);
      artStage.removeEventListener("pointermove", onPointerMove);
      artStage.removeEventListener("pointerleave", resetParallax);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      reducedMotion.removeEventListener?.("change", onMotionPreferenceChange);
      reducedMotion.removeListener?.(onMotionPreferenceChange);
      motionToggle?.removeEventListener("click", onToggle);
      delete hero.dataset.lgxHeroMotion;
      resetParallax();
      canvas.remove();
    };

    heroDepthController = state;
  };

  const enhanceHeroProofLayout = () => {
    const hero = getHeroSection();
    const heroContent = hero?.querySelector(":scope > .relative.z-10");

    if (!hero || !heroContent) {
      destroyHeroDepth();
      removeHeroVerificationLedger();
      return;
    }

    const existingPanel = hero.querySelector("[data-lugano-proof-panel='static']");
    const proofButton = existingPanel ? null : getProofButton(hero);
    const proofCard = existingPanel || proofButton?.parentElement;
    const proofShell =
      hero.querySelector("[data-lugano-proof-shell='true']") ||
      (proofCard && getDirectHeroChildContaining(heroContent, proofCard));

    if (!proofCard || !proofShell) {
      return;
    }

    hero.classList.remove("lgx-hero-split");
    hero.classList.add("lgx-hero-editorial");
    hero.dataset.luganoHeroLayout = "engraved-proof";
    heroContent.dataset.luganoHeroContent = "engraved-proof";
    updateHeroTypography(hero);

    const artStage = ensureHeroArt(hero);

    let copyColumn = heroContent.querySelector(":scope > .lgx-hero-copy");
    let proofColumn = heroContent.querySelector(":scope > .lgx-hero-proof-column");

    if (!copyColumn || !proofColumn) {
      copyColumn = document.createElement("div");
      copyColumn.className = "lgx-hero-copy";
      proofColumn = document.createElement("div");
      proofColumn.className = "lgx-hero-proof-column";

      [...heroContent.children].forEach((child) => {
        if (child === proofShell) {
          proofColumn.appendChild(child);
          return;
        }

        copyColumn.appendChild(child);
      });

      heroContent.append(copyColumn, proofColumn);
    }

    if (proofColumn.parentElement !== heroContent) {
      heroContent.appendChild(proofColumn);
    }

    ensureHeroVerificationLedger(hero);

    proofColumn.classList.remove("lgx-hero-proof-shell");
    proofShell.dataset.luganoProofShell = "true";
    proofShell.classList.add("lgx-hero-proof-shell");
    proofCard.classList.add("lgx-hero-proof-card");
    proofCard.dataset.luganoProofPanel = "static";

    if (proofCard.dataset.lgxStaticProofReady !== "true") {
      proofCard.dataset.lgxStaticProofReady = "true";
      proofCard.innerHTML = staticProofPanelMarkup();
      delete proofCard.dataset.lgxCipherReady;
      proofCard.classList.remove("lgx-cipher-ready");
    }

    const caption = ensureHeroCaption(heroContent);

    if (artStage) {
      ensureHeroDepth(hero, artStage, caption);
    }
  };

  const bindHeroRouteLifecycle = () => {
    if (document.documentElement.dataset.lgxHeroRouteLifecycleBound === "true") {
      return;
    }

    document.documentElement.dataset.lgxHeroRouteLifecycleBound = "true";

    const refreshHero = () => {
      destroyHeroDepth();
      cancelApplyScrollReset();

      if (heroRouteFrame) {
        window.cancelAnimationFrame(heroRouteFrame);
      }

      if (isApplyRoute()) {
        scheduleEnhancements();
        return;
      }

      applyScrollRoute = "";

      heroRouteFrame = window.requestAnimationFrame(() => {
        heroRouteFrame = 0;

        const restoreHomeSections = (attempt = 0) => {
          if (!shouldMount()) {
            scheduleEnhancements();
            return;
          }

          if (mount() || attempt >= MAX_MOUNT_ATTEMPTS) {
            scheduleEnhancements();
            return;
          }

          window.requestAnimationFrame(() => restoreHomeSections(attempt + 1));
        };

        restoreHomeSections();
      });
    };

    window.addEventListener("hashchange", refreshHero);
    window.addEventListener("popstate", refreshHero);

    if (isApplyRoute()) {
      scheduleEnhancements();
    }
  };

  const updateArchitectureModelCopy = () => {
    const architectureUpdates = [
      {
        titles: ["Trustless by design."],
        title: "Trustless by design.",
        description:
          "You don't have to trust us. Everything is verifiable. No data leaked during inference, not during orchestration, no logging. The architecture makes exfiltration impossible.",
      },
      {
        titles: ["Uncompromised intelligence.", "Every AI model."],
        title: "Sovereignty by default.",
        description:
          "Run in your cloud, on-prem, or restricted environments without surrendering the control boundary.",
      },
      {
        titles: ["Unilateral control.", "Verify Everything."],
        title: "Verify Everything.",
        description:
          "Every protected run emits attestation, key release, sealed execution, and receipt records.",
      },
    ];

    const headings = [...document.querySelectorAll("#architecture .prop-card h3")];

    architectureUpdates.forEach((update) => {
      const targetHeading = headings.find((heading) =>
        update.titles.includes(heading.textContent.trim()),
      );

      if (!targetHeading) {
        return;
      }

      const card = targetHeading.closest(".prop-card");
      const description = card?.querySelector("p");

      if (targetHeading.textContent.trim() !== update.title) {
        targetHeading.textContent = update.title;
      }

      if (description && description.textContent.trim() !== update.description) {
        description.textContent = update.description;
      }
    });
  };

  const fixReceiptJson = () => {
    document.querySelectorAll("#architecture .attestation-receipt").forEach((receipt) => {
      const lines = [...receipt.querySelectorAll(".receipt-line")];
      const hashLine = lines.find((line) => line.textContent.includes('"hash"'));
      const statusLine = lines.find((line) => line.textContent.includes('"status"'));

      if (hashLine && hashLine.dataset.lgxReceiptJsonFixed !== "true") {
        hashLine.innerHTML = '&nbsp;"hash": "<span class="hash-value">a3f7e2c8b19d...9c41</span>",';
        hashLine.dataset.lgxReceiptJsonFixed = "true";
      }

      if (statusLine && statusLine.dataset.lgxReceiptJsonFixed !== "true") {
        statusLine.innerHTML = '&nbsp;"status": "<span style="color: #4EC9A0;">VERIFIED</span>"<span>}</span>';
        statusLine.dataset.lgxReceiptJsonFixed = "true";
      }
    });
  };

  const updatePlatformStepCopy = () => {
    document.querySelectorAll("#platform .feature-card").forEach((card) => {
      const number = [...card.querySelectorAll("span")]
        .map((span) => span.textContent.trim())
        .find((value) => value.startsWith("/"));
      const update = number ? PLATFORM_STEP_UPDATES[number] : null;

      if (!update) {
        return;
      }

      const heading = card.querySelector("h4");
      const description = card.querySelector("p");

      if (heading && heading.textContent.trim() !== update.title) {
        heading.textContent = update.title;
      }

      if (description && description.textContent.trim() !== update.description) {
        description.textContent = update.description;
      }
    });
  };

  const updateStaticTextCopy = () => {
    document.querySelectorAll("#root *").forEach((element) => {
      const directText = element.textContent.trim();
      const replacement = TEXT_UPDATES[directText];

      if (replacement && element.children.length === 0) {
        element.textContent = replacement;
      }
    });
  };

  const updateHeroStatCards = () => {
    document.querySelectorAll("#root .stat-glass-card").forEach((card, index) => {
      const update = HERO_STAT_CARD_UPDATES[index];

      if (!update) {
        return;
      }

      const textElements = [...card.querySelectorAll(":scope > div")].filter(
        (element) => element.textContent.trim() && !element.querySelector("[role='img']"),
      );
      const [valueElement, labelElement] = textElements.slice(-2);

      if (valueElement && valueElement.textContent.trim() !== update.value) {
        valueElement.textContent = update.value;
      }

      if (labelElement && labelElement.textContent.trim() !== update.label) {
        labelElement.textContent = update.label;
      }
    });
  };

  const updateBaseUseCaseCopy = () => {
    document.querySelectorAll("#root .use-case-card").forEach((card) => {
      const heading = card.querySelector("h3");
      const currentTitle = heading?.textContent.trim();
      const update = currentTitle ? BASE_USE_CASE_UPDATES[currentTitle] : null;

      if (!update || !heading) {
        return;
      }

      const paragraphs = card.querySelectorAll("p");

      heading.textContent = update.title;

      if (paragraphs[0]) {
        paragraphs[0].textContent = update.subtitle;
      }

      if (paragraphs[1]) {
        paragraphs[1].textContent = update.body;
      }
    });
  };

  const updateCloseCopy = () => {
    const ctaSection = document.getElementById("cta");
    const description = ctaSection?.querySelector(".lgx-live-heading p");
    const action = ctaSection?.querySelector(".lgx-live-heading a");

    if (description) {
      const copy =
        "Lugano.ai is the verification layer for private AI. Frontier AI with cryptographic privacy. No trust required.";

      if (description.textContent.trim() !== copy) {
        description.textContent = copy;
      }
    }

    if (action && action.textContent.trim() !== CTA_LABEL_TEXT) {
      action.textContent = CTA_LABEL_TEXT;
    }
  };

  const resizeCipherCanvas = (state) => {
    const rect = state.card.getBoundingClientRect();
    const width = Math.max(1, Math.ceil(rect.width));
    const height = Math.max(1, Math.ceil(rect.height));
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

    if (
      state.width === width &&
      state.height === height &&
      state.pixelRatio === pixelRatio
    ) {
      return;
    }

    state.width = width;
    state.height = height;
    state.pixelRatio = pixelRatio;
    state.columns = Math.ceil(width / CIPHER_CELL_WIDTH);
    state.rows = Math.ceil(height / CIPHER_CELL_HEIGHT);
    state.canvas.width = width * pixelRatio;
    state.canvas.height = height * pixelRatio;
    state.canvas.style.width = `${width}px`;
    state.canvas.style.height = `${height}px`;
    state.context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    state.grid = createCipherGrid(state.columns, state.rows);
  };

  const drawCipherCanvas = (state, timestamp = performance.now()) => {
    resizeCipherCanvas(state);
    state.context.clearRect(0, 0, state.width, state.height);
    state.context.font = `${CIPHER_FONT_SIZE}px "JetBrains Mono", monospace`;
    state.context.textBaseline = "top";

    for (let rowIndex = 0; rowIndex < state.rows; rowIndex += 1) {
      for (let columnIndex = 0; columnIndex < state.columns; columnIndex += 1) {
        const cell = state.grid[rowIndex][columnIndex];

        if (timestamp > cell.nextUpdate) {
          cell.character = randomCipherCharacter();
          cell.flashUntil = timestamp + CIPHER_FLASH_DURATION;
          cell.nextUpdate =
            timestamp + CIPHER_UPDATE_MIN + Math.random() * CIPHER_UPDATE_RANGE;
        }

        const flashProgress = Math.max(0, (cell.flashUntil - timestamp) / CIPHER_FLASH_DURATION);
        const alpha = 0.06 + flashProgress * 0.16;

        state.context.fillStyle = `rgba(155, 213, 244, ${alpha})`;
        state.context.fillText(
          cell.character,
          columnIndex * CIPHER_CELL_WIDTH,
          rowIndex * CIPHER_CELL_HEIGHT + 1,
        );
      }
    }
  };

  const stopCipherAnimation = (state) => {
    state.active = false;

    if (state.animationFrame) {
      window.cancelAnimationFrame(state.animationFrame);
      state.animationFrame = 0;
    }
  };

  const startCipherAnimation = (state) => {
    if (state.active) {
      return;
    }

    state.active = true;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      drawCipherCanvas(state);
      return;
    }

    const loop = (timestamp) => {
      if (!state.active) {
        return;
      }

      drawCipherCanvas(state, timestamp);
      state.animationFrame = window.requestAnimationFrame(loop);
    };

    state.animationFrame = window.requestAnimationFrame(loop);
  };

  const createCipherState = (card) => {
    card.dataset.lgxCipherReady = "true";

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (!context) {
      return null;
    }

    canvas.className = "lgx-card-cipher-canvas";
    canvas.setAttribute("aria-hidden", "true");
    card.prepend(canvas);

    return {
      active: false,
      animationFrame: 0,
      canvas,
      card,
      columns: 0,
      context,
      grid: [],
      height: 0,
      pixelRatio: 0,
      rows: 0,
      width: 0,
    };
  };

  const enhanceCardCipherHover = () => {
    document.querySelectorAll(CARD_SELECTOR).forEach((card) => {
      if (card.dataset.lgxCipherReady === "true") {
        return;
      }

      const state = createCipherState(card);

      if (!state) {
        return;
      }

      card.classList.add("lgx-cipher-ready");
      window.requestAnimationFrame(() => drawCipherCanvas(state));
      card.addEventListener("mouseenter", () => startCipherAnimation(state));
      card.addEventListener("mouseleave", () => stopCipherAnimation(state));
      card.addEventListener("focusin", () => startCipherAnimation(state));
      card.addEventListener("focusout", () => stopCipherAnimation(state));
    });
  };

  const runEnhancements = () => {
    updateCtas();
    updateApplyWebsiteField();
    updateUseCasesNav();
    updateDocsNav();
    normalizeHeaderNavOrder();
    bindHeaderNavClickCapture();
    bindLogoHomeNav();
    updateFooterDocsLink();
    normalizeBrandMarkAssets();
    normalizeLiveHeadings();
    ensureWhyNowStrip();
    enhancePrivacyPositioning();
    ensurePrivacyLevelsSection();
    removeWhatWeDoDuplicateCallout();
    ensurePlatformOrder();
    normalizeSectionBackgrounds();
    updateHeroLeadCopy();
    enhanceHeroProofLayout();
    updatePlatformHeadingCopy();
    updateArchitectureModelCopy();
    fixReceiptJson();
    updatePlatformStepCopy();
    updateHeroStatCards();
    updateStaticTextCopy();
    updateBaseUseCaseCopy();
    updateCloseCopy();
    enhanceCardCipherHover();
  };

  const scheduleEnhancements = () => {
    syncApplyScrollReset();

    if (enhancementFrame) {
      return;
    }

    enhancementFrame = window.requestAnimationFrame(() => {
      enhancementFrame = 0;
      runEnhancements();
    });
  };

  const mount = () => {
    runEnhancements();

    if (!shouldMount() || document.getElementById(ROOT_ID)) {
      return true;
    }

    const cta = document.getElementById("cta");
    const insertionPoint = cta;
    const parent = insertionPoint?.parentElement;

    if (!parent || !insertionPoint) {
      return false;
    }

    parent.insertBefore(buildSections(), insertionPoint);
    runEnhancements();

    const hashSectionId = getHashSectionId();

    if (hashSectionId) {
      window.requestAnimationFrame(() => scrollToSection(hashSectionId));
    }

    return true;
  };

  const start = () => {
    const root = document.getElementById("root");
    let attempts = 0;

    const tryMount = () => {
      if (mount() || attempts >= MAX_MOUNT_ATTEMPTS) {
        updateCtas();
        return;
      }

      attempts += 1;
      window.requestAnimationFrame(tryMount);
    };

    tryMount();
    bindHeroRouteLifecycle();

    if (root) {
      const observer = new MutationObserver(scheduleEnhancements);
      observer.observe(root, { childList: true, subtree: true });
    }

    scheduleEnhancements();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
