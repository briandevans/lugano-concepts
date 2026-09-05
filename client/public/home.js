(() => {
  document.documentElement.classList.add("js");

  const FORM_ENDPOINT =
    "https://docs.google.com/forms/d/e/1FAIpQLScOQbn8NOXU4xTJcljvGzqz95Ce6EuyK3q5mwCAs1-YEuu3mw/formResponse";
  const FORM_FIELDS = {
    contact: "entry.1512307509",
    email: "entry.164457883",
    context: "entry.113997196",
  };

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ----------------------------------------------------------------------
     Legacy hash routes from the previous single-page build
     ---------------------------------------------------------------------- */
  const redirectLegacyHash = () => {
    const hash = window.location.hash;

    if (!hash || hash === "#" || hash === "#/") {
      if (hash) {
        history.replaceState(null, "", window.location.pathname);
      }
      return;
    }

    const lower = hash.toLowerCase();
    let target = "";

    if (lower.startsWith("#/?")) {
      const section = new URLSearchParams(lower.slice(3)).get("section") || "";
      target = section === "use-cases" ? "#use-cases" : "";
    } else if (lower === "#/apply" || lower === "#cta") {
      target = "#briefing";
    } else if (lower === "#privacy") {
      target = "#proof";
    } else if (lower === "#private-models") {
      target = "#models";
    } else if (lower === "#private-agents") {
      target = "#use-cases";
    }

    if (target && document.querySelector(target)) {
      history.replaceState(null, "", target);
      document.querySelector(target).scrollIntoView();
    }
  };

  /* ----------------------------------------------------------------------
     Mobile navigation
     ---------------------------------------------------------------------- */
  const initNav = () => {
    const toggle = document.querySelector(".nav-toggle");
    const nav = document.getElementById("site-nav");

    if (!toggle || !nav) {
      return;
    }

    const close = () => {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    };

    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });

    nav.addEventListener("click", (event) => {
      if (event.target.closest("a")) {
        close();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        close();
      }
    });
  };

  /* ----------------------------------------------------------------------
     Reveal on scroll — entrances only
     ---------------------------------------------------------------------- */
  const initReveals = () => {
    const items = [...document.querySelectorAll(".reveal")];

    if (!("IntersectionObserver" in window) || reducedMotion.matches) {
      items.forEach((item) => item.classList.add("is-visible"));
      return;
    }

    const groups = new Map();

    items.forEach((item) => {
      const parent = item.parentElement;
      const index = groups.get(parent) || 0;
      groups.set(parent, index + 1);
      item.style.setProperty("--reveal-delay", `${Math.min(index * 90, 360)}ms`);
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.1 },
    );

    items.forEach((item) => observer.observe(item));
  };

  /* ----------------------------------------------------------------------
     Proof artifacts — slow row activation when sealed into view
     ---------------------------------------------------------------------- */
  const sealRows = (rows, stepMs) => {
    rows.forEach((row, index) => {
      window.setTimeout(() => row.classList.add("is-sealed"), index * stepMs);
    });
  };

  const initArtifact = (rootSelector, rowSelector, activeClass, stepMs) => {
    const root = document.querySelector(rootSelector);

    if (!root) {
      return;
    }

    const rows = [...root.querySelectorAll(rowSelector)];

    const activate = () => {
      root.classList.add(activeClass);

      if (reducedMotion.matches) {
        rows.forEach((row) => row.classList.add("is-sealed"));
        return;
      }

      sealRows(rows, stepMs);
    };

    if (!("IntersectionObserver" in window) || reducedMotion.matches) {
      activate();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            activate();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.45 },
    );

    observer.observe(root);
  };

  /* ----------------------------------------------------------------------
     Architecture diagram — connector draw on scroll
     ---------------------------------------------------------------------- */
  const initArchFlow = () => {
    const flow = document.getElementById("arch-flow");

    if (!flow) {
      return;
    }

    if (!("IntersectionObserver" in window) || reducedMotion.matches) {
      flow.classList.add("is-live");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            flow.classList.add("is-live");
            observer.disconnect();
          }
        });
      },
      { threshold: 0.3 },
    );

    observer.observe(flow);
  };

  /* ----------------------------------------------------------------------
     Sample receipt expander
     ---------------------------------------------------------------------- */
  const initReceiptToggle = () => {
    const toggle = document.getElementById("receipt-toggle");
    const panel = document.getElementById("receipt-sample");

    if (!toggle || !panel) {
      return;
    }

    toggle.addEventListener("click", () => {
      const expanded = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!expanded));
      panel.hidden = expanded;
      toggle.textContent = expanded ? "Inspect sample receipt" : "Hide sample receipt";
    });
  };

  /* ----------------------------------------------------------------------
     Briefing form — posts to the existing intake form endpoint
     ---------------------------------------------------------------------- */
  const initForm = () => {
    const form = document.getElementById("briefing-form");
    const success = document.getElementById("briefing-success");
    const error = document.getElementById("form-error");

    if (!form || !success) {
      return;
    }

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const value = (name) => form.elements[name].value.trim();
      const email = value("email");
      const company = value("company");
      const role = value("role");
      const usecase = form.elements.usecase.value;
      const website = value("website");
      const protect = value("protect");

      const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);

      if (!emailValid || !company || !role || !usecase) {
        if (error) {
          error.hidden = false;
        }
        const firstInvalid = !emailValid
          ? form.elements.email
          : !company
            ? form.elements.company
            : !role
              ? form.elements.role
              : form.elements.usecase;
        firstInvalid.focus();
        return;
      }

      if (error) {
        error.hidden = true;
      }

      const submitButton = form.querySelector(".btn-submit");
      submitButton.disabled = true;

      const payload = new URLSearchParams();
      payload.append(FORM_FIELDS.contact, `${company} — ${role}`);
      payload.append(FORM_FIELDS.email, email);
      payload.append(
        FORM_FIELDS.context,
        [usecase, website, protect].filter(Boolean).join(" | "),
      );

      try {
        await fetch(FORM_ENDPOINT, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: payload.toString(),
        });
      } catch {
        /* opaque endpoint — treat as delivered, matching previous behavior */
      }

      form.hidden = true;
      success.hidden = false;
      success.setAttribute("tabindex", "-1");
      success.focus();
    });
  };

  const start = () => {
    if (window.__luganoHomeStarted) {
      return;
    }
    window.__luganoHomeStarted = true;

    redirectLegacyHash();
    window.addEventListener("hashchange", redirectLegacyHash);
    initNav();
    initReveals();
    initArtifact("#proof-capsule", ".proof-row", "is-sealing", 380);
    initArtifact("#receipt-card", ".chain-item", "is-scanned", 380);
    initArchFlow();
    initReceiptToggle();
    initForm();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
