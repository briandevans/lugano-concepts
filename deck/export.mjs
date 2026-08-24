import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const outDir = join(root, "export");
mkdirSync(outDir, { recursive: true });

const html = pathToFileURL(join(root, "index.html")).href + "?export=1";

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1920, height: 1080 },
  deviceScaleFactor: 2,
});

await page.goto(html, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(400);

const slides = page.locator(".slide");
const count = await slides.count();
const paths = [];

for (let i = 0; i < count; i += 1) {
  const n = String(i + 1).padStart(2, "0");
  const path = join(outDir, `slide-${n}.png`);
  await slides.nth(i).screenshot({ path, type: "png" });
  paths.push(path);
  console.log("wrote", path);
}

const pdfPath = join(outDir, "Royal_AI_Group_Founding_SAFE.pdf");
await page.pdf({
  path: pdfPath,
  width: "1920px",
  height: "1080px",
  printBackground: true,
  pageRanges: `1-${count}`,
  preferCSSPageSize: true,
});
console.log("wrote", pdfPath);

await browser.close();
