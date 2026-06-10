(() => {
  const ROOT_ID = "lugano-extra-sections";
  const USE_CASES_SECTION_ID = "use-cases";
  const USE_CASES_HASH = "#/?section=use-cases";
  const MAX_MOUNT_ATTEMPTS = 180;
  const CARD_SELECTOR =
    "#root .feature-card, #root .comparison-card, #root .stat-glass-card, #lugano-extra-sections .lgx-card";
  const CIPHER_CHARS = "0123456789ABCDEF";
  const CIPHER_CELL_WIDTH = 7;
  const CIPHER_CELL_HEIGHT = 14;
  const CIPHER_FONT_SIZE = 11;
  const CIPHER_UPDATE_MIN = 1400;
  const CIPHER_UPDATE_RANGE = 1800;
  const CIPHER_FLASH_DURATION = 320;
  const CTA_LABELS = new Set([
    "apply for beta",
    "apply for access",
    "request access",
    "request briefing",
  ]);
  const HERO_PROOF_LABEL_ORDER = [
    "TDX quote verified",
    "GPU attestation verified",
    "ZK proof verified",
    "Formal proof checked",
    "Nonce binding verified",
    "Signing key bound",
    "Receipt verification",
    "Disclosure verification",
    "Payload integrity",
    "No prompt retention",
  ];
  const HERO_PROOF_REPLACEMENT_ROWS = [
    { label: "ZK proof verified", digest: "zk-v1" },
    { label: "Formal proof checked", digest: "constraints" },
    { label: "No prompt retention", digest: "0 retained" },
  ];
  const PLATFORM_STEP_UPDATES = {
    "/02": {
      title: "Privacy Routing",
      description:
        "Access controls, model permissions, and privacy boundaries are enforced at the protocol layer. Sensitive data stays inside the verified path, not behind a dashboard toggle.",
    },
    "/04": {
      title: "Attestation Record",
      description:
        "Each run returns verifiable privacy attestations across 30+ checks, covering execution state, routing, policy, receipt integrity, disclosure scope, and retention posture.",
    },
  };
  const TEXT_UPDATES = {
    AUDITABILITY: "VERIFICATION / AUDITABILITY",
    Auditability: "Verification / Auditability",
  };

  const useCases = [
    {
      title: "Enterprise",
      icon: "enterprise",
      image: "use-case-assets/enterprise-private-perimeter.webp",
      imageAlt: "A glass enterprise building inside a glowing private network perimeter",
      summary:
        "Deploy AI across operations. Prove your data posture.",
      bullets: [
        "Use frontier models across your organization without new exposure surfaces",
        "Protect IP, trade secrets, and sensitive workflows",
        "We handle everything for you. Verifiably private.",
      ],
    },
    {
      title: "Government and Defense",
      icon: "defense",
      image: "use-case-assets/government-defense-enclave.webp",
      imageAlt: "A hardened sovereign AI enclave surrounded by encrypted defense-grade circuitry",
      summary:
        "Sovereign AI, classified workloads, compliance-first infrastructure",
      bullets: [
        "Support classified, air-gapped, and disconnected deployments",
        "FedRAMP, IL5, CJIS, ITAR compliance paths",
        "Sovereign data residency, control, and mission reliability",
      ],
      featured: true,
    },
    {
      title: "Regulated Industries",
      icon: "regulated",
      image: "use-case-assets/regulated-audit-network.webp",
      imageAlt: "A regulated operations network with cryptographic audit paths and verification nodes",
      summary: "AI that satisfies auditors, not just product managers.",
      bullets: [
        "Satisfy auditors across finance, healthcare, legal, and government",
        "Infrastructure-level controls and cryptographic audit trails",
        "Verifiable records that prove what happened and what did not",
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
      title: "Custom Agents",
      emoji: "🤖",
      summary:
        "Bring your own agent stack and run it behind Lugano's encrypted execution boundary.",
      featured: true,
    },
  ];

  const models = [
    {
      title: "Kimi K2.6",
      maker: "Moonshot AI",
      logo: "brand-assets/kimi.ico",
      logoAlt: "Kimi logo",
      specs: "1T MoE / 262K context",
      benchmarks: [
        { label: "Best for", value: "All-round" },
        { label: "Tools", value: "Yes" },
        { label: "Vision", value: "Yes" },
      ],
      featured: true,
    },
    {
      title: "DeepSeek V4 Pro",
      maker: "DeepSeek",
      logo: "brand-assets/deepseek.ico",
      logoAlt: "DeepSeek logo",
      specs: "1.6T MoE / 49B active",
      benchmarks: [
        { label: "Best for", value: "Instruction" },
        { label: "Context", value: "1M" },
        { label: "Modes", value: "Dual" },
      ],
    },
    {
      title: "MiniMax M3",
      maker: "MiniMax",
      logo: "brand-assets/minimax.webp",
      logoAlt: "MiniMax logo",
      specs: "1M context / native multimodal",
      benchmarks: [
        { label: "Best for", value: "OS coding" },
        { label: "Browse", value: "83.5" },
        { label: "Deploy", value: "Open" },
      ],
    },
    {
      title: "GLM-5.1",
      maker: "Z.ai",
      logo: "brand-assets/zai.webp",
      logoAlt: "Z.ai logo",
      specs: "200K context / 128K output",
      benchmarks: [
        { label: "Best for", value: "Long tasks" },
        { label: "Horizon", value: "8h" },
        { label: "Tools", value: "MCP" },
      ],
    },
    {
      title: "MiMo-V2.5-Pro",
      maker: "Xiaomi",
      logo: "brand-assets/xiaomi.svg",
      logoAlt: "Xiaomi logo",
      specs: "MIT weights / 1M context",
      benchmarks: [
        { label: "Best for", value: "Harness" },
        { label: "ClawEval", value: "#1" },
        { label: "GDPVal", value: "#1" },
      ],
    },
    {
      title: "DeepSeek V4 Flash",
      maker: "DeepSeek",
      logo: "brand-assets/deepseek.ico",
      logoAlt: "DeepSeek logo",
      specs: "284B MoE / 13B active",
      benchmarks: [
        { label: "Best for", value: "Long + fast" },
        { label: "Context", value: "1M" },
        { label: "Agent", value: "Near Pro" },
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
    </article>`;

  const modelCardMarkup = (item) => `
    <article class="lgx-card lgx-model-card${item.featured ? " is-featured" : ""}">
      ${brandMarkMarkup(item, "lgx-icon-model")}
      <div class="lgx-model-copy">
        <h3>${escapeHtml(item.title)}</h3>
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
            <h2 id="use-cases-title">One product. Every environment.</h2>
          </div>
          <div class="lgx-vertical-grid">${useCases.map(verticalCardMarkup).join("")}</div>
        </div>
      </section>

      <section id="private-agents" class="lgx-section" aria-labelledby="agents-title">
        <div class="lgx-shell">
          <div class="lgx-centered-heading">
            <h2 id="agents-title">Make Your Agents Fully Private</h2>
            <p>Any agent framework. Any workflow. Zero data leakage.</p>
          </div>
          <div class="lgx-agent-grid">${agents.map(agentCardMarkup).join("")}</div>
        </div>
      </section>

      <section id="private-models" class="lgx-section" aria-labelledby="models-title">
        <div class="lgx-shell">
          <div class="lgx-centered-heading">
            <h2 id="models-title">Private Models Available</h2>
            <p>Run the world's best open-source models with zero data exposure</p>
          </div>
          <div class="lgx-model-grid">${models.map(modelCardMarkup).join("")}</div>
          <div class="lgx-model-note">Benchmarks shown from public Artificial Analysis, provider, and model-card data available on May 29, 2026.</div>
        </div>
      </section>`;

    return wrapper;
  };

  const isUseCasesHash = () => {
    const hash = window.location.hash.toLowerCase();

    if (hash === `#${USE_CASES_SECTION_ID}` || hash === USE_CASES_HASH) {
      return true;
    }

    if (!hash.startsWith("#/")) {
      return false;
    }

    const [, queryString = ""] = hash.split("?");
    return new URLSearchParams(queryString).get("section") === USE_CASES_SECTION_ID;
  };

  const shouldMount = () => {
    const hash = window.location.hash.toLowerCase();
    return (
      hash === "" ||
      hash === "#" ||
      hash === "#/" ||
      isUseCasesHash() ||
      hash.startsWith("#/?")
    );
  };

  const updateCtas = () => {
    document.querySelectorAll("a, button").forEach((element) => {
      const normalizedText = element.textContent.trim().replace(/\s+/g, " ").toLowerCase();

      if (CTA_LABELS.has(normalizedText)) {
        element.textContent = "Request a demo";
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
        section.classList.add(`lgx-live-${labelSlug}`);

        if (labelSlug === "who-it-s-for") {
          section.classList.add("lgx-section-hidden");
        }
      }
    });
  };

  const scrollToSection = (sectionId, shouldUpdateHash = false) => {
    const section = document.getElementById(sectionId);

    if (!section) {
      return;
    }

    const navOffset = document.querySelector("nav")?.getBoundingClientRect().height || 0;
    const top = section.getBoundingClientRect().top + window.scrollY - navOffset;
    window.scrollTo({ top, behavior: "smooth" });

    const targetHash =
      sectionId === USE_CASES_SECTION_ID ? USE_CASES_HASH : `#${sectionId}`;

    if (shouldUpdateHash && window.location.hash !== targetHash) {
      window.history.pushState(null, "", targetHash);
    }
  };

  const bindUseCasesNavItem = (item) => {
    if (item.dataset.lgxUseCasesBound === "true") {
      return;
    }

    item.dataset.lgxUseCasesBound = "true";
    item.addEventListener("click", (event) => {
      event.preventDefault();
      scrollToSection(USE_CASES_SECTION_ID, true);

      const visibleMobileMenu = [...document.querySelectorAll("nav div")].find((element) => {
        const rect = element.getBoundingClientRect();
        return (
          element.textContent.includes("Use Cases") &&
          getComputedStyle(element).position === "fixed" &&
          rect.width > 0
        );
      });

      if (visibleMobileMenu) {
        [...document.querySelectorAll("nav button")]
          .find((button) => button.className.toString().includes("md:hidden"))
          ?.click();
      }
    });
  };

  const createUseCasesNavItem = (referenceItem) => {
    const item = document.createElement("a");
    item.href = USE_CASES_HASH;
    item.textContent = "Use Cases";
    item.className = referenceItem.className.toString();
    item.dataset.lgxUseCasesNav = "true";
    bindUseCasesNavItem(item);
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

    [...nav.querySelectorAll("[data-lgx-use-cases-nav='true']")].forEach(bindUseCasesNavItem);

    [...nav.querySelectorAll("div")].forEach((container) => {
      const children = [...container.children];
      const labels = children.map((child) =>
        child.textContent.trim().replace(/\s+/g, " ").toLowerCase(),
      );
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
      const labels = children.map((child) =>
        child.textContent.trim().replace(/\s+/g, " ").toLowerCase(),
      );
      const platformItemIndex = labels.indexOf("platform");

      if (platformItemIndex === -1 || labels.includes("docs")) {
        return;
      }

      const platformItem = children[platformItemIndex];
      container.insertBefore(createDocsNavItem(platformItem), platformItem.nextSibling);
    });
  };

  const updateFooterDocsLink = () => {
    document.querySelectorAll("footer").forEach((footer) => {
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

  const normalizeSectionBackgrounds = () => {
    const contentSections = [
      ...document.querySelectorAll("#root section, #lugano-extra-sections section"),
    ].filter(
      (section) =>
        section.querySelector("h2") && !section.classList.contains("lgx-section-hidden"),
    );

    contentSections.forEach((section, index) => {
      section.classList.toggle("lgx-gradient-band", index % 2 === 0);
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

  const getAttestationRows = (proofCard) =>
    [...proofCard.querySelectorAll(".flex.items-center.gap-3")]
      .filter((row) => row.tagName.toLowerCase() !== "button")
      .map((row) => {
        const spans = [...row.querySelectorAll("span")];
        const label = spans.at(-2)?.textContent.trim() || "";
        const digest = spans.at(-1)?.textContent.trim() || "";

        return { digest, label };
      })
      .filter(({ digest, label }) => Boolean(label) && Boolean(digest));

  const getDisplayedAttestationRows = (rows) => {
    const rowByLabel = new Map(
      [...rows, ...HERO_PROOF_REPLACEMENT_ROWS].map((row) => [row.label, row]),
    );

    return HERO_PROOF_LABEL_ORDER.map((label) => rowByLabel.get(label)).filter(Boolean);
  };

  const proofCheckMarkup = () => `
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M3.25 8.35 6.35 11.4 12.85 4.6" />
    </svg>`;

  const staticProofPanelMarkup = (rows) => `
    <div class="lgx-proof-panel-inner">
      <div class="lgx-proof-panel-top">
        <span class="lgx-proof-status">
          <span class="lgx-proof-status-dot" aria-hidden="true"></span>
          Verified Private AI
        </span>
        <span class="lgx-proof-count">${rows.length}+ checks</span>
      </div>
      <div class="lgx-proof-ledger">
        ${rows
          .map(
            ({ digest, label }) => `
              <div class="lgx-proof-row" data-lugano-attestation-row>
                <span class="lgx-proof-check">${proofCheckMarkup()}</span>
                <span class="lgx-proof-label">${escapeHtml(label)}</span>
                <code class="lgx-proof-digest">${escapeHtml(digest)}</code>
              </div>`,
          )
          .join("")}
      </div>
    </div>`;

  const enhanceHeroProofLayout = () => {
    const hero = getHeroSection();
    const heroContent = hero?.querySelector(":scope > .relative.z-10");

    if (!hero || !heroContent) {
      return;
    }

    const existingPanel = hero.querySelector("[data-lugano-proof-panel='static']");
    const proofButton = existingPanel ? null : getProofButton(hero);
    const proofCard = existingPanel || proofButton?.parentElement;
    const proofShell =
      proofCard && getDirectHeroChildContaining(heroContent, proofCard);

    if (!proofCard || !proofShell) {
      return;
    }

    hero.classList.add("lgx-hero-split");
    hero.dataset.luganoHeroLayout = "split-proof";
    heroContent.dataset.luganoHeroContent = "split-proof";

    const trustSpan = [...hero.querySelectorAll("h1 span")].find(
      (span) => span.textContent.trim().toLowerCase() === "trust me bro",
    );

    if (trustSpan) {
      trustSpan.classList.add("lgx-trust-crossed");
      trustSpan.style.textDecoration = "none";
    }

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

    proofShell.classList.add("lgx-hero-proof-shell");
    proofCard.classList.add("lgx-hero-proof-card");
    proofCard.dataset.luganoProofPanel = "static";

    if (proofCard.dataset.lgxStaticProofReady === "true") {
      return;
    }

    const rows = getDisplayedAttestationRows(getAttestationRows(proofCard));

    if (rows.length === 0) {
      return;
    }

    proofCard.dataset.lgxStaticProofReady = "true";
    proofCard.innerHTML = staticProofPanelMarkup(rows);
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
        title: "Every AI model.",
        description:
          "Kimi K2.6, DeepSeek V4 Pro, MiniMax M3, GLM-5.1, MiMo-V2.5-Pro, DeepSeek V4 Flash, and many more.",
      },
      {
        titles: ["Unilateral control.", "Verify Everything."],
        title: "Verify Everything.",
        description:
          "We are the most robust solution for privacy attestation. Verify anything and everything. Full mathematical verifications.",
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

      card.dataset.lgxCipherReady = "true";
      card.classList.add("lgx-cipher-ready");
      drawCipherCanvas(state);
      card.addEventListener("mouseenter", () => startCipherAnimation(state));
      card.addEventListener("mouseleave", () => stopCipherAnimation(state));
      card.addEventListener("focusin", () => startCipherAnimation(state));
      card.addEventListener("focusout", () => stopCipherAnimation(state));
    });
  };

  const mount = () => {
    updateCtas();
    updateApplyWebsiteField();
    updateUseCasesNav();
    updateDocsNav();
    updateFooterDocsLink();
    enhanceCardCipherHover();
    normalizeLiveHeadings();
    normalizeSectionBackgrounds();
    updateHeroLeadCopy();
    enhanceHeroProofLayout();
    updateArchitectureModelCopy();
    updatePlatformStepCopy();
    updateStaticTextCopy();

    if (!shouldMount() || document.getElementById(ROOT_ID)) {
      return true;
    }

    const platform = document.getElementById("platform");
    const cta = document.getElementById("cta");
    const insertionPoint = platform || cta;
    const parent = insertionPoint?.parentElement;

    if (!parent || !insertionPoint) {
      return false;
    }

    parent.insertBefore(buildSections(), insertionPoint);
    updateCtas();
    updateApplyWebsiteField();
    updateUseCasesNav();
    updateDocsNav();
    updateFooterDocsLink();
    enhanceCardCipherHover();
    normalizeLiveHeadings();
    normalizeSectionBackgrounds();
    updateHeroLeadCopy();
    enhanceHeroProofLayout();
    updateArchitectureModelCopy();
    updatePlatformStepCopy();
    updateStaticTextCopy();

    if (isUseCasesHash()) {
      window.requestAnimationFrame(() => scrollToSection(USE_CASES_SECTION_ID));
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

    if (root) {
      const observer = new MutationObserver(() => {
        updateCtas();
        updateApplyWebsiteField();
        updateUseCasesNav();
        updateDocsNav();
        updateFooterDocsLink();
        enhanceCardCipherHover();
        normalizeLiveHeadings();
        normalizeSectionBackgrounds();
        updateHeroLeadCopy();
        enhanceHeroProofLayout();
        updateArchitectureModelCopy();
        updatePlatformStepCopy();
        updateStaticTextCopy();

        if (mount()) {
          updateCtas();
          updateApplyWebsiteField();
          updateUseCasesNav();
          updateDocsNav();
          updateFooterDocsLink();
          enhanceCardCipherHover();
          normalizeLiveHeadings();
          normalizeSectionBackgrounds();
          updateHeroLeadCopy();
          enhanceHeroProofLayout();
          updateArchitectureModelCopy();
          updatePlatformStepCopy();
          updateStaticTextCopy();
        }
      });
      observer.observe(root, { childList: true, subtree: true });
    }

    updateCtas();
    updateApplyWebsiteField();
    updateUseCasesNav();
    updateDocsNav();
    updateFooterDocsLink();
    enhanceCardCipherHover();
    normalizeLiveHeadings();
    normalizeSectionBackgrounds();
    updateHeroLeadCopy();
    enhanceHeroProofLayout();
    updateArchitectureModelCopy();
    updatePlatformStepCopy();
    updateStaticTextCopy();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
