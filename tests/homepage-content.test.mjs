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

test("uses 10+ checks consistently and never reintroduces 30+ checks", () => {
  assert.match(homepageScript, /across 10\+ checks/i);
  assert.doesNotMatch(homepageScript, /30\+\s*checks/i);
});

test("normalizes all request CTAs to request a demo", () => {
  const labelSetMatch = homepageScript.match(/const CTA_LABELS = new Set\(\[([\s\S]*?)\]\);/);
  assert.ok(labelSetMatch, "CTA_LABELS set should exist");

  const labels = [...labelSetMatch[1].matchAll(/"([^"]+)"/g)].map((match) => match[1]);

  assert.ok(labels.includes("request a demo"));
  assert.ok(labels.includes("request demo"));
  assert.match(homepageScript, /element\.textContent = "Request a demo";/);
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
    "#root .lgx-hero-proof-card",
  ].forEach((selector) => {
    assert.match(selectorMatch[1], new RegExp(selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  });

  assert.doesNotMatch(selectorMatch[1], /#root \.lgx-proof-row/);
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
