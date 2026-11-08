# Estudos: React, Next.js e npm neste site

Um guia para entender como este site funciona, usando o próprio código como exemplo.

## Como rodar

Na raiz do repositório (`iylotus/`):

```bash
npm install
npm run dev
```

O `npm run dev` compila o design system (`tokens` → `styles` → `react`) e abre o site em http://localhost:3100.

## 1. npm: pacotes e workspaces

**npm** é o gerenciador de pacotes do JavaScript. Um pacote é uma pasta com um `package.json` que diz o nome, a versão, do que ele depende e quais comandos ele tem (`scripts`).

Este repositório é um **monorepo**: vários pacotes no mesmo lugar, ligados por **workspaces** (veja `workspaces` no `package.json` da raiz).

| Pasta | Pacote | O que é |
|---|---|---|
| `packages/tokens` | `@iylotus/tokens` | Os valores do design system em JSON |
| `packages/styles` | `@iylotus/styles` | Os tokens viram variáveis CSS (`--color-bg`, `--space-4`…) |
| `packages/react` | `@iylotus/react` | Componentes React: Button, Card, Switch… |
| `apps/site` | `site` | Este site |

O site declara `"@iylotus/react": "0.0.0"` como dependência. Como o pacote está no mesmo repositório, o npm cria um atalho para a pasta local, em vez de baixar da internet. Quando o design system for publicado no **npmjs.com**, qualquer projeto vai poder instalar com `npm i @iylotus/react`.

**Lição aprendida aqui:** o React precisa existir uma única vez. O site tinha a própria cópia (19.1.1) e o design system outra (19.3.1), e a página quebrava com `Cannot read properties of null (reading 'useContext')`. A correção foi pedir a mesma faixa de versão (`^19.1.0`) e rodar `npm dedupe`.

## 2. React: componentes

**React** é uma biblioteca para montar interfaces com **componentes**: funções que recebem dados (**props**) e devolvem a interface.

```tsx
// components/SectionHead.tsx
export function SectionHead({ label, counter, title }) {
  return (
    <header className="section-head">
      <div className="labels"><span>{label}</span><span>{counter}</span></div>
      <h2 className="headline"><span className="iy-lt">{title[0]}</span><span className="iy-bd">{title[1]}</span></h2>
    </header>
  );
}
```

O mesmo componente monta o cabeçalho de todas as seções, só mudando as props. É a ideia de componente do Figma, só que em código.

**Estado (`useState`) e efeitos (`useEffect`):** o `ThemeSwitch` guarda se o modo escuro está ligado (estado) e, ao montar, lê o tema atual do navegador (efeito). Quando o estado muda, o React redesenha só aquele pedaço.

## 3. Next.js: o framework em volta do React

**Next.js** organiza o projeto em páginas, gera o HTML e otimiza o que vai para o navegador.

- **Rotas por pasta:** `app/[lang]/page.tsx` vira `/en` e `/pt`. O `[lang]` é um parâmetro, e `generateStaticParams` diz quais valores existem.
- **Layout:** `app/[lang]/layout.tsx` envolve todas as páginas. É ali que entram as fontes, o CSS do design system e o script que aplica o tema antes da página aparecer (assim não pisca o tema errado).
- **Server e Client Components:** por padrão, os componentes rodam no servidor e chegam prontos como HTML. Quem precisa do navegador (estado, cliques, WebGL) começa com `'use client'`, como `Opening.tsx` e `ThemeSwitch.tsx`.
- **Geração estática:** no `npm run build`, as páginas `/en` e `/pt` viram HTML pronto. O site fica rápido e pode ser hospedado em qualquer lugar, inclusive na Vercel.

**Lição aprendida aqui:** componentes do design system que usam estado (Switch, Checkbox, Radio, Avatar) precisam de `'use client'` no próprio arquivo, senão o Next não consegue usá-los dentro de páginas do servidor.

## 4. O design system no site

- O site importa `@iylotus/styles` (tokens e temas) e `@iylotus/react/styles.css` (estilos dos componentes) no layout.
- As cenas escuras e a vermelha usam `data-theme="dark"` no próprio elemento. Assim os componentes dentro delas (botões, textos secundários) usam o tema escuro automaticamente, sem CSS extra.
- O CSS do site (`app/globals.css`) só compõe a página. Cores, espaços e curvas vêm sempre dos tokens.

## 5. A abertura em WebGL

`components/Opening.tsx` desenha a onda num **shader**: um pequeno programa que a placa de vídeo roda para cada pixel. Em vez de desenhar milhares de linhas, cada pixel calcula a distância até as bordas das lâminas de luz e acende de acordo. Foi isso que levou de 222 ms para cerca de 5 ms por quadro.

Ela toca só na primeira visita da sessão (`sessionStorage`), pode ser pulada (botão ou Esc) e não toca para quem pediu menos movimento no sistema.

## Próximos estudos

1. **TypeScript:** os tipos em `content/site.ts` (`Dict`, `Lang`) impedem esquecer um texto em um dos idiomas.
2. **Storybook:** `npm run storybook` mostra os componentes do design system isolados.
3. **Publicar no npm:** versões com Changesets e a organização `iylotus` no npmjs.com.
4. **Vercel:** hospedar o site gerado pelo `npm run build`.
