import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const port = Number(process.argv[2] || 8080);
const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".png": "image/png",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".mp4": "video/mp4",
  ".pdf": "application/pdf",
  ".json": "application/json",
  ".txt": "text/plain; charset=utf-8",
};

const embeds = [
  ["Hero", "embed-hero.html"],
  ["Depoimentos + Galeria", "embed-prova-social.html"],
  ["Benefícios", "embed-beneficios.html"],
  ["Exóticos + Serviços", "embed-exoticos-servicos.html"],
  ["Sobre", "embed-sobre.html"],
  ["Guias + Dicas", "embed-guias-dicas.html"],
  ["Dúvidas + CTA", "embed-faq-cta.html"],
  ["Contato + Rodapé", "embed-contato.html"],
];

const server = http.createServer((req, res) => {
  const url = decodeURIComponent((req.url || "/").split("?")[0]);
  if (url === "/") {
    res.writeHead(200, { "content-type": MIME[".html"] });
    res.end(
      `<!doctype html><meta charset="utf-8"><title>Drª Carla Chaves — preview</title>
<body style="font:16px/1.6 system-ui;background:#F7F4EA;color:#2F4A32;padding:2rem">
<h1>Preview local</h1>
<p><a href="/src/index.html">Fonte (/src/index.html)</a> · <a href="/dist/embed.html">Página inteira (/dist/embed.html)</a></p>
<h2>Embeds do Google Sites</h2>
<ul>${embeds.map(([label, file]) => `<li><a href="/dist/${file}">${label} (${file})</a></li>`).join("")}</ul>
</body>`,
    );
    return;
  }
  const file = path.join(root, url);
  if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    res.end("404");
    return;
  }
  res.writeHead(200, { "content-type": MIME[path.extname(file)] || "application/octet-stream" });
  fs.createReadStream(file).pipe(res);
});

server.listen(port, () => {
  console.log(`preview: http://localhost:${port}/  (fonte em /src, embeds em /dist)`);
});
