import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const EDGE = process.env.EDGE_PATH || "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
if (!fs.existsSync(EDGE)) {
  console.error("Edge nao encontrado em " + EDGE + " (defina EDGE_PATH).");
  process.exit(1);
}

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
  ".mp4": "video/mp4",
  ".pdf": "application/pdf",
  ".json": "application/json",
};
const server = http.createServer((req, res) => {
  const url = decodeURIComponent((req.url || "/").split("?")[0]);
  const file = path.join(root, url);
  if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    res.end("404");
    return;
  }
  res.writeHead(200, { "content-type": MIME[path.extname(file).toLowerCase()] || "application/octet-stream" });
  fs.createReadStream(file).pipe(res);
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const base = `http://127.0.0.1:${server.address().port}`;

const browser = await chromium.launch({ executablePath: EDGE, headless: true });
const failures = [];
const check = (ok, message) => { if (!ok) failures.push(message); };

async function routeCdn(context) {
  await context.route("https://cdn.jsdelivr.net/**", (route) => {
    const pathname = new URL(route.request().url()).pathname;
    const match = pathname.match(/@[^/]+\/(.+)$/);
    if (!match) { route.abort(); return; }
    const file = path.join(root, decodeURIComponent(match[1]));
    if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      route.fulfill({ status: 404, contentType: "text/plain", body: "404" });
      return;
    }
    route.fulfill({
      status: 200,
      contentType: MIME[path.extname(file).toLowerCase()] || "application/octet-stream",
      body: fs.readFileSync(file),
    });
  });
}

// ---------- Mobile: menu reabre, navega e fecha ----------
{
  const context = await browser.newContext({ viewport: { width: 390, height: 700 } });
  await routeCdn(context);
  const page = await context.newPage();
  const errors = [];
  page.on("console", (msg) => { if (msg.type() === "error") errors.push(msg.text()); });
  page.on("pageerror", (err) => errors.push(String(err)));

  await page.goto(`${base}/dist/embed.html`, { waitUntil: "networkidle" });
  await page.waitForFunction(() => document.documentElement.classList.contains("is-ready"));

  for (let i = 0; i < 3; i += 1) {
    await page.evaluate(() => document.querySelector(".burger").click());
    const open = await page.evaluate(() => document.querySelector("#menu-mobile").hasAttribute("data-open"));
    await page.evaluate(() => document.querySelector(".burger").click());
    const closed = await page.evaluate(() => !document.querySelector("#menu-mobile").hasAttribute("data-open"));
    check(open && closed, `ciclo ${i + 1}: menu nao abriu/fechou`);
  }

  await page.evaluate(() => document.querySelector(".burger").click());
  await page.evaluate(() => document.querySelector('#menu-mobile [data-embed-target="#servicos"]').click());
  await page.waitForTimeout(100);
  const mid = await page.evaluate(() => scrollY);
  await page.waitForTimeout(900);
  const end = await page.evaluate(() => ({
    open: document.querySelector("#menu-mobile").hasAttribute("data-open"),
    y: scrollY,
    top: document.querySelector("#servicos").getBoundingClientRect().top,
    overflow: document.documentElement.scrollWidth > innerWidth,
    visible: document.querySelectorAll("[data-reveal].is-visible").length,
  }));
  check(mid > 0, "scroll animado nao iniciou");
  check(!end.open, "menu continuou aberto apos navegar");
  check(end.y > mid, "scroll nao chegou ao destino");
  check(end.top >= 70 && end.top <= 120, `offset do destino inesperado: ${end.top}`);
  check(!end.overflow, "scroll horizontal no mobile");
  check(end.visible > 0, "animacoes de reveal nao ativaram");

  await page.evaluate(() => document.querySelector(".burger").click());
  check(await page.evaluate(() => document.querySelector("#menu-mobile").hasAttribute("data-open")), "menu nao reabriu apos navegar");
  await page.evaluate(() => document.querySelector(".hero-lede").click());
  check(await page.evaluate(() => !document.querySelector("#menu-mobile").hasAttribute("data-open")), "menu nao fechou no clique fora");
  await page.evaluate(() => document.querySelector(".burger").click());
  check(await page.evaluate(() => document.querySelector("#menu-mobile").hasAttribute("data-open")), "menu nao reabriu apos clique fora");

  const realErrors = errors.filter((text) => !text.includes("favicon.ico"));
  check(realErrors.length === 0, `console: ${realErrors.join(" | ")}`);
  await context.close();
}

// ---------- Reduced motion: sem reveal e scroll instantaneo ----------
{
  const context = await browser.newContext({ viewport: { width: 390, height: 700 }, reducedMotion: "reduce" });
  await routeCdn(context);
  const page = await context.newPage();
  await page.goto(`${base}/dist/embed.html`, { waitUntil: "networkidle" });
  await page.waitForFunction(() => document.documentElement.classList.contains("is-ready"));
  const reveal = await page.evaluate(() => document.documentElement.classList.contains("reveal-ready"));
  check(!reveal, "reveal-ready ativo com prefers-reduced-motion");
  await page.evaluate(() => document.querySelector(".burger").click());
  await page.evaluate(() => document.querySelector('#menu-mobile [data-embed-target="#servicos"]').click());
  await page.waitForTimeout(80);
  const end = await page.evaluate(() => ({ y: scrollY, top: document.querySelector("#servicos").getBoundingClientRect().top }));
  check(end.y > 0 && end.top >= 70 && end.top <= 120, "scroll com reduced motion nao foi instantaneo/correto");
  await context.close();
}

await browser.close();
await new Promise((resolve) => server.close(resolve));

if (failures.length) {
  console.error("QA APP: problemas encontrados");
  for (const item of [...new Set(failures)]) console.error("- " + item);
  process.exit(1);
}
console.log("QA APP OK: menu abre/fecha/reabre, scroll animado, reveal e reduced motion");
