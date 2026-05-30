(() => {
  const ROOT_ID = "lugano-extra-sections";
  const USE_CASES_SECTION_ID = "use-cases";
  const USE_CASES_HASH = "#/?section=use-cases";
  const MAX_MOUNT_ATTEMPTS = 180;
  const CTA_LABELS = new Set([
    "apply for beta",
    "apply for access",
    "request access",
    "request briefing",
  ]);

  const useCases = [
    {
      title: "Enterprise",
      icon: "enterprise",
      summary:
        "Deploy AI across operations. Prove your data posture.",
      bullets: [
        "Use frontier models across your organization without new exposure surfaces",
        "Protect IP, trade secrets, and sensitive workflows",
        "Deploy on-prem, in your cloud, or in a dedicated environment",
      ],
    },
    {
      title: "Government and Defense",
      icon: "defense",
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
      logo: "brand-assets/nous-research.webp",
      logoAlt: "NousResearch logo",
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
      specs: "1T MoE / 32B active",
      benchmarks: [
        { label: "AA Index", value: "54" },
        { label: "GDPval Elo", value: "1520" },
        { label: "Context", value: "256K" },
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
        { label: "AA Index", value: "52" },
        { label: "Context", value: "1M" },
        { label: "Output", value: "30.5 t/s" },
      ],
    },
    {
      title: "GLM-5.1",
      maker: "Z.ai",
      logo: "brand-assets/zai.webp",
      logoAlt: "Z.ai logo",
      specs: "754B MoE / 40B active",
      benchmarks: [
        { label: "AA Index", value: "51" },
        { label: "SWE-Pro", value: "58.4" },
        { label: "Context", value: "200K" },
      ],
    },
    {
      title: "MiniMax M2.7",
      maker: "MiniMax",
      logo: "brand-assets/minimax.webp",
      logoAlt: "MiniMax logo",
      specs: "229.9B MoE / 9.8B active",
      benchmarks: [
        { label: "AA Index", value: "50" },
        { label: "SWE-Pro", value: "56.22" },
        { label: "Terminal", value: "57.0" },
      ],
    },
    {
      title: "Qwen3.6 35B A3B",
      maker: "Alibaba Cloud",
      logo: "brand-assets/qwen.webp",
      logoAlt: "Qwen logo",
      specs: "35B MoE / 3B active",
      benchmarks: [
        { label: "AA Index", value: "43" },
        { label: "Output", value: "179.3 t/s" },
        { label: "Context", value: "262K" },
      ],
    },
    {
      title: "MiMo-V2.5-Pro",
      maker: "Xiaomi",
      logo: "brand-assets/xiaomi.svg",
      logoAlt: "Xiaomi logo",
      specs: "1.02T MoE / 42B active",
      benchmarks: [
        { label: "AA Index", value: "54" },
        { label: "GDPVal-AA", value: "#1" },
        { label: "Context", value: "1M" },
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
      <div class="lgx-card-head">
        <div class="lgx-icon">${iconMarkup(item.icon)}</div>
        <h3>${escapeHtml(item.title)}</h3>
      </div>
      <p>${escapeHtml(item.summary)}</p>
      <ul>${listMarkup(item.bullets)}</ul>
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

  const mount = () => {
    updateCtas();
    updateUseCasesNav();
    normalizeLiveHeadings();
    normalizeSectionBackgrounds();

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
    updateUseCasesNav();
    normalizeLiveHeadings();
    normalizeSectionBackgrounds();

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
        updateUseCasesNav();
        normalizeLiveHeadings();
        normalizeSectionBackgrounds();

        if (mount()) {
          updateCtas();
          updateUseCasesNav();
          normalizeLiveHeadings();
          normalizeSectionBackgrounds();
        }
      });
      observer.observe(root, { childList: true, subtree: true });
    }

    updateCtas();
    updateUseCasesNav();
    normalizeLiveHeadings();
    normalizeSectionBackgrounds();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
