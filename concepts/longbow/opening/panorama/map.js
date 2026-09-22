(() => {
  "use strict";

  const interactiveQuery = window.matchMedia("(min-width: 1001px) and (hover: hover) and (pointer: fine)");
  let mounted = null;

  const text = (element) => element ? element.textContent.replace(/\s+/g, " ").trim() : "";
  const create = (tag, className, content) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (content !== undefined) element.textContent = content;
    return element;
  };

  const getSource = () => {
    const proof = document.querySelector(".panorama-proof");
    const recordNodes = proof ? [...proof.querySelectorAll(".specimen-folio__records article")] : [];
    const principleNodes = proof ? [...proof.querySelectorAll(".specimen-folio__principles article")] : [];
    const records = recordNodes
      .map((record) => ({ label: text(record.querySelector("strong")), hash: text(record.querySelector("code")) }))
      .filter((record) => record.label && record.hash);
    const principles = principleNodes
      .map((principle) => ({ label: text(principle.querySelector("p")), statement: text(principle.querySelector("h3")) }))
      .filter((principle) => principle.label && principle.statement);

    if (!proof || records.length !== 9 || principles.length !== 3) return null;

    return {
      proof,
      art: document.querySelector("#panorama-landscape"),
      masthead: {
        kicker: text(proof.querySelector(".specimen-folio__kicker")),
        title: text(proof.querySelector(".specimen-folio__title-block h2")),
        retained: [
          text(proof.querySelector(".specimen-folio__retention-stat strong")),
          text(proof.querySelector(".specimen-folio__retention-stat span"))
        ].filter(Boolean).join(" ")
      },
      declaration: {
        label: text(proof.querySelector(".specimen-folio__declaration > p:first-child")),
        statement: text(proof.querySelector(".specimen-folio__statement"))
      },
      records,
      principles
    };
  };

  const mount = () => {
    if (mounted || !interactiveQuery.matches) return;
    const source = getSource();
    if (!source?.art) return;

    const groups = [
      { id: "data-prompts", label: source.declaration.label, statement: source.declaration.statement, records: [4, 8], x: "18%", y: "66%", labelX: "42px", labelY: "-25px", labelTranslate: "0", leader: "35px", angle: "-28deg" },
      { id: "retention", label: source.principles[0].label, statement: source.principles[0].statement, records: [], metric: source.masthead.retained, x: "49%", y: "77%", labelX: "40px", labelY: "-25px", labelTranslate: "0", leader: "33px", angle: "-29deg" },
      { id: "every-request", label: source.principles[1].label, statement: source.principles[1].statement, records: [5, 6, 7], x: "69%", y: "64%", labelX: "-42px", labelY: "-27px", labelTranslate: "-100%", leader: "34px", angle: "-151deg" },
      { id: "threat-model", label: source.principles[2].label, statement: source.principles[2].statement, records: [0, 1, 2, 3], x: "78%", y: "91%", labelX: "-42px", labelY: "-27px", labelTranslate: "-100%", leader: "34px", angle: "-151deg" }
    ];

    if (groups.some((group) => !group.label || !group.statement || group.records.some((index) => !source.records[index]))) return;

    const map = create("section", "panorama-map panorama-map--paused");
    map.setAttribute("aria-label", "Interactive verification landscape");
    map.setAttribute("role", "region");

    const masthead = create("div", "panorama-map__masthead");
    const mastheadTitle = create("strong", "", source.masthead.title);
    const mastheadChecks = create("span", "", source.masthead.kicker);
    const mastheadRetained = create("span", "", source.masthead.retained);
    masthead.append(mastheadTitle, mastheadChecks, mastheadRetained);

    const panel = create("section", "panorama-map__panel");
    panel.id = "panorama-map-panel";
    panel.setAttribute("aria-live", "polite");
    panel.setAttribute("aria-atomic", "true");
    const panelCopy = create("div", "panorama-map__panel-copy");
    const title = create("h2", "panorama-map__title");
    title.id = "panorama-map-panel-title";
    const statement = create("p", "panorama-map__statement");
    const close = create("button", "panorama-map__close", "×");
    close.type = "button";
    close.hidden = true;
    close.setAttribute("aria-label", "Close verification detail");
    const recordList = create("ul", "panorama-map__records");
    recordList.hidden = true;
    const metric = create("p", "panorama-map__metric");
    metric.hidden = true;
    const instruction = create("p", "panorama-map__instruction", "Hover to explore · Click to pin");
    instruction.id = "panorama-map-instruction";
    instruction.setAttribute("aria-label", "Hover or focus a marker to explore. Select a marker to pin its details.");
    const sound = create("button", "panorama-map__sound", "Sound on");
    sound.type = "button";
    sound.setAttribute("aria-pressed", "true");
    sound.setAttribute("aria-label", "Sound on");
    panelCopy.append(title, statement);
    panel.append(panelCopy, close, recordList, metric, instruction, sound);
    map.append(masthead, panel);
    map.setAttribute("aria-describedby", instruction.id);

    const state = { activeId: null, pinnedId: null, lastTrigger: null, closeTimer: 0, soundEnabled: true, audioContext: null, pointerOnInteractive: false, suppressFocusFor: null };
    const markerButtons = new Map();
    const panelMargin = 18;
    const panelGap = 14;

    const renderPanel = (group) => {
      while (recordList.firstChild) recordList.removeChild(recordList.firstChild);
      if (!group) {
        title.textContent = "";
        statement.textContent = "";
        recordList.hidden = true;
        metric.hidden = true;
        close.hidden = true;
        return;
      }
      title.textContent = group.label;
      statement.textContent = group.statement;
      recordList.classList.toggle("panorama-map__records--compact", group.records.length > 3);
      group.records.forEach((index) => {
        const record = source.records[index];
        const item = create("li");
        item.append(create("strong", "", record.label), create("code", "", record.hash));
        recordList.append(item);
      });
      recordList.hidden = group.records.length === 0;
      metric.hidden = !group.metric;
      metric.textContent = group.metric || "";
      close.hidden = false;
    };

    const clearPanelPosition = () => {
      panel.style.removeProperty("--panel-left");
      panel.style.removeProperty("--panel-top");
      panel.style.removeProperty("--panel-caret-left");
    };

    const positionPanel = (group) => {
      const marker = markerButtons.get(group.id);
      const label = marker?.querySelector(".panorama-map__marker-label");
      if (!label) return;

      const mapRect = map.getBoundingClientRect();
      const labelRect = label.getBoundingClientRect();
      // Offset dimensions are stable while the entrance animation transforms the panel.
      const panelWidth = panel.offsetWidth;
      const panelHeight = panel.offsetHeight;
      if (!mapRect.width || !panelWidth || !panelHeight) return;

      const labelCenter = labelRect.left - mapRect.left + (labelRect.width / 2);
      const desiredLeft = labelCenter - (panelWidth / 2);
      const maxLeft = Math.max(panelMargin, mapRect.width - panelMargin - panelWidth);
      const left = Math.min(Math.max(desiredLeft, panelMargin), maxLeft);
      const top = Math.max(panelMargin, labelRect.top - mapRect.top - panelGap - panelHeight);

      panel.style.setProperty("--panel-left", `${left}px`);
      panel.style.setProperty("--panel-top", `${top}px`);
      panel.style.setProperty("--panel-caret-left", `${labelCenter - left}px`);
    };

    const repositionActivePanel = () => {
      if (!map.isConnected) return;
      const group = groups.find((candidate) => candidate.id === state.activeId);
      if (group) positionPanel(group);
    };

    const update = () => {
      const group = groups.find((candidate) => candidate.id === state.activeId) || null;
      markerButtons.forEach((button, id) => {
        button.setAttribute("aria-expanded", String(id === state.activeId));
        button.setAttribute("aria-pressed", String(id === state.pinnedId));
      });
      instruction.textContent = state.pinnedId ? "Pinned · Esc to close" : "Hover to explore · Click to pin";
      panel.dataset.state = group ? "active" : "idle";
      renderPanel(group);
      if (group) positionPanel(group);
      else clearPanelPosition();
    };

    const cancelClose = () => {
      if (state.closeTimer) window.clearTimeout(state.closeTimer);
      state.closeTimer = 0;
    };

    const scheduleClose = () => {
      cancelClose();
      if (state.pinnedId) return;
      state.closeTimer = window.setTimeout(() => {
        if (!state.pinnedId && !state.pointerOnInteractive && !map.contains(document.activeElement)) {
          state.activeId = null;
          update();
        }
      }, 550);
    };

    const closePanel = (restoreFocus) => {
      cancelClose();
      const trigger = state.lastTrigger || markerButtons.get(state.activeId);
      state.activeId = null;
      state.pinnedId = null;
      update();
      if (restoreFocus && trigger?.isConnected) {
        state.suppressFocusFor = trigger;
        trigger.focus();
        window.requestAnimationFrame(() => { state.suppressFocusFor = null; });
      }
    };

    const show = (id, trigger, overridePin = false) => {
      cancelClose();
      if (state.pinnedId && state.pinnedId !== id) {
        if (!overridePin) return;
        state.pinnedId = null;
      }
      state.activeId = id;
      if (trigger) state.lastTrigger = trigger;
      update();
    };

    const playTick = () => {
      if (!state.soundEnabled) return;
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      try {
        state.audioContext ||= new AudioContext();
        const context = state.audioContext;
        if (context.state === "suspended") context.resume().catch(() => {});
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        const now = context.currentTime;
        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(330, now);
        oscillator.frequency.exponentialRampToValueAtTime(180, now + .055);
        gain.gain.setValueAtTime(.0001, now);
        gain.gain.exponentialRampToValueAtTime(.022, now + .006);
        gain.gain.exponentialRampToValueAtTime(.0001, now + .07);
        oscillator.connect(gain).connect(context.destination);
        oscillator.start(now);
        oscillator.stop(now + .08);
        oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
      } catch (_) { /* Audio is optional. */ }
    };

    groups.forEach((group, index) => {
      const marker = create("button", "panorama-map__marker");
      marker.type = "button";
      marker.style.setProperty("--pulse-delay", `${index * -.65}s`);
      marker.style.setProperty("--marker-x", group.x);
      marker.style.setProperty("--marker-y", group.y);
      marker.style.setProperty("--label-x", group.labelX);
      marker.style.setProperty("--label-y", group.labelY);
      marker.style.setProperty("--label-translate-x", group.labelTranslate);
      marker.style.setProperty("--leader-length", group.leader);
      marker.style.setProperty("--leader-angle", group.angle);
      marker.setAttribute("aria-controls", panel.id);
      marker.setAttribute("aria-expanded", "false");
      marker.setAttribute("aria-label", `${group.label}: ${group.statement}`);
      marker.dataset.group = group.id;
      const leader = create("span", "panorama-map__marker-leader");
      leader.setAttribute("aria-hidden", "true");
      const label = create("span", "panorama-map__marker-label");
      label.setAttribute("aria-hidden", "true");
      label.append(document.createTextNode(group.label));
      marker.append(leader, label);
      marker.addEventListener("pointerenter", () => {
        state.pointerOnInteractive = true;
        show(group.id, marker);
      });
      marker.addEventListener("pointerleave", () => {
        state.pointerOnInteractive = false;
        scheduleClose();
      });
      marker.addEventListener("focus", () => {
        if (state.suppressFocusFor === marker) return;
        show(group.id, marker, true);
      });
      marker.addEventListener("click", () => {
        playTick();
        state.lastTrigger = marker;
        if (state.pinnedId === group.id) {
          closePanel(false);
          return;
        }
        state.pinnedId = group.id;
        state.activeId = group.id;
        update();
      });
      markerButtons.set(group.id, marker);
      map.append(marker);
    });

    close.addEventListener("click", () => closePanel(true));
    sound.addEventListener("click", () => {
      state.soundEnabled = !state.soundEnabled;
      sound.setAttribute("aria-pressed", String(state.soundEnabled));
      sound.textContent = state.soundEnabled ? "Sound on" : "Sound off";
      sound.setAttribute("aria-label", sound.textContent);
    });
    panel.addEventListener("pointerenter", () => {
      state.pointerOnInteractive = true;
      cancelClose();
    });
    panel.addEventListener("pointerleave", () => {
      state.pointerOnInteractive = false;
      scheduleClose();
    });
    map.addEventListener("focusout", () => window.setTimeout(scheduleClose, 0));
    map.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && state.activeId) {
        event.preventDefault();
        closePanel(true);
      }
    });

    const observer = "IntersectionObserver" in window ? new IntersectionObserver(([entry]) => {
      map.classList.toggle("panorama-map--paused", !entry.isIntersecting);
    }, { threshold: .08 }) : null;
    observer?.observe(source.art);

    source.art.append(map);
    source.proof.classList.add("panorama-proof--map-source");
    source.proof.hidden = true;
    update();
    const resizeObserver = "ResizeObserver" in window ? new ResizeObserver(repositionActivePanel) : null;
    resizeObserver?.observe(map);
    resizeObserver?.observe(panel);
    window.addEventListener("resize", repositionActivePanel);
    mounted = {
      source,
      map,
      observer,
      dispose: () => {
        cancelClose();
        resizeObserver?.disconnect();
        window.removeEventListener("resize", repositionActivePanel);
        try { state.audioContext?.close?.().catch(() => {}); } catch (_) { /* Audio is optional. */ }
      }
    };
  };

  const unmount = () => {
    if (!mounted) return;
    const restoreFocus = mounted.map.contains(document.activeElement);
    mounted.observer?.disconnect();
    mounted.dispose?.();
    mounted.map.remove();
    mounted.source.proof.hidden = false;
    mounted.source.proof.classList.remove("panorama-proof--map-source");
    if (restoreFocus) {
      mounted.source.proof.tabIndex = -1;
      mounted.source.proof.focus({ preventScroll: true });
    }
    mounted = null;
  };

  const reconcile = () => {
    if (interactiveQuery.matches) mount();
    else unmount();
  };

  interactiveQuery.addEventListener?.("change", reconcile);
  window.addEventListener("DOMContentLoaded", reconcile, { once: true });
  if (document.readyState !== "loading") reconcile();
})();
