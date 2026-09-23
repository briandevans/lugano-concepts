(() => {
  "use strict";

  const desktopQuery = window.matchMedia("(min-width: 1001px) and (hover: hover) and (pointer: fine)");
  let mounted = null;

  const text = (element) => element ? element.textContent.replace(/\s+/g, " ").trim() : "";
  const create = (tag, className, content) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (content !== undefined) element.textContent = content;
    return element;
  };

  const createIcon = (name, className) => {
    const paths = {
      data: ["M4.25 7h7.5v5.75h-7.5z", "M5.75 7V5.35a2.25 2.25 0 0 1 4.5 0V7", "M8 9.45v1.3"],
      retention: ["M3 10.9 10.9 3l2.1 2.1-7.9 7.9H3z", "M9.75 4.15 11.85 6.25"],
      receipt: ["M3 2.75h10v10.5H3z", "m5.1 5.9 1.7 1.7 3.95-3.1", "M5.2 10.2h5.6"],
      shield: ["M8 2.5 12.5 4.2v3.35c0 2.75-1.85 4.8-4.5 5.95-2.65-1.15-4.5-3.2-4.5-5.95V4.2z", "m5.95 8 1.4 1.4 2.85-2.9"]
    };
    const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    icon.setAttribute("aria-hidden", "true");
    icon.setAttribute("viewBox", "0 0 16 16");
    icon.setAttribute("fill", "none");
    icon.setAttribute("focusable", "false");
    if (className) icon.setAttribute("class", className);
    (paths[name] || paths.data).forEach((pathData) => {
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", pathData);
      path.setAttribute("stroke", "currentColor");
      path.setAttribute("stroke-linecap", "round");
      path.setAttribute("stroke-linejoin", "round");
      path.setAttribute("stroke-width", "1.25");
      icon.append(path);
    });
    return icon;
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

  const getGroups = (source) => {
    const groups = [
      {
        id: "data-prompts",
        label: source.declaration.label,
        statement: source.declaration.statement,
        records: [4, 8],
        x: "18%",
        y: "66%",
        labelX: "42px",
        labelY: "-25px",
        labelTranslate: "0",
        leader: "35px",
        angle: "-28deg",
        icon: "data",
        touchPhoneX: "24%",
        touchPhoneY: "69%"
      },
      {
        id: "retention",
        label: source.principles[0].label,
        statement: source.principles[0].statement,
        records: [],
        metric: source.masthead.retained,
        x: "49%",
        y: "77%",
        labelX: "40px",
        labelY: "-25px",
        labelTranslate: "0",
        leader: "33px",
        angle: "-29deg",
        icon: "retention",
        touchPhoneX: "48%",
        touchPhoneY: "75%"
      },
      {
        id: "every-request",
        label: source.principles[1].label,
        statement: source.principles[1].statement,
        records: [5, 6, 7],
        x: "82%",
        y: "64%",
        labelX: "-42px",
        labelY: "-27px",
        labelTranslate: "-100%",
        leader: "34px",
        angle: "-151deg",
        icon: "receipt",
        touchPhoneX: "69%",
        touchPhoneY: "72%"
      },
      {
        id: "threat-model",
        label: source.principles[2].label,
        statement: source.principles[2].statement,
        records: [0, 1, 2, 3],
        x: "78%",
        y: "91%",
        labelX: "-42px",
        labelY: "-27px",
        labelTranslate: "-100%",
        leader: "34px",
        angle: "-151deg",
        icon: "shield",
        touchPhoneX: "82%",
        touchPhoneY: "88%"
      }
    ];

    return !source.masthead.title || !source.masthead.kicker || !source.masthead.retained || groups.some((group) => !group.label || !group.statement || group.records.some((index) => !source.records[index])) ? null : groups;
  };

  const getItems = (source) => {
    const groups = getGroups(source);
    if (!groups) return null;

    return [
      ...groups,
      {
        id: "tokenization",
        kind: "tokenization",
        label: "Tokenization",
        statement: "Tokenized access to private inference, with incentives for independent verification.",
        href: "#thesis",
        records: [],
        x: "46%",
        y: "38%",
        labelX: "42px",
        labelY: "-25px",
        labelTranslate: "0",
        leader: "35px",
        angle: "-28deg",
        icon: "data"
      }
    ];
  };

  const mountDesktop = () => {
    if (mounted || !desktopQuery.matches) return;
    const source = getSource();
    if (!source?.art) return;
    const items = getItems(source);
    if (!items) return;

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
    panel.hidden = true;
    panel.setAttribute("aria-live", "polite");
    panel.setAttribute("aria-atomic", "true");
    const panelCopy = create("div", "panorama-map__panel-copy");
    const title = create("h2", "panorama-map__title");
    title.id = "panorama-map-panel-title";
    const statement = create("p", "panorama-map__statement");
    const close = create("button", "panorama-map__close", "×");
    close.type = "button";
    close.setAttribute("aria-label", "Close detail");
    const recordList = create("ul", "panorama-map__records");
    recordList.hidden = true;
    const metric = create("p", "panorama-map__metric");
    metric.hidden = true;
    const thesisLink = create("a", "panorama-map__thesis-link", "Read our thesis →");
    thesisLink.href = "#thesis";
    thesisLink.hidden = true;
    const instruction = create("p", "panorama-map__instruction", "Hover to explore · Click to pin");
    instruction.id = "panorama-map-instruction";
    instruction.setAttribute("aria-label", "Hover or focus a marker to explore. Select a marker to pin its details.");
    const sound = create("button", "panorama-map__sound", "Sound on");
    sound.type = "button";
    sound.setAttribute("aria-pressed", "true");
    sound.setAttribute("aria-label", "Sound on");
    const toolbar = create("aside", "panorama-map__toolbar");
    toolbar.setAttribute("aria-label", "Map controls");
    panelCopy.append(title, statement);
    panel.append(panelCopy, close, recordList, metric, thesisLink);
    toolbar.append(instruction, sound);
    map.append(masthead, toolbar, panel);
    map.setAttribute("aria-describedby", instruction.id);

    const state = { activeId: null, pinnedId: null, lastTrigger: null, closeTimer: 0, soundEnabled: true, audioContext: null, pointerOnInteractive: false, suppressFocusFor: null };
    const markerButtons = new Map();
    const panelMargin = 18;
    const panelGap = 14;

    const renderPanel = (item) => {
      while (recordList.firstChild) recordList.removeChild(recordList.firstChild);
      if (!item) {
        panel.hidden = true;
        title.textContent = "";
        statement.textContent = "";
        recordList.hidden = true;
        metric.hidden = true;
        thesisLink.hidden = true;
        return;
      }
      title.textContent = item.label;
      statement.textContent = item.statement;
      panel.dataset.kind = item.kind || "verification";
      if (item.kind === "tokenization") {
        recordList.hidden = true;
        metric.hidden = true;
        metric.textContent = "";
        thesisLink.href = item.href;
        thesisLink.hidden = false;
      } else {
        recordList.classList.toggle("panorama-map__records--compact", item.records.length > 3);
        item.records.forEach((index) => {
          const record = source.records[index];
          const recordItem = create("li");
          recordItem.append(create("strong", "", record.label), create("code", "", record.hash));
          recordList.append(recordItem);
        });
        recordList.hidden = item.records.length === 0;
        metric.hidden = !item.metric;
        metric.textContent = item.metric || "";
        thesisLink.hidden = true;
      }
      panel.hidden = false;
    };

    const clearPanelPosition = () => {
      panel.style.removeProperty("--panel-left");
      panel.style.removeProperty("--panel-top");
      panel.style.removeProperty("--panel-caret-left");
      delete panel.dataset.kind;
    };

    const positionPanel = (item) => {
      const marker = markerButtons.get(item.id);
      const label = marker?.querySelector(".panorama-map__marker-label");
      if (!marker || !label) return;

      const mapRect = map.getBoundingClientRect();
      const markerRect = marker.getBoundingClientRect();
      const labelRect = label.getBoundingClientRect();
      const panelWidth = panel.offsetWidth;
      const panelHeight = panel.offsetHeight;
      if (!mapRect.width || !mapRect.height || !panelWidth || !panelHeight) return;

      const maxLeft = Math.max(panelMargin, mapRect.width - panelMargin - panelWidth);
      let desiredLeft;
      let desiredTop;
      let anchor;
      if (item.kind === "tokenization") {
        const markerCenter = markerRect.left - mapRect.left + (markerRect.width / 2);
        desiredLeft = markerCenter - panelWidth - panelGap;
        desiredTop = markerRect.top - mapRect.top - panelGap - panelHeight;
        anchor = markerCenter;
      } else {
        const labelCenter = labelRect.left - mapRect.left + (labelRect.width / 2);
        desiredLeft = labelCenter - (panelWidth / 2);
        desiredTop = labelRect.top - mapRect.top - panelGap - panelHeight;
        anchor = labelCenter;
      }
      const left = Math.min(Math.max(desiredLeft, panelMargin), maxLeft);
      const top = Math.max(panelMargin, Math.min(desiredTop, mapRect.height - panelMargin - panelHeight));
      const caretLeft = Math.min(Math.max(anchor - left, 24), panelWidth - 24);

      panel.style.setProperty("--panel-left", `${left}px`);
      panel.style.setProperty("--panel-top", `${top}px`);
      panel.style.setProperty("--panel-caret-left", `${caretLeft}px`);
    };

    const repositionActivePanel = () => {
      if (!map.isConnected) return;
      const item = items.find((candidate) => candidate.id === state.activeId);
      if (item) positionPanel(item);
    };

    const update = () => {
      const item = items.find((candidate) => candidate.id === state.activeId) || null;
      markerButtons.forEach((button, id) => {
        button.setAttribute("aria-expanded", String(id === state.activeId));
        button.setAttribute("aria-pressed", String(id === state.pinnedId));
      });
      instruction.textContent = state.pinnedId ? "Pinned · Esc to close" : "Hover to explore · Click to pin";
      panel.dataset.state = item ? "active" : "idle";
      renderPanel(item);
      if (item) {
        markerButtons.get(item.id)?.after(panel);
        positionPanel(item);
      }
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
        const activeMarker = markerButtons.get(state.activeId);
        const retainsPreview = activeMarker?.contains(document.activeElement) || panel.contains(document.activeElement);
        if (!state.pinnedId && !state.pointerOnInteractive && !retainsPreview) {
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
      state.pointerOnInteractive = false;
      update();
      if (restoreFocus && trigger?.isConnected) {
        state.suppressFocusFor = trigger;
        trigger.focus({ preventScroll: true });
        window.requestAnimationFrame(() => { state.suppressFocusFor = null; });
      }
    };

    const preview = (id, trigger, replacePinned = false) => {
      cancelClose();
      if (state.pinnedId && state.pinnedId !== id) {
        if (!replacePinned) return;
        state.pinnedId = null;
      }
      state.activeId = id;
      if (trigger) state.lastTrigger = trigger;
      update();
    };

    const activate = (id, trigger) => {
      cancelClose();
      if (state.pinnedId === id) {
        closePanel(false);
        return;
      }
      state.activeId = id;
      state.pinnedId = id;
      state.lastTrigger = trigger;
      playTick();
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

    items.forEach((item, index) => {
      const marker = create("button", "panorama-map__marker");
      marker.type = "button";
      marker.style.setProperty("--pulse-delay", `${index * -.65}s`);
      marker.style.setProperty("--marker-x", item.x);
      marker.style.setProperty("--marker-y", item.y);
      marker.style.setProperty("--label-x", item.labelX);
      marker.style.setProperty("--label-y", item.labelY);
      marker.style.setProperty("--label-translate-x", item.labelTranslate);
      marker.style.setProperty("--leader-length", item.leader);
      marker.style.setProperty("--leader-angle", item.angle);
      marker.setAttribute("aria-controls", panel.id);
      marker.setAttribute("aria-expanded", "false");
      marker.setAttribute("aria-pressed", "false");
      marker.setAttribute("aria-label", `${item.label}: ${item.statement}`);
      marker.dataset.group = item.id;
      marker.dataset.kind = item.kind || "verification";
      const leader = create("span", "panorama-map__marker-leader");
      leader.setAttribute("aria-hidden", "true");
      const label = create("span", "panorama-map__marker-label");
      label.setAttribute("aria-hidden", "true");
      label.append(document.createTextNode(item.label));
      marker.append(leader, label);
      const previewFromPointer = () => {
        if (state.pointerOnInteractive && state.activeId === item.id) return;
        state.pointerOnInteractive = true;
        preview(item.id, marker);
      };
      const leaveMarker = () => {
        state.pointerOnInteractive = false;
        scheduleClose();
      };
      marker.addEventListener("pointerenter", previewFromPointer);
      marker.addEventListener("mouseenter", previewFromPointer);
      marker.addEventListener("pointerleave", leaveMarker);
      marker.addEventListener("mouseleave", leaveMarker);
      marker.addEventListener("focus", () => {
        if (state.suppressFocusFor === marker) return;
        preview(item.id, marker, true);
      });
      marker.addEventListener("click", () => activate(item.id, marker));
      markerButtons.set(item.id, marker);
      map.append(marker);
    });

    const handleDocumentPointerDown = (event) => {
      if (!state.activeId || state.pinnedId) return;
      const onMarker = [...markerButtons.values()].some((button) => button.contains(event.target));
      if (onMarker || panel.contains(event.target)) return;
      closePanel(false);
    };
    const handleFocusOut = () => window.setTimeout(scheduleClose, 0);
    const handleEscape = (event) => {
      if (event.key !== "Escape" || !state.activeId) return;
      event.preventDefault();
      closePanel(true);
    };

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
    document.addEventListener("pointerdown", handleDocumentPointerDown, true);
    map.addEventListener("focusout", handleFocusOut);
    map.addEventListener("keydown", handleEscape);

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
      mode: "desktop",
      source,
      map,
      observer,
      dispose: () => {
        cancelClose();
        resizeObserver?.disconnect();
        document.removeEventListener("pointerdown", handleDocumentPointerDown, true);
        map.removeEventListener("focusout", handleFocusOut);
        map.removeEventListener("keydown", handleEscape);
        window.removeEventListener("resize", repositionActivePanel);
        try { state.audioContext?.close?.().catch(() => {}); } catch (_) { /* Audio is optional. */ }
      }
    };
  };

  const mountTouch = () => {
    if (mounted || desktopQuery.matches) return;
    const source = getSource();
    if (!source?.art) return;
    const items = getItems(source);
    if (!items) return;

    const map = create("section", "panorama-map panorama-map--touch");
    map.setAttribute("aria-label", "Interactive verification landscape");
    map.setAttribute("role", "region");

    const stage = create("div", "panorama-map__touch-stage");
    stage.setAttribute("aria-label", "Verification markers");
    stage.setAttribute("role", "group");

    const instruction = create("p", "panorama-map__touch-instruction", "Tap a marker or topic to explore.");
    instruction.id = "panorama-map-touch-instruction";
    const sound = create("button", "panorama-map__sound", "Sound on");
    sound.type = "button";
    sound.setAttribute("aria-pressed", "true");
    sound.setAttribute("aria-label", "Sound on");
    const toolbar = create("aside", "panorama-map__touch-toolbar");
    toolbar.setAttribute("aria-label", "Map controls");
    toolbar.append(instruction, sound);
    map.setAttribute("aria-describedby", instruction.id);
    const topics = create("div", "panorama-map__topics");
    topics.setAttribute("aria-label", "Verification topics");
    topics.setAttribute("role", "group");

    const panel = create("section", "panorama-map__touch-panel");
    panel.id = "panorama-map-touch-panel";
    panel.hidden = true;
    panel.setAttribute("aria-live", "polite");
    panel.setAttribute("aria-atomic", "true");
    const panelHeader = create("div", "panorama-map__touch-panel-header");
    const title = create("h2", "panorama-map__title");
    title.id = "panorama-map-touch-panel-title";
    const close = create("button", "panorama-map__close", "×");
    close.type = "button";
    close.setAttribute("aria-label", "Close detail");
    panelHeader.append(title, close);
    const statement = create("p", "panorama-map__statement");
    const recordList = create("ul", "panorama-map__records");
    recordList.hidden = true;
    const metric = create("p", "panorama-map__metric");
    metric.hidden = true;
    const thesisLink = create("a", "panorama-map__thesis-link", "Read our thesis →");
    thesisLink.href = "#thesis";
    thesisLink.hidden = true;
    panel.append(panelHeader, statement, recordList, metric, thesisLink);

    const state = { activeId: null, pinnedId: null, lastTrigger: null, soundEnabled: true, audioContext: null, suppressFocusFor: null };
    const markerButtons = new Map();
    const topicButtons = new Map();

    const renderPanel = (item) => {
      while (recordList.firstChild) recordList.removeChild(recordList.firstChild);
      if (!item) {
        panel.hidden = true;
        title.textContent = "";
        statement.textContent = "";
        recordList.hidden = true;
        metric.hidden = true;
        thesisLink.hidden = true;
        return;
      }

      title.textContent = item.label;
      statement.textContent = item.statement;
      panel.dataset.kind = item.kind || "verification";
      if (item.kind === "tokenization") {
        recordList.hidden = true;
        metric.hidden = true;
        metric.textContent = "";
        thesisLink.href = item.href;
        thesisLink.hidden = false;
      } else {
        recordList.classList.toggle("panorama-map__records--compact", item.records.length > 3);
        item.records.forEach((index) => {
          const record = source.records[index];
          const recordItem = create("li");
          recordItem.append(create("strong", "", record.label), create("code", "", record.hash));
          recordList.append(recordItem);
        });
        recordList.hidden = item.records.length === 0;
        metric.hidden = !item.metric;
        metric.textContent = item.metric || "";
        thesisLink.hidden = true;
      }
      panel.hidden = false;
    };

    const update = () => {
      const item = items.find((candidate) => candidate.id === state.activeId) || null;
      markerButtons.forEach((button, id) => {
        button.setAttribute("aria-expanded", String(id === state.activeId));
        button.setAttribute("aria-pressed", String(id === state.pinnedId));
      });
      topicButtons.forEach((button, id) => {
        button.setAttribute("aria-expanded", String(id === state.activeId));
        button.setAttribute("aria-pressed", String(id === state.pinnedId));
      });
      instruction.textContent = "Tap a marker or topic to explore.";
      map.dataset.state = item ? "active" : "idle";
      if (!item) delete panel.dataset.kind;
      renderPanel(item);
    };

    const closePanel = (restoreFocus) => {
      const trigger = state.lastTrigger || topicButtons.get(state.activeId) || markerButtons.get(state.activeId);
      state.activeId = null;
      state.pinnedId = null;
      update();
      if (restoreFocus && trigger?.isConnected) {
        state.suppressFocusFor = trigger;
        trigger.focus({ preventScroll: true });
        window.requestAnimationFrame(() => { state.suppressFocusFor = null; });
      }
    };

    const preview = (id, trigger) => {
      if (state.pinnedId && state.pinnedId !== id) state.pinnedId = null;
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

    const activate = (id, trigger) => {
      if (state.pinnedId === id) {
        closePanel(false);
        return;
      }
      state.activeId = id;
      state.pinnedId = id;
      state.lastTrigger = trigger;
      playTick();
      update();
    };

    items.forEach((item) => {
      if (!item.kind) {
        const marker = create("button", "panorama-map__touch-marker");
        marker.type = "button";
        marker.dataset.group = item.id;
        marker.style.setProperty("--touch-marker-tablet-x", item.x);
        marker.style.setProperty("--touch-marker-tablet-y", item.y);
        marker.style.setProperty("--touch-marker-phone-x", item.touchPhoneX);
        marker.style.setProperty("--touch-marker-phone-y", item.touchPhoneY);
        marker.setAttribute("aria-controls", panel.id);
        marker.setAttribute("aria-expanded", "false");
        marker.setAttribute("aria-pressed", "false");
        marker.setAttribute("aria-label", `${item.label}: ${item.statement}`);
        marker.append(createIcon(item.icon, "panorama-map__touch-marker-icon"));
        marker.addEventListener("focus", () => {
          if (state.suppressFocusFor !== marker) preview(item.id, marker);
        });
        marker.addEventListener("click", () => activate(item.id, marker));
        markerButtons.set(item.id, marker);
        stage.append(marker);
      }

      const topic = create("button", "panorama-map__topic");
      topic.type = "button";
      topic.dataset.kind = item.kind || "verification";
      topic.setAttribute("aria-controls", panel.id);
      topic.setAttribute("aria-expanded", "false");
      topic.setAttribute("aria-pressed", "false");
      topic.setAttribute("aria-label", `${item.label}: ${item.statement}`);
      topic.append(createIcon(item.icon, "panorama-map__topic-icon"), create("span", "panorama-map__topic-label", item.label));
      topic.addEventListener("focus", () => {
        if (state.suppressFocusFor !== topic) preview(item.id, topic);
      });
      topic.addEventListener("click", () => activate(item.id, topic));
      topicButtons.set(item.id, topic);
      topics.append(topic);
    });

    close.addEventListener("click", () => closePanel(true));
    sound.addEventListener("click", () => {
      state.soundEnabled = !state.soundEnabled;
      sound.setAttribute("aria-pressed", String(state.soundEnabled));
      sound.textContent = state.soundEnabled ? "Sound on" : "Sound off";
      sound.setAttribute("aria-label", sound.textContent);
    });
    const handleEscape = (event) => {
      if (event.key !== "Escape" || !state.activeId) return;
      event.preventDefault();
      closePanel(true);
    };
    const handleFocusOut = () => window.setTimeout(() => {
      if (!state.pinnedId && state.activeId && !map.contains(document.activeElement) && !stage.contains(document.activeElement)) closePanel(false);
    }, 0);
    map.addEventListener("keydown", handleEscape);
    stage.addEventListener("keydown", handleEscape);
    map.addEventListener("focusout", handleFocusOut);
    stage.addEventListener("focusout", handleFocusOut);

    map.append(toolbar, topics, panel);
    source.art.append(stage);
    source.art.after(map);
    source.proof.classList.add("panorama-proof--map-source");
    source.proof.hidden = true;
    update();
    mounted = {
      mode: "touch",
      source,
      map,
      stage,
      dispose: () => {
        map.removeEventListener("keydown", handleEscape);
        stage.removeEventListener("keydown", handleEscape);
        map.removeEventListener("focusout", handleFocusOut);
        stage.removeEventListener("focusout", handleFocusOut);
        try { state.audioContext?.close?.().catch(() => {}); } catch (_) { /* Audio is optional. */ }
      }
    };
  };

  const unmount = () => {
    if (!mounted) return;
    const restoreFocus = mounted.map.contains(document.activeElement) || mounted.stage?.contains(document.activeElement);
    mounted.observer?.disconnect();
    mounted.dispose?.();
    mounted.stage?.remove();
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
    const nextMode = desktopQuery.matches ? "desktop" : "touch";
    if (mounted?.mode === nextMode) return;
    unmount();
    if (nextMode === "desktop") mountDesktop();
    else mountTouch();
  };

  if (desktopQuery.addEventListener) desktopQuery.addEventListener("change", reconcile);
  else desktopQuery.addListener?.(reconcile);
  window.addEventListener("DOMContentLoaded", reconcile, { once: true });
  if (document.readyState !== "loading") reconcile();
})();
