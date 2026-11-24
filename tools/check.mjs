import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const srcDir = path.join(root, "src");
const distDir = path.join(root, "dist");
const errors = [];
const fail = (message) => errors.push(message);

const read = (file) => fs.readFileSync(file, "utf8");
const exists = (file) => fs.existsSync(file) && fs.statSync(file).isFile();

const source = read(path.join(srcDir, "index.html"));
const jsFiles = fs.readdirSync(path.join(srcDir, "js")).filter((f) => f.endsWith(".js"));
const cssFiles = fs.readdirSync(path.join(srcDir, "css")).filter((f) => f.endsWith(".css"));

// ---------- Fonte ----------
if (!source.includes('<link rel="stylesheet" href="css/main.css">')) fail("src/index.html sem link css/main.css");
if (!source.includes('<script type="module" src="js/main.js"></script>')) fail("src/index.html sem entrada js/main.js");
if (!source.includes('id="cta"')) fail("src/index.html sem id=cta na secao final");
if (/<style\b/i.test(source)) fail("src/index.html contem <style> inline");
if (/\sstyle\s*=/.test(source)) fail("src/index.html contem style= inline");
if (/onerror\s*=/.test(source)) fail("src/index.html contem onerror=");
if (/https?:\/\/cdn\.jsdelivr\.net\/gh\/[^@]+@main/.test(source)) fail("src/index.html usa @main");
if (/raw\.githubusercontent\.com/.test(source)) fail("src/index.html usa raw.githubusercontent.com");

const ids = [...source.matchAll(/<section\b[^>]*\bid="([^"]+)"/g)].map((m) => m[1]);
if (new Set(ids).size !== ids.length) fail("IDs de secao duplicados: " + ids.join(", "));

const forbidden = [
  "VetCasa", "vetcasa", "ML Code Solutions",
  "5511912345678", "(11) 91234-5678", "CRMV 00000", "VETCASA10",
  "@main", "raw.githubusercontent.com",
];
for (const text of [source, ...jsFiles.map((f) => read(path.join(srcDir, "js", f))), ...cssFiles.map((f) => read(path.join(srcDir, "css", f)))]) {
  for (const term of forbidden) {
    if (text.toLowerCase().includes(term.toLowerCase())) fail(`Texto proibido encontrado: ${term}`);
  }
}
for (const file of jsFiles) {
  const js = read(path.join(srcDir, "js", file));
  if (/innerHTML|insertAdjacentHTML|document\.write|eval\(/.test(js)) fail(`src/js/${file} usa innerHTML/eval/document.write`);
}

// ---------- Assets citados ----------
const htmlAssets = new Set();
for (const match of source.matchAll(/(?:src|href)="\.\.\/assets\/([^"?#]+)"/g)) htmlAssets.add(match[1]);
for (const match of source.matchAll(/srcset="([^"]+)"/g)) {
  for (const part of match[1].split(",")) {
    const url = part.trim().split(/\s+/)[0];
    if (url.startsWith("../assets/")) htmlAssets.add(url.slice("../assets/".length));
  }
}
for (const asset of htmlAssets) if (!exists(path.join(root, "assets", asset))) fail(`Asset ausente: assets/${asset}`);

const cssAssets = new Set();
for (const file of cssFiles) {
  const css = read(path.join(srcDir, "css", file));
  for (const match of css.matchAll(/url\(["']?\.\.\/\.\.\/assets\/([^"')]+)["']?\)/g)) cssAssets.add(match[1]);
}
for (const asset of cssAssets) if (!exists(path.join(root, "assets", asset))) fail(`Fonte/asset CSS ausente: assets/${asset}`);

// ---------- Dist ----------
const expected = [
  "embed-hero.html", "embed-prova-social.html", "embed-beneficios.html",
  "embed-exoticos-servicos.html", "embed-sobre.html", "embed-guias-dicas.html",
  "embed-faq-cta.html", "embed-contato.html",
];
for (const file of ["embed.html", ...expected]) if (!exists(path.join(distDir, file))) fail(`dist/${file} ausente (rode npm run build)`);
for (const file of ["main.min.css", "main.min.js", "integrity.json"]) if (!exists(path.join(distDir, file))) fail(`dist/${file} ausente`);

if (fs.existsSync(path.join(distDir, "integrity.json"))) {
  const integrity = JSON.parse(read(path.join(distDir, "integrity.json")));
  for (const file of ["main.min.css", "main.min.js"]) {
    if (!integrity[file]) fail(`integrity.json sem ${file}`);
    if (integrity[file] && !/^sha384-[A-Za-z0-9+/]+=*$/.test(integrity[file])) fail(`hash invalido para ${file}`);
    if (exists(path.join(distDir, file)) && integrity[file]) {
      const actual = "sha384-" + crypto.createHash("sha384").update(fs.readFileSync(path.join(distDir, file))).digest("base64");
      if (actual !== integrity[file]) fail(`integrity.json desatualizado para ${file}`);
    }
  }
}

for (const file of expected) {
  const target = path.join(distDir, file);
  if (!exists(target)) continue;
  const html = read(target);
  if (!html.includes('data-embed-mode="section"')) fail(`${file}: modo secao ausente`);
  if (!html.includes('data-embed-section=')) fail(`${file}: data-embed-section ausente`);
  if (!html.includes('<main id="conteudo">')) fail(`${file}: main#conteudo ausente`);
  if (!/integrity="sha384-/.test(html)) fail(`${file}: SRI ausente`);
  if (!html.includes('crossorigin="anonymous"')) fail(`${file}: crossorigin ausente`);
  if (!/Content-Security-Policy/.test(html)) fail(`${file}: CSP ausente`);
  if (/'unsafe-inline'/.test(html)) fail(`${file}: unsafe-inline na CSP`);
  if (!html.includes("style-src 'self' https://cdn.jsdelivr.net")) fail(`${file}: style-src inesperado`);
  if (!html.includes("script-src 'self' https://cdn.jsdelivr.net")) fail(`${file}: script-src inesperado`);
  if (/raw\.githubusercontent\.com|@main/.test(html)) fail(`${file}: URL movel/raw no embed`);
  if (/class="site-header"/.test(html)) fail(`${file}: header global presente`);
  if (/class="mobile-bar"/.test(html)) fail(`${file}: mobile-bar presente`);
  if (/class="skip-link"/.test(html)) fail(`${file}: skip-link presente`);
  if (Buffer.byteLength(html) > 80 * 1024) fail(`${file}: ${(Buffer.byteLength(html) / 1024).toFixed(1)} KB > 80 KB`);
  if (file === "embed-contato.html" && !html.includes('class="site-footer"')) fail("embed-contato.html sem rodape");
  if (file === "embed-guias-dicas.html" && !/<video\b/.test(html)) fail("embed-guias-dicas.html sem video");

  const styles = [...html.matchAll(/<style[^>]*data-mlcs-boot[^>]*>([\s\S]*?)<\/style>/g)];
  if (styles.length !== 1) fail(`${file}: esperado 1 style do loader, encontrado ${styles.length}`);
  if (styles.length === 1) {
    const hash = "sha256-" + crypto.createHash("sha256").update(styles[0][1]).digest("base64");
    if (!html.includes(hash)) fail(`${file}: hash do loader ausente na CSP`);
  }
}

// ---------- Alturas ----------
const heightsFile = path.join(root, "tools", "heights.json");
if (!exists(heightsFile)) {
  fail("tools/heights.json ausente (rode npm run heights)");
} else {
  const heights = JSON.parse(read(heightsFile)).sections || {};
  for (const key of ["hero", "social", "beneficios", "especialidades", "sobre", "conteudo", "duvidas", "contato"]) {
    const row = heights[key];
    if (!row) { fail(`heights.json sem ${key}`); continue; }
    for (const vp of ["390", "768", "1440"]) {
      if (!(row[vp] > 0)) fail(`heights.json ${key}/${vp} invalido`);
    }
  }
}

if (errors.length) {
  console.error("CHECK: problemas encontrados");
  for (const error of [...new Set(errors)]) console.error("- " + error);
  process.exit(1);
}
console.log(`CHECK OK: fonte, assets, CSP/SRI/loader, ${expected.length} embeds e heights`);
