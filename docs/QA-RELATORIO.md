# QA — Drª Carla Chaves (v1.0.5)

Data: 2026-11-24

## Gates executados

| Gate | Resultado |
|---|---|
| `npm ci` | OK (47 pacotes, 0 vulnerabilidades) |
| `npm run build` | OK — `embed.html` 35,3 KB; 8 embeds; CSS 20 KB gzip; JS 1,3 KB gzip |
| `npm run check` | OK — fonte, assets, CSP/SRI/loader, 8 embeds e heights |
| `npm run sri` | OK — hashes conferem nos 9 HTML |
| `npm run heights` | OK — 8 seções × 390/768/1440 |
| `npm run qa:embeds` | OK — 8 embeds × 3 viewports, sem erro de console |

## O que foi validado

- Nenhum header/mobile-bar/skip-link dentro dos embeds.
- WhatsApp (`5521978778857`) e Instagram (`@vetcarlachaves`) corretos.
- Vídeos da seção Dicas com controles e posters (CSP `media-src` liberado).
- FAQ, rodapé e rodapé no bloco Contato.
- Sem scroll horizontal em 390/768/1440.
- Boot loader esconde após `is-ready` e tem fallback de 8s.
- SRI sha384 + CSP sem `'unsafe-inline'` (somente hash do loader).
- Nenhum `VetCasa`, telefone antigo ou CRMV placeholder na fonte/embeds.

## Publicação

- Repositório público: `https://github.com/MLCodeSolutions/Site_Carla_Chaves_Vet`
- `v1.0.5`:
  - corrige a reabertura do menu (remove fechamento por `scroll`, `stopPropagation` no burger);
  - adiciona rolagem animada (~350–650 ms) no modo app via rAF + `window.scrollTo`, com cancelamento
    por wheel/touch e sem mover o frame do Google Sites;
  - adiciona reveal suave, underline do menu, drop do menu, hover lift e destaque da seção alvo;
  - `qa:app` valida 3 ciclos abrir/fechar/reabrir, scroll animado, reveal e `prefers-reduced-motion`.
- `v1.0.4` corrige o deslocamento no desktop:
  - links internos do header/menu deixam de ter `href="#..."` no modo app;
  - navegação usa `window.scrollTo` imediato (sem `scrollIntoView`/smooth), restrito ao iframe;
  - validado no site publicado: clicar em Dicas mantém `iframeY=0`/`pageScroll=0`, header do site
    no topo (`top=0`) e seção a 95,7 px (abaixo do header sticky).
- `v1.0.3` fechava o menu em qualquer link/clique fora/rolagem e adicionava `overscroll-behavior`.
- `v1.0.2` adicionou logo no loader via PNG base64 inline e `embed-conteudo.html` (sem menu).
- Fotos seguem no jsDelivr; `srcset`/`poster` absolutos desde a v1.0.1.

## Pendências

- No Google Sites, usar `embed.html` da v1.0.5 em um bloco de 700–760 px; publicar e testar na URL
  publicada (`docs/GOOGLE-SITES.md`).
- Revogar/rotacionar o token que circulou no chat; ele não foi gravado no repositório nem no
  remote do Git.
- Confirmar autorização da cliente para expor fotos/vídeos em repositório público.

