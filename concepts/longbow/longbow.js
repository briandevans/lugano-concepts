(() => {
  const toggle = document.querySelector(".menu-toggle");
  const menu = document.querySelector("#mobile-nav");

  if (toggle && menu) {
    const closeMenu = () => {
      menu.hidden = true;
      toggle.setAttribute("aria-expanded", "false");
    };
    const desktopQuery = window.matchMedia("(min-width: 761px)");

    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") === "true";
      menu.hidden = open;
      toggle.setAttribute("aria-expanded", String(!open));
    });
    menu.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
    desktopQuery.addEventListener("change", (event) => {
      if (event.matches) closeMenu();
    });
  }

  const CIPHER_TARGET_SELECTOR = [
    ".feature-rows > article",
    ".comparison-grid > .comparison",
    ".agent-grid > .agent-card",
    ".model-grid > .model-card",
  ].join(", ");
  const CIPHER_CHARS = "0123456789ABCDEF";
  const CIPHER_CELL_WIDTH = 7;
  const CIPHER_CELL_HEIGHT = 14;
  const CIPHER_FONT_SIZE = 11;
  const CIPHER_UPDATE_MIN = 1400;
  const CIPHER_UPDATE_RANGE = 1800;
  const CIPHER_FLASH_DURATION = 320;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const cipherStates = [];

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

        const flashProgress = Math.max(
          0,
          (cell.flashUntil - timestamp) / CIPHER_FLASH_DURATION,
        );
        const alpha = 0.10 + flashProgress * 0.16;

        state.context.fillStyle = `rgba(164, 93, 63, ${alpha})`;
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
    state.card.classList.remove("longbow-cipher-active");

    if (state.animationFrame) {
      window.cancelAnimationFrame(state.animationFrame);
      state.animationFrame = 0;
    }
  };

  const startCipherAnimation = (state) => {
    if (state.active || document.hidden) {
      return;
    }

    state.active = true;
    state.card.classList.add("longbow-cipher-active");

    if (reducedMotion.matches) {
      drawCipherCanvas(state);
      return;
    }

    const loop = (timestamp) => {
      if (!state.active || document.hidden) {
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

    canvas.className = "longbow-cipher-canvas";
    canvas.setAttribute("aria-hidden", "true");
    card.classList.add("longbow-cipher-target");
    card.dataset.longbowCipherReady = "true";
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

  document.querySelectorAll(CIPHER_TARGET_SELECTOR).forEach((card) => {
    if (card.dataset.longbowCipherReady === "true") {
      return;
    }

    const state = createCipherState(card);

    if (!state) {
      return;
    }

    cipherStates.push(state);
    card.addEventListener("pointerenter", (event) => {
      if (event.pointerType !== "touch") {
        startCipherAnimation(state);
      }
    });
    card.addEventListener("pointerleave", (event) => {
      if (event.pointerType !== "touch") {
        stopCipherAnimation(state);
      }
    });
    card.addEventListener("focusin", () => startCipherAnimation(state));
    card.addEventListener("focusout", (event) => {
      if (!card.contains(event.relatedTarget)) {
        stopCipherAnimation(state);
      }
    });
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      cipherStates.forEach(stopCipherAnimation);
    }
  });

  reducedMotion.addEventListener("change", () => {
    if (reducedMotion.matches) {
      cipherStates.forEach((state) => {
        if (state.active) {
          if (state.animationFrame) {
            window.cancelAnimationFrame(state.animationFrame);
            state.animationFrame = 0;
          }
          drawCipherCanvas(state);
        }
      });
    }
  });
})();
