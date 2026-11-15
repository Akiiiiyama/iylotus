## Resumo

- **CSS variables** são a versão das variáveis do Figma dentro do código: o valor mora num lugar só e todo o resto chama pelo nome.
- Um código pode ficar **visualmente idêntico** ao design e mesmo assim não usar nenhum token. A diferença só aparece quando o design system muda.
- Para descobrir, cruze três coisas: **o que está ligado no Figma**, **o que está escrito no código** e **se os valores batem**.
- Quando a IA não recebe o nome do token, ela copia o valor e às vezes **inventa** cores e medidas que não existem no design system.
- Dá para conferir sem saber programar: **painel Fill e Dev Mode no Figma, busca no código e o Inspecionar do navegador.**

---

## 1. O que são CSS variables

No Figma, quando você pinta um botão com a variável `color/action/accent`, o botão guarda **o nome** da variável. O valor (`#c8102e`) mora num lugar só, o painel de variáveis. Se você troca o vermelho lá, todos os botões mudam.

No CSS é a mesma ideia, em dois passos:

```css
/* 1. Define uma vez, no :root (o "topo" da página) */
:root {
  --color-action-accent: #c8102e;
  --color-bg: #1c1c1c;
}

/* 2. Usa pelo nome em qualquer lugar */
.primary-button {
  background: var(--color-action-accent);
}
```

- `--color-action-accent` é a variável. O nome começa com dois hífens.
- `var(...)` é o jeito de chamar a variável, como colar o chip da variável no Fill em vez de digitar o hex.
- Por convenção, as barras do nome no Figma viram hífens no CSS: `color/action/accent` vira `--color-action-accent`.

Um **valor fixo** (em inglês, *hard-coded*) é o contrário: a cor ou medida escrita direto no código, como `background: #c8102e`. Hoje fica igual na tela, mas esse código nunca fica sabendo quando o design system muda.

## 2. Um exemplo real: o header do meu site

O header flutuante do meu portfólio é escrito só com variáveis do meu design system, o IY Lotus:

```css
.topbar__panel {
  border-radius: var(--radius-lg);
  background: color-mix(in srgb, var(--color-surface) 82%, transparent);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-2);
}
```

Nenhum hex aparece. É por isso que o botão de tema claro/escuro do site funciona: no modo escuro, o site redefine o valor de `--color-surface`, e tudo que usa essa variável troca junto, sem mexer em nenhum componente.

## 3. Como eu analisei o código gerado

Depois de gerar um protótipo em código com os code layers do Figma (o experimento está no guia [Protótipo como prompt](/pt/escritos/prototipo-como-prompt)), fiz esta análise em três passos.

1. **Vi o que estava ligado no Figma.** Listei, para cada camada, qual variável estava aplicada. Por exemplo: o fundo do botão Continuar em `color/action/accent`, o texto do botão em `color/action/on-accent`, o campo de e-mail em `color/surface-raised` com borda `color/border`. Anotei também o valor de cada variável no modo escuro: `color/bg = #1c1c1c`, `color/surface = #232323`, `color/border = #363636`.
2. **Procurei variáveis no código.** Busquei `var(--` e não achei nenhuma. Busquei `#` e achei dezenas de cores escritas direto: `#1c1c1c`, `#363636`, `#c8102e`.
3. **Cruzei os dois.** Cada hex do código bate exatamente com o valor de uma variável do Figma. Conclusão: a IA leu o valor da variável naquele momento e escreveu o número, deixando o nome para trás. E alguns hex não batem com nenhum token: esses foram inventados.

## 4. De × para: como saiu e como deveria ser

### Botão principal

Como saiu:

```jsx
className="bg-[#c8102e] hover:bg-[#dc1436] rounded-full h-14 text-[17px]"
```

Como deveria ser:

```jsx
className="bg-[var(--color-action-accent)] hover:bg-[var(--color-action-accent-hover)] rounded-[var(--radius-pill)]"
```

O `#dc1436` não existe no meu design system. O hover certo é `color/action/accent-hover`, que vale `#a80d27` e é **mais escuro**. Sem a referência, a IA inventou um vermelho mais claro.

### Menu flutuante

Como saiu:

```css
.floating-menu {
  border: 1px solid #363636;
  border-radius: 18px;
  background: rgba(35, 35, 35, 0.92);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.22);
  backdrop-filter: blur(8px);
}
```

Como deveria ser:

```css
.floating-menu {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: color-mix(in srgb, var(--color-surface) 82%, transparent);
  box-shadow: var(--shadow-2);
  backdrop-filter: blur(16px);
}
```

`rgba(35, 35, 35, ...)` é o mesmo `#232323` (`color/surface`), só escrito de outro jeito. E a opacidade veio 92%, não os 82% do design. O blur veio 8px, não 16px.

### Fonte

Como saiu:

```css
font-family: "DM Sans:Bold", sans-serif;
```

Como deveria ser:

```css
font-family: var(--font-family-sans); /* "DM Sans" */
font-weight: 700;
```

`"DM Sans:Bold"` é o nome interno que o Figma dá ao estilo. Nenhuma fonte instalada se chama assim, então o navegador cai no `sans-serif`, a fonte genérica do sistema. Visualmente parece "quase certo", e por isso passa despercebido.

### Fundo da tela

Como saiu:

```css
background: #1c1c1c;
```

Como deveria ser:

```css
background: var(--color-bg);
```

## 5. Por que isso importa

Imagine que amanhã você ajusta o vermelho do design system ou cria o modo claro do app.

| | Com variáveis | Com valores fixos |
|---|---|---|
| Mudar uma cor | Troca o valor no `:root` e o app inteiro acompanha | Procura cada `#c8102e` no código e troca à mão |
| Criar o modo claro | Redefine as variáveis, como o meu site faz | Reescreve todas as cores |
| Cores fora do sistema | Fáceis de ver, porque destoam dos nomes | Escondidas entre dezenas de hex |
| Conversa entre design e código | Os dois falam o mesmo nome: `color/surface` | O design fala `color/surface`, o código fala `#232323` |

É a mesma diferença entre usar a variável no Figma e digitar o hex direto no Fill: hoje fica igual, mas só um dos dois acompanha o design system.

## 6. Onde conferir

### No Figma

1. Selecione um elemento e olhe o painel **Fill**. Se aparece um chip com nome (`color/action/accent`), é variável. Se aparece só o hex (`C8102E`), é valor fixo.
2. No **Dev Mode**, na aba de inspeção, o trecho de código mostra os nomes das variáveis do que está selecionado.
3. Faça o mesmo com bordas, cantos e espaçamentos: eles também podem estar ligados a variáveis.

### No código

1. Busque por `var(--` (Ctrl+F ou Cmd+F). Zero resultados quer dizer que nenhum token chegou.
2. Busque por `#`. Cada resultado é uma cor fixa: confira se ela existe no seu design system.
3. Busque por `rgba(`. Às vezes a mesma cor aparece escrita em outro formato.
4. Busque por `font-family` e confira se o nome é o da fonte de verdade.

### No navegador

Funciona em qualquer site e no preview do protótipo gerado.

1. Clique com o botão direito no elemento e escolha **Inspecionar**.
2. Na aba **Styles**, veja se a propriedade mostra `var(--...)` ou um valor fixo.
3. Para a fonte, vá na aba **Computed** e role até o fim. A seção **Rendered Fonts** mostra a fonte que realmente foi desenhada. Se aparecer Helvetica ou Arial em vez de DM Sans, a fonte não carregou.

Uma dica: inspecione primeiro um site que você sabe que usa variáveis, como o seu próprio. Depois inspecione o código gerado. A diferença fica visível em segundos.

## 7. Como pedir para a IA usar os tokens

Peça explicitamente, com os nomes:

> Use CSS variables com os mesmos nomes das variáveis do Figma (por exemplo `--color-bg` e `--color-action-accent`) em vez de valores hex, e font-family "DM Sans" com font-weight.

E confira o resultado com os passos da seção 6. Pedir é o primeiro teste. Se não bastar, o próximo passo é entregar o design system para a IA de outra forma, como um arquivo de tokens no repositório.

## Para levar

Um código pode estar idêntico ao design e não ter nenhum pedaço do seu design system dentro dele. A tela não mostra isso. O código mostra.

Antes de chamar um resultado de design to code, faça uma busca por `var(--`. É a forma mais rápida de saber se o código vai acompanhar o seu design system ou se vai envelhecer sozinho.
