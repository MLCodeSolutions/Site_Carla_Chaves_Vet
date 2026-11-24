# Drª Carla Chaves — Veterinária Domiciliar

Site da Drª Carla Chaves empacotado para o **Google Sites** via **GitHub + jsDelivr**.
A página vive no Google Sites; os 8 blocos de seção são HTML incorporado servido pela tag
imutável do jsDelivr. O site **não** é publicado por GitHub Pages.

- Repositório: `MLCodeSolutions/Site_Carla_Chaves_Vet` (público)
- Tag de produção: `v1.0.0` (publicada; validada no jsDelivr)
- Página inteira (contingência): `dist/embed.html`
- Blocos recomendados: 8 arquivos `dist/embed-*.html`
- Falta apenas colar os 8 blocos no Google Sites e publicar (`docs/GOOGLE-SITES.md`).

## Como funciona

```text
src/index.html + src/css/* + src/js/*
        │
        └── npm run build            → dist/ local (caminhos relativos)
        └── npm run build:release    → dist/ com URLs do jsDelivr + SRI/CSP
                                               │
                                               └── HTML colado no Google Sites
```

- Fonte única em `src/`. Nunca edite `dist/` à mão: ele é gerado e apagado a cada build.
- A tag é imutável. Nunca use `@main` nem `raw.githubusercontent.com` em produção.
- CSS/JS têm **SRI sha384** e os embeds têm **CSP** com hash do boot loader.

## Comandos

| Comando | O que faz |
|---|---|
| `npm ci` | Instala as versões do lockfile (Node ≥ 20). |
| `npm run build` | Gera `dist/` local para preview. |
| `npm run build:release` | Gera `dist/` com URLs absolutas da tag `v1.0.0`. |
| `npm run preview` | Sobe `http://localhost:8080/` para preview. |
| `npm run check` | Valida fonte, assets, CSP/SRI/loader, embeds e alturas. |
| `npm run sri` | Confere os hashes sha384 nos 9 HTML. |
| `npm run heights` | Mede as 8 seções em 390/768/1440 (usa Edge/`EDGE_PATH`). |
| `npm run qa:embeds` | QA headless dos 8 embeds em 3 viewports. |

## Embed(s) do Google Sites

| # | Arquivo | Conteúdo |
|---|---|---|
| 1 | `dist/embed-hero.html` | Hero |
| 2 | `dist/embed-prova-social.html` | Depoimentos + galeria |
| 3 | `dist/embed-beneficios.html` | Benefícios |
| 4 | `dist/embed-exoticos-servicos.html` | Exóticos + serviços |
| 5 | `dist/embed-sobre.html` | Sobre |
| 6 | `dist/embed-guias-dicas.html` | Guias + dicas em vídeo |
| 7 | `dist/embed-faq-cta.html` | Dúvidas + CTA |
| 8 | `dist/embed-contato.html` | Contato + rodapé |

Alturas medidas (px) em `tools/heights.json`:

| Seção | 390 px | 768 px | 1440 px |
|---|---:|---:|---:|
| Hero | 1463 | 1222 | 881 |
| Depoimentos + Galeria | 3161 | 2938 | 1599 |
| Benefícios | 1841 | 1843 | 1083 |
| Exóticos + Serviços | 2747 | 1687 | 1704 |
| Sobre | 1818 | 1554 | 1076 |
| Guias + Dicas | 4479 | 3140 | 1677 |
| Dúvidas + CTA | 1876 | 1631 | 1772 |
| Contato + Rodapé | 1021 | 681 | 285 |

O Google Sites não redimensiona iframe automaticamente: use o valor do viewport principal
(ou o maior, sem scroll interno no mobile). O passo a passo está em `docs/GOOGLE-SITES.md`.

## Estrutura

```text
src/
  index.html          página única (fonte)
  css/                main.css + módulos (tokens, base, layout, componentes, animações, ícones)
  js/                 main.js (entrada) + site-config.js + app.js
assets/               logo, fotos, vídeos/posters, PDFs, fontes, favicon, OG
tools/
  build.mjs           bundle CSS/JS, CSP/SRI, loader e 9 HTML
  check.mjs           validações de fonte/assets/embeds/heights
  sri.mjs             confere sha384
  heights.mjs         mede alturas com Edge
  qa-embeds.mjs       QA headless dos embeds
  preview.mjs         preview local
  site/               geradores auxiliares (PDFs e OG)
docs/
  GOOGLE-SITES.md     passo a passo de publicação
  PUBLICAR.md         checklist curto
  QA-RELATORIO.md     último resultado dos gates
dist/                 gerado; commitado na tag
```

## Atualizar conteúdo e assets

- Textos/estrutura: `src/index.html` (não renomeie IDs de seção sem ajustar `tools/build.mjs`).
- Contatos: `src/js/site-config.js`.
- Cores/tipografia: `src/css/tokens.css`.
- Fotos: `assets/img/carla-chaves-hero*.jpg` e `carla-chaves-sobre*.jpg`.
- Vídeos: `assets/videos/` (posters + MP4).
- PDFs: `assets/ebooks/` (gerador em `tools/site/make-pdfs.mjs`).
- Imagem OG: `assets/img/og-carla-chaves.png` (fonte em `tools/site/og.html`).

## Release

1. Rode `npm ci`, `npm run build`, `npm run check`, `npm run sri`, `npm run heights` e `npm run qa:embeds`.
2. `npm run build:release`.
3. Commit da fonte + `dist/`; tag anotada `v1.0.0`; push de `main` e da tag (requer `gh auth login`).
4. Valide CSS/JS/assets no jsDelivr com a tag exata.
5. Cole os embeds no Google Sites e publique (veja `docs/GOOGLE-SITES.md`).
6. Em qualquer mudança de CSS/JS, gere nova tag e recole todos os blocos.

## Segurança

- Repo público (jsDelivr não serve repo privado). Não coloque tokens, `.env` ou credenciais.
- Nunca use o token em chat/arquivo; use `gh auth login`/Git Credential Manager.
- SRI sha384, CSP sem `unsafe-inline` (exceto hash do loader), sem `@main`/raw e sem `innerHTML`.
- O Google Sites pode remover a meta CSP; as mitigações restantes continuam válidas.
