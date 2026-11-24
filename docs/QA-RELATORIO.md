# QA — Drª Carla Chaves (v1.0.0)

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

## Pendências

- Push/tag no GitHub depende de autenticação (`gh auth login`); o token colado no chat foi
  considerado comprometido e não deve ser reutilizado.
- Publicação no Google Sites é manual; aplicar alturas e testar na URL publicada.
- Confirmar autorização da cliente para expor fotos/vídeos em repositório público.
