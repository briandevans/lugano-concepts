(() => {
  "use strict";

  if (window.__luganoHomepageRouter) {
    return;
  }

  window.__luganoHomepageRouter = true;

  const MARKETING_MODE = "marketing";
  const LEGACY_MODE = "legacy";
  const MODE_ATTRIBUTE = "data-homepage-mode";
  const MARKETING_SECTION_IDS = new Set([
    "top",
    "platform",
    "architecture",
    "privacy",
    "use-cases",
    "private-agents",
    "private-models",
    "cta",
  ]);

  const ASSETS = {
    [MARKETING_MODE]: {
      styles: [
        {
          id: "lugano-panorama-longbow-css",
          href: "/concepts/longbow/longbow.css?v=panorama-root-20260921-1",
        },
        {
          id: "lugano-panorama-verification-css",
          href: "/concepts/longbow/verification.css?v=panorama-root-20260921-1",
        },
        {
          id: "lugano-panorama-style-css",
          href: "/concepts/longbow/opening/panorama/style.css?v=hero-20260922-14",
        },
        {
          id: "lugano-panorama-map-css",
          href: "/concepts/longbow/opening/panorama/map.css?v=mobile-20260921-1",
        },
      ],
      scripts: [
        {
          id: "lugano-panorama-longbow-js",
          src: "/concepts/longbow/longbow.js?v=mobile-20260921-1",
        },
        {
          id: "lugano-panorama-map-js",
          src: "/concepts/longbow/opening/panorama/map.js?v=mobile-20260921-1",
        },
      ],
    },
    [LEGACY_MODE]: {
      styles: [
        {
          id: "lugano-legacy-app-css",
          href: "/assets/index-B5y9UYA8.css?v=legacy-waitlist-route-20260921-1",
        },
        {
          id: "lugano-legacy-homepage-sections-css",
          href: "/homepage-sections.css?v=legacy-waitlist-route-20260921-1",
        },
        {
          id: "lugano-legacy-design-system-css",
          href: "/lugano-design-system.css?v=legacy-waitlist-route-20260921-1",
        },
        {
          id: "lugano-legacy-waitlist-css",
          href: "/concepts/longbow/waitlist.css?v=legacy-waitlist-route-20260921-1",
        },
      ],
      scripts: [
        {
          id: "lugano-legacy-app-js",
          src: "/assets/index--1ut8_O7.js?v=legacy-waitlist-route-20260921-1",
          type: "module",
        },
        {
          id: "lugano-legacy-homepage-sections-js",
          src: "/homepage-sections.js?v=legacy-waitlist-route-20260921-2",
        },
      ],
    },
  };

  const normalizeMarketingSectionHash = () => {
    const match = window.location.hash.match(/^#\/\?section=([a-z0-9-]+)$/i);

    if (!match) {
      return "";
    }

    const sectionId = match[1].toLowerCase();

    if (!MARKETING_SECTION_IDS.has(sectionId)) {
      return "";
    }

    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${window.location.search}#${sectionId}`,
    );

    return sectionId;
  };

  const modeForHash = (hash = window.location.hash) =>
    /^#\/(?!$|\?)/.test(hash) ? LEGACY_MODE : MARKETING_MODE;

  const appendStylesheet = ({ id, href }) => {
    const existing = document.getElementById(id);

    if (existing) {
      return Promise.resolve(existing);
    }

    return new Promise((resolve) => {
      const stylesheet = document.createElement("link");
      stylesheet.id = id;
      stylesheet.rel = "stylesheet";
      stylesheet.href = href;
      stylesheet.addEventListener("load", () => resolve(stylesheet), { once: true });
      stylesheet.addEventListener("error", () => resolve(stylesheet), { once: true });
      document.head.append(stylesheet);
    });
  };

  const appendScript = ({ id, src, type }) => {
    const existing = document.getElementById(id);

    if (existing) {
      return Promise.resolve(existing);
    }

    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.id = id;
      script.src = src;
      script.async = false;

      if (type) {
        script.type = type;
      }

      script.addEventListener("load", () => resolve(script), { once: true });
      script.addEventListener("error", () => resolve(script), { once: true });
      document.body.append(script);
    });
  };

  const loadScriptsInOrder = (scripts) =>
    scripts.reduce((ready, script) => ready.then(() => appendScript(script)), Promise.resolve());

  const scrollToNormalizedSection = (sectionId) => {
    if (!sectionId) {
      return;
    }

    window.requestAnimationFrame(() => {
      document.getElementById(sectionId)?.scrollIntoView({ block: "start" });
    });
  };

  const normalizedSectionId = normalizeMarketingSectionHash();
  const currentMode = modeForHash();
  const stylesReady = Promise.all(ASSETS[currentMode].styles.map(appendStylesheet));

  document.documentElement.setAttribute(MODE_ATTRIBUTE, currentMode);

  const activateRoute = () => {
    const marketingRoot = document.getElementById("marketing-root");
    const appRoot = document.getElementById("root");

    if (!marketingRoot || !appRoot) {
      return;
    }

    if (currentMode === MARKETING_MODE) {
      document.body.classList.add("opening-panorama");
      marketingRoot.hidden = false;
      appRoot.hidden = true;
      stylesReady.then(() => loadScriptsInOrder(ASSETS[MARKETING_MODE].scripts));
      scrollToNormalizedSection(normalizedSectionId);
      return;
    }

    document.body.classList.remove("opening-panorama");
    marketingRoot.hidden = true;
    appRoot.hidden = true;
    stylesReady.then(() => {
      appRoot.hidden = false;
      return loadScriptsInOrder(ASSETS[LEGACY_MODE].scripts);
    });
  };

  window.addEventListener("hashchange", () => {
    const sectionId = normalizeMarketingSectionHash();
    const nextMode = modeForHash();

    if (nextMode !== currentMode) {
      window.location.reload();
      return;
    }

    scrollToNormalizedSection(sectionId);
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", activateRoute, { once: true });
  } else {
    activateRoute();
  }
})();
