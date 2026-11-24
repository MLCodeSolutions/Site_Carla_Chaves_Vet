# QA — Drª Carla Chaves (v1.0.3)

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
- `v1.0.3` adiciona:
  - fechamento do menu em qualquer link interno, clique fora, `hashchange` e rolagem;
  - `overscroll-behavior: contain` no modo `embed.html` único para evitar scroll chaining;
  - modo app documentado: `embed.html` com altura **700–760 px** (menu funciona, rolagem interna).
- Teste local em iframe de 700 px: menu abriu, fechou no clique, rolou até Serviços
  (`scrollY=6814`), sem overflow horizontal.
- `v1.0.2` adicionou logo no loader via PNG base64 inline e `embed-conteudo.html` (um bloco sem
  header/menu). Fotos seguem no jsDelivr; `srcset`/`poster` absolutos desde a v1.0.1.

## Pendências

- No Google Sites, usar `embed.html` da v1.0.3 em um bloco de 700–760 px; publicar e testar na URL
  publicada (`docs/GOOGLE-SITES.md`).
- Revogar/rotacionar o token que circulou no chat; ele não foi gravado no repositório nem no
  remote do Git.
- Confirmar autorização da cliente para expor fotos/vídeos em repositório público.

