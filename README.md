# Fernando Ruan — portfólio

Landing page estática com os projetos em destaque do perfil
[fernando-ruans](https://github.com/fernando-ruans), publicada no GitHub Pages.

Sem framework, sem build, sem dependências: `index.html`, `styles.css` e
`app.js` são o site inteiro. O único JavaScript desenha o traçado de
osciloscópio do cabeçalho, de forma determinística a partir do tamanho de cada
repositório.

## Rodar localmente

```bash
python3 -m http.server 8000
```

Depois abra <http://localhost:8000>. Abrir o `index.html` direto pelo sistema de
arquivos também funciona, mas a servidor evita diferenças entre navegadores.

## Publicação

`.github/workflows/pages.yml` publica a pasta raiz em
`https://fernando-ruans.github.io` a cada push na `main`. O job de build copia
somente `index.html`, `styles.css`, `app.js` e `assets/` para `dist/` antes de
fazer o upload do artefato, então nenhum arquivo de desenvolvimento vai para o
site publicado.

## Estrutura

| Arquivo | Função |
| --- | --- |
| `index.html` | Conteúdo e marcação semântica |
| `styles.css` | Tokens, layout, responsivo e `prefers-reduced-motion` |
| `app.js` | Geração do traçado de osciloscópio |
| `assets/favicon.svg` | Ícone da aba |

## Licença

MIT.
