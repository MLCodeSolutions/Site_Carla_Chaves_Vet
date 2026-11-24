# Publicar no Google Sites — Drª Carla Chaves

Pré-requisitos: repositório `MLCodeSolutions/Site_Carla_Chaves_Vet` público, tag `v1.0.4`
publicada e arquivos `dist/embed-*.html` gerados com `npm run build:release`.

> O Google Sites não hospeda HTML/CSS/JS próprios. Ele incorpora cada arquivo em um iframe
> ("Inserir → Incorporar → Código incorporado"). Cole o **conteúdo completo** de cada
> `dist/embed-*.html`; o CSS/JS/assets são carregados do jsDelivr na tag.

## 1. Antes de colar

1. Confirme no navegador (tag exata, sem `@main`):
   - `https://cdn.jsdelivr.net/gh/MLCodeSolutions/Site_Carla_Chaves_Vet@v1.0.4/dist/main.min.css`
   - `https://cdn.jsdelivr.net/gh/MLCodeSolutions/Site_Carla_Chaves_Vet@v1.0.4/dist/main.min.js`
   - uma imagem, uma fonte e `assets/videos/dicas-01.mp4`
2. Rode localmente `npm run build:release`, `npm run check`, `npm run sri` e `npm run heights`.
3. Publique a tag no GitHub antes de abrir o Google Sites (jsDelivr pode levar alguns minutos).

## 2. Configurações do site no Google Sites

- **Nome:** Drª Carla Chaves — Veterinária Domiciliar
- **Título da página:** Drª Carla Chaves • Veterinária Domiciliar
- **Descrição:** Atendimento veterinário domiciliar para cães, gatos e exóticos na Ilha do Governador (RJ).
- **Tema:** mínimo, sem header gigante; o site já tem o logo/dados dentro dos embeds.
- **Fundo da página:** `#F7F4EA` (creme) para emendar com os blocos.
- **Largura do conteúdo:** total, sem moldura/borda nos blocos incorporados.
- **Favicon:** `assets/favicon/favicon.png`
- **Imagem de compartilhamento:** `assets/img/og-carla-chaves.png` (1200×630)
- **URL:** use a URL padrão do Sites ou configure domínio próprio depois.
- **Menu nativo:** o menu do Sites **não navega para dentro dos iframes**. Use “Início” e “Contato”
  (ou páginas separadas). O menu de 8 âncoras do site original não é reproduzível dentro dos
  embeds.

## 3. Inserir os blocos

### 3.1 Opção um bloco com menu (modo app)

Use `dist/embed.html` e defina a altura do bloco em **700–760 px**:

- O site rola **dentro** do iframe; o menu abre, fecha ao clicar em qualquer link e navega pelas
  seções.
- Não use a altura total do conteúdo (~10.059 px) com este arquivo: sem rolagem interna, o menu
  não navega e sobra espaço branco.
- Se sobrar espaço branco, aumente um pouco; se houver rolagem dupla, reduza 20–40 px.
- `overscroll-behavior: contain` evita o scroll vazar para a página do Sites.

### 3.2 Opção um bloco sem menu interno

Use `dist/embed-conteudo.html`. Ele tem todas as seções + rodapé, sem header/menu/barra fixa.
Cole o conteúdo em **um único** bloco incorporado e ajuste a altura:

| Bloco | Altura 390 | Altura 768 | Altura 1440 |
|---|---:|---:|---:|
| Página inteira sem menu (`embed-conteudo`) | 17803 | 14091 | 10059 |

- O Google Sites usa uma altura fixa por bloco: no mobile o conteúdo é mais alto; no desktop,
  mais baixo. Escolha a coluna do dispositivo principal (ou aceite rolagem interna no outro).
- O menu nativo do Sites não navega para dentro do iframe; use Início/Contato ou páginas separadas.

### 3.3 Opção 8 blocos por seção (recomendado para alturas melhores)

Para cada linha: **Inserir → Incorporar → Código incorporado**, cole o conteúdo do arquivo,
remova bordas/moldura e ajuste a altura.

| # | Arquivo | Conteúdo | Altura 390 | Altura 768 | Altura 1440 |
|---|---|---|---:|---:|---:|
| 1 | `dist/embed-hero.html` | Hero | 1463 | 1222 | 881 |
| 2 | `dist/embed-prova-social.html` | Depoimentos + galeria | 3161 | 2938 | 1599 |
| 3 | `dist/embed-beneficios.html` | Benefícios | 1841 | 1843 | 1083 |
| 4 | `dist/embed-exoticos-servicos.html` | Exóticos + serviços | 2747 | 1687 | 1704 |
| 5 | `dist/embed-sobre.html` | Sobre | 1818 | 1554 | 1076 |
| 6 | `dist/embed-guias-dicas.html` | Guias + dicas em vídeo | 4479 | 3140 | 1677 |
| 7 | `dist/embed-faq-cta.html` | Dúvidas + CTA | 1876 | 1631 | 1772 |
| 8 | `dist/embed-contato.html` | Contato + rodapé | 1021 | 681 | 285 |

Observação: o Google Sites usa **uma altura fixa por bloco** e não redimensiona o iframe.
- Se o público principal é mobile, use a coluna 390 (sem scroll interno no celular; sobra espaço no desktop).
- Se é desktop, use a coluna 1440 (no mobile pode haver scroll interno).
- O `dist/embed.html` é apenas contingência (página inteira com header/barra fixa); evite por causa
  da rolagem dupla.

## 4. SEO nativo (o embed é ignorado)

O Google Sites ignora `title`, `meta description`, Open Graph, canonical, favicon e JSON-LD do
iframe. Configure no próprio Sites:

1. Nome, descrição curta e URL amigável.
2. Favicon e imagem de compartilhamento.
3. Um H1/texto curto nativo no topo, sem duplicar o H1 do embed.
4. Menu/estrutura de páginas.
5. Search Console: adicione a URL publicada e solicite indexação.
6. Perfil da Empresa no Google: nome, categoria, área de atendimento, site e WhatsApp.

## 5. Publicar e testar

1. Publique com visibilidade **“Qualquer pessoa”**.
2. Abra a URL publicada (não o preview do editor) em Chrome desktop, Safari iOS e Chrome Android.
3. Confira:
   - CSS/JS/fontes/imagens/vídeos do jsDelivr sem 404;
   - console sem erro de SRI/CSP/404;
   - vídeos tocam e os posters aparecem;
   - links de WhatsApp e Instagram abrem;
   - FAQ abre/fecha;
   - sem rolagem horizontal;
   - teclado, foco visível e `prefers-reduced-motion`;
   - altura dos blocos sem corte (ajuste se o Sites adicionar espaçamento).
4. Se o Google Sites remover a meta CSP do embed, registre no QA; SRI, hash do loader e URLs
   fixas continuam valendo.

## 6. Atualizações

Qualquer mudança em copy, CSS, JS, imagens ou vídeos exige:

1. Editar `src/`/`assets/` (nunca `dist/`).
2. Rodar build/check/sri/heights/qa.
3. `npm run build:release` com a **nova tag** (`v1.0.4`, `v1.1.0`, ...).
4. Commit do `dist/`, tag e push.
5. Recolar **todos** os blocos no Sites (o hash/tag mudou) e reaplicar as alturas.
