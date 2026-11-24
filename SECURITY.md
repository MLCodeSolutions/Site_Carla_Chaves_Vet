# Security Policy

## Escopo

Este repositório contém o site estático da Drª Carla Chaves (HTML/CSS/JS em `src/`, build em
`dist/`, assets públicos) publicado no Google Sites via jsDelivr. Não há backend, banco, login,
pagamento ou processamento de dados de usuários neste repositório.

## Reportar uma vulnerabilidade

Use o canal privado do GitHub:
`https://github.com/MLCodeSolutions/Site_Carla_Chaves_Vet/security/advisories/new`

Não abra issue pública com detalhes exploráveis, tokens ou dados pessoais. Inclua:
- arquivo/URL afetado;
- passos de reprodução;
- impacto;
- sugestão de correção (se houver).

## Práticas

- Repositório público (exigência do jsDelivr); nenhum segredo, `.env`, token ou credencial.
- Autenticação por `gh auth login`/Git Credential Manager; nunca token em chat, arquivo ou CI.
- SRI sha384 em CSS/JS, CSP sem `'unsafe-inline'` (exceto hash do boot loader).
- URLs fixas em tag imutável; proibido `@main` e `raw.githubusercontent.com` em produção.
- Sem `innerHTML`/`eval`; links externos com `https` e `rel="noopener noreferrer"`.
- Tags de release são imutáveis; rollback usa tag anterior.
- Dependabot para npm e GitHub Actions; revisar PRs antes do merge.

## Fora de escopo

Google Sites, jsDelivr, GitHub, navegadores, DNS/domínio e serviços de terceiros. O Google Sites
pode remover a meta CSP do embed; as demais mitigações (SRI, URLs fixas, zero inline, hash do
loader) continuam válidas.
