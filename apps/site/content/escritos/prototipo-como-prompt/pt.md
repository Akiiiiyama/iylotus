## Resumo

- Desde 3 de novembro de 2026, quando você cria um **code layer** a partir de frames no Figma Design, o agente **lê as conexões e as interações do protótipo** entre essas telas. Os code layers estão em beta aberto.
- Testei o mesmo fluxo (Login → Home, em dark mode, com o meu design system) de dois jeitos: **só com prompt** e **com as conexões do protótipo e um prompt de uma linha**.
- A navegação funcionou nos dois. Com as conexões, ele **não esqueceu interações** e ainda **criou um estado de erro** que eu não tinha desenhado.
- Nos dois casos, **nenhuma variável do design system chegou no código**: as cores viraram valores fixos, apareceram cores inventadas e a fonte veio com um nome que o navegador não reconhece.
- O protótipo funciona muito bem como prompt **para o comportamento**. Para o **design system**, ainda é preciso pedir.

---

## 1. O que mudou

Antes, para gerar um protótipo em código a partir de telas, a gente descrevia o fluxo no prompt: "ao tocar em Entrar, vá para a Home". Agora, se as telas já têm conexões de protótipo (o *On click → Navigate to* da aba Prototype), o agente usa essas conexões como contexto.

A promessa da [release note](https://www.figma.com/release-notes/) é passar menos tempo escrevendo prompt para as partes complexas do fluxo e mais tempo refinando o protótipo e encontrando casos extremos.

Para o designer, isso muda o peso do protótipo: ele deixa de ser só a etapa de validar e passa a ser **o briefing do código**. Quanto mais completo, menos é preciso explicar.

## 2. O experimento

**As telas:** Login e Home, mobile (393 × 852), em dark mode, montadas com componentes, variáveis e estilos de texto do meu design system.

- **Login:** logo, título, campo de e-mail, botão "Continuar", "ou", botões de Google e Apple, termos no rodapé.
- **Home:** busca, valor em destaque com degradê neutro, ações rápidas, card de recentes e menu flutuante.
- **Conexões:** "Continuar" leva para a Home com Smart Animate (300 ms). O avatar da Home volta para o Login.

**A única variável do teste:** como o code layer recebe o fluxo.

| | Teste A | Teste B |
|---|---|---|
| Conexões de protótipo | Removidas | Mantidas |
| Prompt | Detalhado, explicando o fluxo | Uma linha |

Prompt do teste A:

> Transforme essas duas telas num protótipo funcional. Ao tocar em Continuar no Login, vá para a Home com uma transição suave. Ao tocar no avatar da Home, volte para o Login. Mantenha as cores, fontes, espaçamentos e o menu flutuante como no design.

Prompt do teste B:

> Transforme essas telas num protótipo funcional.

## 3. Como repetir o teste

1. **Defina antes o que é "pronto".** Por exemplo: a navegação vai e volta, e o visual fica fiel ao Figma. Sem isso, você não sabe quando parar de corrigir.
2. **Duplique as telas em cópias limpas**, uma por rodada: A1, A2, B1, B2. Rodar cada teste duas vezes ajuda, porque a IA não responde igual sempre.
3. **Nas cópias A, apague as conexões** na aba Prototype e confira no modo Prototype que não sobrou nenhuma seta.
4. **Gere o code layer** selecionando as duas telas, com o prompt do teste.
5. **Cronometre e anote** cada prompt de correção até chegar no "pronto".
6. **Compare** com a tabela da próxima seção e **leia o código**, não só o preview.
7. **Grave a tela.** O momento em que o teste B navega sem você explicar nada é o melhor material para mostrar o resultado.

## 4. O que aconteceu

| Critério | A: só prompt | B: conexões + prompt mínimo |
|---|---|---|
| Navegação Login ↔ Home | Funcionou | Funcionou |
| Interações do menu | Esqueceu algumas | Funcionaram, com aba ativa |
| Transição | Quase igual, precisou de ajuste | Quase igual, precisou de ajuste |
| Fidelidade visual | Igual nos dois | Igual nos dois |
| Estados que não desenhei | Nenhum | Criou erro de e-mail inválido |
| Organização do código | Classes longas no JSX | Classes com nome e CSS separado |
| Variáveis do design system | Nenhuma | Nenhuma |

Os tempos ficaram próximos: 2min10s e 2min35s. A diferença maior não foi de velocidade, foi de **quanto eu precisei explicar** e de **quanto ele esqueceu**.

## 5. Valores fixos × variáveis

Este foi o ponto mais revelador, e vale para qualquer ferramenta de design to code.

- **Valor fixo** é a cor ou medida escrita direto no código: `background: #1c1c1c`. Se o design system mudar, esse código não fica sabendo.
- **Variável** é o código apontar para o token: `background: var(--color-bg)`. O valor mora num lugar só e muda em todo lugar ao mesmo tempo.

No Figma, as telas usavam variáveis em quase tudo. No código, os dois testes vieram com **100% de valores fixos**: o agente pegou o valor que cada variável tinha naquele momento e deixou o nome do token para trás.

| No código gerado | Token que deveria ser |
|---|---|
| `#1c1c1c` | `color/bg` |
| `#232323` | `color/surface` |
| `#2a2a2a` | `color/surface-raised` |
| `#363636` | `color/border` |
| `#a8a8a8` | `color/text/secondary` |
| `#c8102e` | `color/action/accent` |

E quando falta a referência, a IA chuta:

- **Cores inventadas.** Um hover vermelho mais claro (`#dc1436`) e uma borda cinza (`#484848`) que não existem no design system.
- **Desvios pequenos.** Opacidades de 18%, 20%, 24% e 25% onde o design tinha 16% em tudo, e um blur de 8px onde o design tinha 16px.
- **Fonte com nome errado.** O código veio com `font-family: "DM Sans:Bold"`, que é como o Figma nomeia o estilo por dentro. O navegador não reconhece e cai na fonte padrão. O certo é `font-family: "DM Sans"` com `font-weight: 700`.
- **Espaçamentos certos por coincidência.** Bateram porque a escala do Tailwind também é de 4 em 4 px, igual à do meu design system, e não porque ele leu os tokens.

## 6. Checklist para revisar código gerado

- [ ] As cores usam variáveis (`var(--...)`) ou valores hex fixos?
- [ ] Alguma cor ou medida **não existe** no design system?
- [ ] A `font-family` é um nome válido e a fonte carrega de verdade no navegador?
- [ ] Os estilos de texto viraram tamanhos soltos (`34px`) ou um padrão reaproveitável?
- [ ] Os componentes do design system viraram componentes no código, ou cada botão foi reescrito?
- [ ] Os campos têm `<label>`, o foco aparece e dá para navegar com Tab?
- [ ] A aba ativa tem `aria-current`, e avisos dinâmicos têm `aria-live`?
- [ ] Os estados que a IA criou sozinha (erro, toast) fazem sentido, ou são comportamento inventado?

## 7. Próximo teste

Repetir o teste B pedindo explicitamente os tokens:

> Use CSS variables com os mesmos nomes das variáveis do Figma (por exemplo `--color-bg` e `--color-action-accent`) em vez de valores hex, e font-family "DM Sans" com font-weight.

A pergunta é se basta pedir, ou se ainda é preciso entregar o design system para a IA de outro jeito (por exemplo, pelo Dev Mode, pelo MCP do Figma ou por um arquivo de tokens no repositório).

## Para levar

Conectar o protótipo vale a pena: é menos prompt e menos interação esquecida. Mas um protótipo que funciona não é o mesmo que código pronto para entregar. Antes de chamar de design to code, abra o código e procure os seus tokens.
