import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
import { test } from "node:test";
import { runInNewContext } from "node:vm";

const routerSource = readFileSync(
  new URL("../homepage-router.js", import.meta.url),
  "utf8",
);

const flushRouteWork = async () => {
  for (let turn = 0; turn < 8; turn += 1) {
    await Promise.resolve();
  }
};

const createClassList = () => {
  const values = new Set();

  return {
    add: (...tokens) => tokens.forEach((token) => values.add(token)),
    remove: (...tokens) => tokens.forEach((token) => values.delete(token)),
    contains: (token) => values.has(token),
  };
};

const createRouterHarness = ({ hash = "", pathname = "/", search = "" } = {}) => {
  const elements = new Map();
  const appended = { head: [], body: [] };
  const windowListeners = new Map();
  const historyCalls = [];
  const scrolls = [];
  let reloads = 0;

  const createElement = (id = "") => {
    const listeners = new Map();

    return {
      id,
      hidden: false,
      addEventListener(event, listener) {
        const callbacks = listeners.get(event) || [];
        callbacks.push(listener);
        listeners.set(event, callbacks);
      },
      dispatch(event) {
        for (const listener of listeners.get(event) || []) {
          listener({ target: this, type: event });
        }
      },
    };
  };

  const marketingRoot = createElement("marketing-root");
  const appRoot = createElement("root");
  appRoot.hidden = true;
  elements.set(marketingRoot.id, marketingRoot);
  elements.set(appRoot.id, appRoot);

  [
    "top",
    "platform",
    "architecture",
    "privacy",
    "use-cases",
    "private-agents",
    "private-models",
    "cta",
  ].forEach((id) => {
    const section = createElement(id);
    section.scrollIntoView = (options) => scrolls.push({ id, options });
    elements.set(id, section);
  });

  const append = (target) => (element) => {
    target.push(element);
    elements.set(element.id, element);
    element.dispatch("load");
    return element;
  };

  const documentElement = {
    dataset: {},
    attributes: new Map(),
    setAttribute(name, value) {
      this.attributes.set(name, value);
    },
  };
  const location = {
    hash,
    pathname,
    search,
    reload() {
      reloads += 1;
    },
  };
  const document = {
    readyState: "complete",
    documentElement,
    head: { append: append(appended.head) },
    body: { append: append(appended.body), classList: createClassList() },
    createElement: () => createElement(),
    getElementById: (id) => elements.get(id) || null,
    addEventListener() {},
  };
  const window = {
    location,
    history: {
      replaceState(_state, _title, url) {
        const nextLocation = new URL(url, "https://lugano.test");
        historyCalls.push(url);
        location.pathname = nextLocation.pathname;
        location.search = nextLocation.search;
        location.hash = nextLocation.hash;
      },
    },
    addEventListener(event, listener) {
      const callbacks = windowListeners.get(event) || [];
      callbacks.push(listener);
      windowListeners.set(event, callbacks);
    },
    requestAnimationFrame(callback) {
      callback();
      return 1;
    },
  };

  runInNewContext(routerSource, { document, Promise, Set, window }, { filename: "homepage-router.js" });

  return {
    appRoot,
    marketingRoot,
    get mode() {
      return documentElement.attributes.get("data-homepage-mode");
    },
    get reloads() {
      return reloads;
    },
    get hash() {
      return location.hash;
    },
    historyCalls,
    scrolls,
    bodyHasClass: (className) => document.body.classList.contains(className),
    stylePaths: () => appended.head.map((element) => new URL(element.href, "https://lugano.test").pathname),
    scriptPaths: () => appended.body.map((element) => new URL(element.src, "https://lugano.test").pathname),
    async settle() {
      await flushRouteWork();
    },
    dispatchHashchange(nextHash) {
      location.hash = nextHash;
      for (const listener of windowListeners.get("hashchange") || []) {
        listener({ type: "hashchange" });
      }
    },
  };
};

test("router selects isolated panoramic and legacy assets from the initial hash", async () => {
  const marketing = createRouterHarness({ hash: "#privacy" });
  await marketing.settle();

  assert.equal(marketing.mode, "marketing");
  assert.equal(marketing.marketingRoot.hidden, false);
  assert.equal(marketing.appRoot.hidden, true);
  assert.ok(marketing.bodyHasClass("opening-panorama"));
  assert.deepEqual(marketing.stylePaths(), [
    "/concepts/longbow/longbow.css",
    "/concepts/longbow/verification.css",
    "/concepts/longbow/opening/panorama/style.css",
    "/concepts/longbow/opening/panorama/map.css",
  ]);
  assert.deepEqual(marketing.scriptPaths(), [
    "/concepts/longbow/longbow.js",
    "/concepts/longbow/opening/panorama/map.js",
  ]);

  const legacy = createRouterHarness({ hash: "#/apply" });
  await legacy.settle();

  assert.equal(legacy.mode, "legacy");
  assert.equal(legacy.marketingRoot.hidden, true);
  assert.equal(legacy.appRoot.hidden, false);
  assert.equal(legacy.bodyHasClass("opening-panorama"), false);
  assert.deepEqual(legacy.stylePaths(), [
    "/assets/index-B5y9UYA8.css",
    "/homepage-sections.css",
    "/lugano-design-system.css",
    "/concepts/longbow/waitlist.css",
  ]);
  assert.deepEqual(legacy.scriptPaths(), [
    "/assets/index--1ut8_O7.js",
    "/homepage-sections.js",
  ]);
});

test("router preserves marketing anchors, normalizes old section hashes, and reloads for waitlist mode", async () => {
  const router = createRouterHarness({
    hash: "#/?section=privacy",
    pathname: "/concepts/longbow/",
    search: "?ref=launch",
  });
  await router.settle();

  assert.equal(router.mode, "marketing");
  assert.equal(router.hash, "#privacy");
  assert.deepEqual(router.historyCalls, ["/concepts/longbow/?ref=launch#privacy"]);
  assert.equal(router.scrolls.length, 1);
  assert.equal(router.scrolls[0].id, "privacy");
  assert.equal(router.scrolls[0].options.block, "start");

  router.dispatchHashchange("#architecture");
  assert.equal(router.reloads, 0);

  router.dispatchHashchange("#/apply");
  assert.equal(router.reloads, 1);
});
