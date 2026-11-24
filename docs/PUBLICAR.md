# Checklist de publicação — Drª Carla Chaves

Guia detalhado: `docs/GOOGLE-SITES.md`.

## Gates locais

```bash
npm ci
npm run build
npm run check
npm run sri
npm run heights
npm run qa:embeds
```

Todos devem terminar sem erro. `heights` e `qa:embeds` usam Edge em
`C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe` (ou `EDGE_PATH`).

## Release

```bash
npm run build:release
```

- Confirme que `dist/embed.html` e os 8 `dist/embed-*.html` foram gerados.
- Commit da fonte + `dist/`; tag anotada `v1.0.2`; push de `main` e da tag.
- Não edite `dist/` à mão.

## GitHub

- Repo público `MLCodeSolutions/Site_Carla_Chaves_Vet`.
- `gh auth login` (nunca use token em chat/arquivo).
- Tag imutável; nunca use `@main` ou `raw.githubusercontent.com`.

## jsDelivr

- `https://cdn.jsdelivr.net/gh/MLCodeSolutions/Site_Carla_Chaves_Vet@v1.0.2/dist/main.min.css`
- `.../dist/main.min.js`
- `.../dist/embed-hero.html` (e demais embeds)
- `.../assets/img/og-carla-chaves.png`, `.../assets/videos/dicas-01.mp4`, PDFs e fontes.

## Google Sites

- Fundo `#F7F4EA`, tema mínimo, largura total, sem borda nos blocos.
- 8 blocos na ordem e alturas da tabela de `docs/GOOGLE-SITES.md`.
- Favicon e OG nativos; menu enxuto.
- Publicar como “Qualquer pessoa”; testar a URL publicada em Chrome, Safari iOS e Android.
