import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distDir = path.join(root, "dist");
const EDGE = process.env.EDGE_PATH || "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
if (!fs.existsSync(EDGE)) {
  console.error("Edge nao encontrado em " + EDGE + " (defina EDGE_PATH).");
  process.exit(1);
}

const EMBEDS = [
  ["hero", "embed-hero.html"],
  ["social", "embed-prova-social.html"],
  ["beneficios", "embed-beneficios.html"],
  ["especialidades", "embed-exoticos-servicos.html"],
  ["sobre", "embed-sobre.html"],
  ["conteudo", "embed-guias-dicas.html"],
  ["duvidas", "embed-faq-cta.html"],
  ["contato", "embed-contato.html"],
];
const VIEWPORTS = [
  ["390", 390, 844],
  ["768", 768, 1024],
  ["1440", 1440, 900],
];
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
  ".woff": "font/woff",
  ".mp4": "video/mp4",
  ".pdf": "application/pdf",
  ".json": "application/json",
};

const server = http.createServer((req, res) => {
  const urlPath = decodeURIComponent((req.url || "/").split("?")[0]);
  const file = path.join(root, urlPath);
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

for (const [key, file] of EMBEDS) {
  for (const [vp, width, height] of VIEWPORTS) {
    const context = await browser.newContext({ viewport: { width, height }, reducedMotion: "reduce" });
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
    const page = await context.newPage();
    const errors = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    page.on("pageerror", (error) => errors.push(String(error)));

    await page.goto(`${base}/dist/${file}`, { waitUntil: "networkidle" });
    await page.waitForFunction(() => document.documentElement.classList.contains("is-ready"), null, { timeout: 5000 }).catch(() => {
      failures.push(`${key}/${vp}: is-ready nao foi aplicado`);
    });
    await page.evaluate(async () => {
      const step = Math.max(300, Math.round(innerHeight * 0.8));
      for (let y = 0; y <= document.body.scrollHeight; y += step) {
        scrollTo(0, y);
        await new Promise((resolve) => setTimeout(resolve, 60));
      }
      scrollTo(0, 0);
    });
    await page.waitForTimeout(250);

    const result = await page.evaluate(() => {
      const videos = [...document.querySelectorAll("video")];
      const wa = [...document.querySelectorAll('a[href*="wa.me"]')].map((a) => a.href);
      const insta = [...document.querySelectorAll('a[href*="instagram.com"]')].map((a) => a.href);
      const broken = [...document.images].filter((img) => img.complete && img.naturalWidth === 0).map((img) => img.getAttribute("src"));
      return {
        overflow: document.documentElement.scrollWidth > innerWidth + 1,
        header: !!document.querySelector(".site-header"),
        mobileBar: !!document.querySelector(".mobile-bar"),
        skip: !!document.querySelector(".skip-link"),
        footer: !!document.querySelector(".site-footer"),
        videos: videos.length,
        posters: videos.filter((v) => v.getAttribute("poster")).length,
        waInvalid: wa.filter((href) => !href.startsWith("https://wa.me/5521978778857")),
        instaInvalid: insta.filter((href) => !href.startsWith("https://www.instagram.com/vetcarlachaves/")),
        broken,
        bootVisible: (() => {
          const boot = document.querySelector("#mlcs-boot");
          if (!boot) return true;
          const style = getComputedStyle(boot);
          return style.visibility !== "hidden" && Number(style.opacity) !== 0;
        })(),
      };
    });

    const ignored = errors.filter((text) => !text.includes("favicon.ico"));
    if (ignored.length) failures.push(`${key}/${vp}: console -> ${ignored.join(" | ")}`);
    if (result.overflow) failures.push(`${key}/${vp}: scroll horizontal`);
    if (result.header) failures.push(`${key}/${vp}: header global presente`);
    if (result.mobileBar) failures.push(`${key}/${vp}: mobile-bar presente`);
    if (result.skip) failures.push(`${key}/${vp}: skip-link presente`);
    if (result.bootVisible) failures.push(`${key}/${vp}: boot loader visivel`);
    if (result.waInvalid.length) failures.push(`${key}/${vp}: WhatsApp invalido (${result.waInvalid.join(", ")})`);
    if (result.instaInvalid.length) failures.push(`${key}/${vp}: Instagram invalido (${result.instaInvalid.join(", ")})`);
    if (result.broken.length) failures.push(`${key}/${vp}: imagens quebradas (${result.broken.join(", ")})`);
    if (key === "conteudo" && (result.videos < 2 || result.posters < 2)) failures.push(`${key}/${vp}: videos/posters insuficientes`);
    if (key === "contato" && !result.footer) failures.push(`${key}/${vp}: rodape ausente`);

    console.log(`${key.padEnd(15)} ${vp.padStart(4)} ${result.overflow ? "overflow" : "ok"}`);
    await context.close();
  }
}

await browser.close();
await new Promise((resolve) => server.close(resolve));

if (failures.length) {
  console.error("\nQA: problemas encontrados");
  for (const item of [...new Set(failures)]) console.error("- " + item);
  process.exit(1);
}
console.log("\nQA OK: 8 embeds x 3 viewports sem erros");
