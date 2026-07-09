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

test("normalizes all request CTAs to request briefing", () => {
  const labelSetMatch = homepageScript.match(/const CTA_LABELS = new Set\(\[([\s\S]*?)\]\);/);
  assert.ok(labelSetMatch, "CTA_LABELS set should exist");

  const labels = [...labelSetMatch[1].matchAll(/"([^"]+)"/g)].map((match) => match[1]);

  assert.ok(labels.includes("request a demo"));
  assert.ok(labels.includes("request demo"));
  assert.match(homepageScript, /const CTA_LABEL_TEXT = "Request briefing";/);
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

test("brand mark and favicon use the magenta Lugano mark", () => {
  assert.equal(logoMarkWebp.subarray(0, 4).toString("ascii"), "RIFF");
  assert.equal(logoMarkWebp.subarray(8, 12).toString("ascii"), "WEBP");
  assert.match(logoMark, /viewBox="0 0 1920 1920"/);
  assert.match(logoMark, /fill="#E11BDD" fill-opacity="0\.25"/);
  assert.match(logoMark, /x="584" y="469" width="395" height="434"/);
  assert.match(logoMark, /x="1032" y="964" width="395" height="434"/);
  assert.match(
    homepageIndex,
    /<link rel="icon" type="image\/webp" href="\.\/logo-mark\.webp\?v=brand-manus-parity-20260622" \/>/,
  );
  assert.match(
    homepageIndex,
    /homepage-sections\.css\?v=editorial-proof-hero-preview-20260709/,
  );
  assert.match(
    homepageIndex,
    /homepage-sections\.js\?v=editorial-proof-hero-preview-20260709/,
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
  assert.doesNotMatch(homepageScript, /proofSection\.id = "lugano-proof-ledger";/);
  assert.doesNotMatch(homepageScript, /hero\.insertAdjacentElement\("afterend", proofSection\);/);
  assert.match(
    homepageStyles,
    /#root section\.flex-col\.justify-between:first-of-type\.lgx-hero-editorial/,
  );
  assert.match(homepageStyles, /\.lgx-hero-editorial \.lgx-hero-proof-card/);
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

test("GLM-5.2 is the top listed model without expanding the roster", () => {
  assert.match(homepageScript, /title: "GLM-5\.2"/);
  assert.match(homepageScript, /specs: "1M context \/ 128K output"/);
  assert.doesNotMatch(homepageScript, /title: "DeepSeek V4 Flash"/);

  assert.match(
    docsIndex,
    /<span class="model-rank">01<\/span>\s*<span class="model-name"><strong>GLM-5\.2<\/strong><span>Z AI<\/span><\/span>/,
  );
  assert.match(docsIndex, /https:\/\/docs\.z\.ai\/guides\/llm\/glm-5\.2/);
  assert.doesNotMatch(docsIndex, /Voxtral TTS Open Weights/);
});
