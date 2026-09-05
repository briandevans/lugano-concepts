import { readFileSync } from "node:fs";
import { test } from "node:test";
import assert from "node:assert/strict";

const homepageScript = readFileSync(
  new URL("../homepage-sections.js", import.meta.url),
  "utf8",
);
const homepageStyles = readFileSync(
  new URL("../homepage-sections.css", import.meta.url),
  "utf8",
);
const homepageIndex = readFileSync(
  new URL("../index.html", import.meta.url),
  "utf8",
);
const homepageBundle = readFileSync(
  new URL("../assets/index--1ut8_O7.js", import.meta.url),
  "utf8",
);
const logoMark = readFileSync(
  new URL("../logo-mark.svg", import.meta.url),
  "utf8",
);
const logoMarkWebp = readFileSync(
  new URL("../logo-mark.webp", import.meta.url),
);
const docsIndex = readFileSync(
  new URL("../docs/index.html", import.meta.url),
  "utf8",
);

test("uses 10+ checks consistently and never reintroduces 30+ checks", () => {
  assert.match(homepageScript, /across 10\+ checks/i);
  assert.doesNotMatch(homepageScript, /30\+\s*checks/i);
});

test("normalizes all request CTAs to Waitlist", () => {
  const labelSetMatch = homepageScript.match(/const CTA_LABELS = new Set\(\[([\s\S]*?)\]\);/);
  assert.ok(labelSetMatch, "CTA_LABELS set should exist");

  const labels = [...labelSetMatch[1].matchAll(/"([^"]+)"/g)].map((match) => match[1]);

  assert.ok(labels.includes("request a demo"));
  assert.ok(labels.includes("request demo"));
  assert.match(homepageScript, /const CTA_LABEL_TEXT = "Waitlist";/);
  assert.match(homepageScript, /element\.textContent = CTA_LABEL_TEXT;/);
  assert.doesNotMatch(homepageScript, /private briefing/i);
});

test("does not inject withheld-detail teaser boxes", () => {
  assert.doesNotMatch(homepageScript, /Privacy tiers/);
  assert.doesNotMatch(homepageScript, /Deeper tiers disclosed under NDA\./);
  assert.doesNotMatch(homepageScript, /privacy-tiers|PRIVACY_TIERS|tierMarkup/);
});

test("cipher hover covers screenshot card surfaces", () => {
  const selectorMatch = homepageScript.match(/const CARD_SELECTOR = \[([\s\S]*?)\]\.join/);
  assert.ok(selectorMatch, "CARD_SELECTOR should be built from an explicit selector list");

  [
    "#root .lgx-tier-card",
  ].forEach((selector) => {
    assert.match(selectorMatch[1], new RegExp(selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  });

  assert.doesNotMatch(selectorMatch[1], /#root \.lgx-proof-row/);
  assert.doesNotMatch(selectorMatch[1], /#root \.lgx-hero-proof-card/);
  assert.match(homepageScript, /ensurePrivacyLevelsSection/);
  assert.doesNotMatch(homepageScript, /Deeper tiers|disclosed under NDA|withheld/i);
});

test("trust gap statistic band is restored", () => {
  assert.match(homepageScript, /\[ THE TRUST GAP \]/);
  assert.match(homepageScript, /The market is blocked by trust\./);
  assert.match(homepageScript, /class="lgx-why-now-stat"/);
  assert.match(homepageScript, /67%/);
  assert.match(homepageScript, /Cisco Data Privacy Benchmark/);
  assert.match(homepageScript, /of enterprises restrict AI use over data exposure concerns\./);
  assert.match(homepageScript, /#root \.lgx-why-now-stat/);
  assert.match(homepageStyles, /#root \.lgx-why-now-stat/);
});

test("privacy section uses the tier band instead of the incentive copy block", () => {
  assert.match(homepageScript, /const privacyTierBandMarkup = \(\) => `/);
  assert.match(homepageScript, /class="lgx-privacy-positioning lgx-tier-positioning"/);
  assert.match(homepageScript, /<div class="lgx-tier-band" aria-label="Privacy levels">/);
  assert.match(
    homepageScript,
    /contentShell\.insertAdjacentHTML\("beforeend", privacyTierBandMarkup\(\)\);/,
  );
  assert.doesNotMatch(
    homepageScript,
    /Model providers monetize|verifiable privacy would break their own business model|Lugano doesn't build models|Zero incentive conflict|We sell proof/,
  );
  assert.doesNotMatch(homepageScript, /insertAdjacentElement\("afterend", buildPrivacyLevelsSection\(\)\)/);
  assert.doesNotMatch(homepageStyles, /lgx-incentive-closer/);
});

test("mutation observer does not recursively remount while adding hover canvases", () => {
  assert.match(homepageScript, /let enhancementFrame = 0;/);
  assert.match(homepageScript, /const observer = new MutationObserver\(scheduleEnhancements\);/);
  assert.doesNotMatch(
    homepageScript,
    /new MutationObserver\(\(\) => \{[\s\S]*?if \(mount\(\)\)/,
  );
  assert.doesNotMatch(
    homepageScript,
    /new MutationObserver\(\(\) => \{[\s\S]*?enhanceCardCipherHover\(\)/,
  );
});

test("receipt JSON patch keeps a comma between hash and status", () => {
  assert.match(
    homepageScript,
    /"hash": "<span class="hash-value">a3f7e2c8b19d\.\.\.9c41<\/span>",/,
  );
  assert.match(
    homepageScript,
    /"status": "<span style="color: #4EC9A0;">VERIFIED<\/span>"/,
  );
});

test("footer labels are converted to real links", () => {
  assert.match(homepageScript, /Contact:\s*"\/#\/apply"/);
  assert.match(homepageScript, /"Privacy Policy":\s*"\/privacy\/"/);
  assert.match(homepageScript, /Security:\s*"\/security\/"/);
  assert.match(homepageScript, /Terms:\s*"\/terms\/"/);
  assert.doesNotMatch(homepageScript, /"Terms of Service":\s*"\/terms\/"/);
});

test("brand mark and favicon use the cobalt Lugano mark", () => {
  assert.equal(logoMarkWebp.subarray(0, 4).toString("ascii"), "RIFF");
  assert.equal(logoMarkWebp.subarray(8, 12).toString("ascii"), "WEBP");
  assert.match(logoMark, /viewBox="0 0 1920 1920"/);
  assert.match(logoMark, /fill="#194987" fill-opacity="0\.10"/);
  assert.match(logoMark, /width="395" height="434" fill="#194987"/);
  assert.doesNotMatch(logoMark, /linearGradient/);
  assert.match(logoMark, /x="584" y="469" width="395" height="434"/);
  assert.match(logoMark, /x="1032" y="964" width="395" height="434"/);
  assert.match(
    homepageIndex,
    /<link rel="icon" type="image\/svg\+xml" href="\.\/logo-mark\.svg\?v=[^"]+" \/>/,
  );
  assert.match(
    homepageIndex,
    /homepage-sections\.css\?v=[^"]+/,
  );
  assert.match(
    homepageIndex,
    /homepage-sections\.js\?v=[^\"]+/,
  );
  assert.match(
    homepageIndex,
    /lugano-design-system\.css\?v=[^"]+/,
  );
  assert.match(
    homepageScript,
    /const BRAND_MARK_SRC = "logo-mark\.webp\?v=brand-manus-parity-20260622";/,
  );
  assert.doesNotMatch(homepageScript, /BRAND_MARK_SRC = "\//);
  assert.match(homepageScript, /normalizeBrandMarkAssets/);
  assert.match(homepageStyles, /--lgx-magenta: #e11bdd;/);
});

test("hero keeps the verification ledger as a first-class editorial feature", () => {
  assert.match(homepageScript, /hero\.classList\.add\("lgx-hero-editorial"\);/);
  assert.match(homepageScript, /hero\.classList\.remove\("lgx-hero-split"\);/);
  assert.match(homepageScript, /heroContent\.append\(copyColumn, proofColumn\);/);
  assert.match(homepageScript, /heroContent\.appendChild\(proofColumn\);/);
  assert.match(homepageScript, /const HERO_VERIFICATION_ROWS = \[/);
  assert.match(homepageScript, /hero\.insertAdjacentElement\("afterend", ledger\);/);
  assert.match(
    homepageStyles,
    /#root section\.flex-col\.justify-between:first-of-type\.lgx-hero-editorial/,
  );
  assert.match(homepageStyles, /\.lgx-hero-editorial \.lgx-hero-proof-card/);
  assert.match(homepageStyles, /#root #lugano-proof-ledger/);
});

test("hero preserves the original trust-me-bro headline and all live verification rows", () => {
  const expectedVerificationRows = [
    ["TDX quote verified", "4971...ba575"],
    ["GPU attestation verified", "c8f2...3e41a"],
    ["Proof verification", "[REDACTED]"],
    ["Constraint check", "[REDACTED]"],
    ["Nonce binding verified", "a1d9...7f283"],
    ["Signing key bound", "e3b7...9c064"],
    ["Receipt verification", "f6a4...2d817"],
    ["Disclosure verification", "7f93...6c4e2"],
    ["Payload integrity", "b2a6...8d5f1"],
    ["No prompt retention", "0 retained"],
  ];

  assert.match(homepageScript, /headingLine\.textContent = "AI Privacy by ";/);
  assert.match(homepageScript, /trust\.textContent = "trust me bro";/);
  assert.match(homepageScript, /proof\.textContent = "proof\.";/);
  assert.match(
    homepageScript,
    /proofLine\.append\(trust, document\.createTextNode\(" "\), proof\);/,
  );
  assert.match(homepageScript, /<h2 id="lugano-proof-ledger-heading">Verified Private AI<\/h2>/);
  assert.match(
    homepageScript,
    /Lugano\.ai is provably private AI infrastructure: any model, cryptographically auditable, zero-trust by default\./,
  );

  expectedVerificationRows.forEach(([label, digest]) => {
    assert.match(homepageScript, new RegExp(label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    assert.match(homepageScript, new RegExp(digest.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  });
});

test("static engraving hero prevents the retired Mux player from starting", () => {
  const staticHeroMarker = 'document.documentElement.dataset.lgxStaticHero = "true";';
  const bundleScript = 'src="./assets/index--1ut8_O7.js?v=lugano-engraved-hero-20260905"';

  assert.ok(homepageIndex.includes(staticHeroMarker));
  assert.ok(homepageIndex.indexOf(staticHeroMarker) < homepageIndex.indexOf(bundleScript));
  assert.match(
    homepageBundle,
    /const a=i\.current;if\(a&&document\.documentElement\.dataset\.lgxStaticHero!=="true"\)\{if\(Zn\.isSupported\(\)\)/,
  );
});

test("hash route returns remount the dynamic homepage sections", () => {
  assert.match(homepageScript, /const restoreHomeSections = \(attempt = 0\) => \{/);
  assert.match(homepageScript, /if \(mount\(\) \|\| attempt >= MAX_MOUNT_ATTEMPTS\) \{/);
  assert.match(homepageScript, /window\.requestAnimationFrame\(\(\) => restoreHomeSections\(attempt \+ 1\)\);/);
});

test("apply route resets to the actual top after its form mounts", () => {
  assert.match(
    homepageScript,
    /const isApplyRoute = \(\) => getApplyRouteKey\(\)\.startsWith\("#\/apply"\);/,
  );
  assert.match(homepageScript, /if \(!document\.querySelector\("#root \.apply-form"\)\) \{/);
  assert.match(homepageScript, /documentElement\.style\.scrollBehavior = "auto";/);
  assert.match(homepageScript, /window\.scrollTo\(\{ left: 0, top: 0, behavior: "auto" \}\);/);
  assert.match(homepageScript, /applyScrollRoute = routeKey;/);
  assert.match(homepageScript, /const scheduleEnhancements = \(\) => \{\s*syncApplyScrollReset\(\);/);
  assert.match(homepageScript, /const observer = new MutationObserver\(scheduleEnhancements\);/);
});

test("hero stat boxes use the proof-focused copy", () => {
  const expectedStats = [
    { label: "DATA / PROMPTS", value: "Privacy, even from us." },
    { label: "RETENTION", value: "Can’t leak what we don’t keep." },
    { label: "EVERY REQUEST", value: "Receipts or it didn’t happen." },
    { label: "THREAT MODEL", value: "Paranoid by design." },
  ];

  expectedStats.forEach(({ label, value }) => {
    assert.match(homepageScript, new RegExp(label.replace("/", "\\/")));
    assert.match(homepageScript, new RegExp(value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  });

  assert.doesNotMatch(homepageScript, /PRIVACY RATING|Hardcore|PER INFERENCE/);
});

test("proof and model copy avoid overclaims", () => {
  assert.match(
    homepageScript,
    /Every protected run emits attestation, key release, sealed execution, and receipt records\./,
  );
  assert.match(homepageScript, /Run leading open models inside a verifiable privacy boundary/);
  assert.doesNotMatch(
    homepageScript,
    /most robust solution|verify anything and everything|world's best open-source models|zero data exposure/i,
  );
});

test("current model shortlist has six sourced releases and dated availability", () => {
  const roster = homepageScript.split("const models = [")[1].split("const escapeHtml")[0];
  const titles = [...roster.matchAll(/title: "([^"]+)"/g)].map((match) => match[1]);
  assert.deepEqual(titles, ["GLM-5.3", "Kimi K3", "DeepSeek V4 Pro · 0813", "MiniMax M3", "GLM-5.3 Flash", "MiMo-V2.5-Pro"]);
  assert.equal((roster.match(/source: "https:\/\/huggingface\.co\//g) || []).length, 6);
  assert.match(roster, /2\.8T MoE \/ 104B active/);
  assert.match(roster, /320B MoE \/ 18B active/);
  assert.doesNotMatch(roster, /#1|83\.5|Kimi K2\.6|GLM-5\.1/);
  assert.match(homepageScript, /Model availability varies by private beta environment/);
  assert.match(homepageScript, /September 5, 2026/);
  assert.match(homepageScript, /Licenses vary by model/);
  assert.match(homepageScript, /escapeHtml\(item\.source\)/);
  assert.match(docsIndex, /<strong>GLM-5\.3<\/strong>/);
  assert.match(docsIndex, /https:\/\/huggingface\.co\/zai-org\/GLM-5\.3/);
});
