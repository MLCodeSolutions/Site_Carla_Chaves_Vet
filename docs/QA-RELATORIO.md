# QA — Drª Carla Chaves (v1.0.1)

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
- `v1.0.0` publicada inicialmente; **v1.0.1** corrige `srcset`/`poster` que ficavam relativos
  (`../assets/...`) no build de release e impediam as fotos de carregar no Google Sites.
- Fotos confirmadas em `assets/img` no GitHub e no jsDelivr (`carla-chaves-hero*.jpg`,
  `carla-chaves-sobre*.jpg`, logos e OG).
- Build v1.0.1: `srcset` das fotos e `poster` dos vídeos agora apontam para
  `https://cdn.jsdelivr.net/gh/MLCodeSolutions/Site_Carla_Chaves_Vet@v1.0.1/assets/...`.
- Após publicar a tag v1.0.1, recolocar **todos os 8 blocos** no Google Sites.

## Pendências

- Publicação no Google Sites é manual (não há API/credencial): colar os 8 embeds da v1.0.1,
  aplicar as alturas e testar na URL publicada (`docs/GOOGLE-SITES.md`).
- Revogar/rotacionar o token que circulou no chat; ele não foi gravado no repositório nem no
  remote do Git.
- Confirmar autorização da cliente para expor fotos/vídeos em repositório público.

