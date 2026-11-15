## Resumo

- A referência foi um reel de direção criativa. Dele vem só a **gramática**: corte na batida, pares de peso leve e negrito, rótulos em fonte mono e uma sequência rápida no fim. O conteúdo é seu.
- Para ser de Design Engineer, **cada cena mostra design e código lado a lado**: a caixa de seleção do Figma com o CSS, "pixels" que viram "code", o logo como token, componente e commit.
- O ritmo nasce de uma **grade de batidas**. Cada cena começa numa batida, e as mudanças grandes caem nos golpes fortes.
- Um **fio condutor** atravessa o vídeo: o ponto vermelho é o cursor no começo e o ponto final no fim.
- A música usa só o **começo da faixa, antes da voz**.
- Nas revisões, peça **só a mudança que você quer** e diga o que deve ficar.

---

## 1. O roteiro em 7 cenas

| Cena | Quando | O que aparece |
|---|---|---|
| **Hello.** | 0s | Grade escura. O cursor vermelho digita "Hello" e vira o ponto. Aparece a caixa de seleção do Figma com `x y W H` e o CSS `font: 700 170px "DM Sans";` |
| **Nome** | 2,25s (golpe) | Corte para branco. "I'm" sobe e "Isabela **Yukari**" é digitado em leve e negrito. |
| **Papéis** | 4,56s | Design **Engineer** no vermelho, depois Product **Designer** no cinza claro. Cada um fica na tela por algumas batidas. |
| **Princípio** | 8,71s (golpe) | "I design in **pixels**" com ícones de design em órbita. Na batida seguinte vem "and ship in **code**." e cada ícone vira um ícone de código. |
| **Skills** | 10,10s | "I ship •" e uma roleta que gira um item por batida, com o ativo em vermelho. |
| **Craft** | 11,48s | 8 artefatos em sequência rápida: tokens, editor de código, medidas, modo escuro, estados de botão, telas responsivas, contraste AA e commit. |
| **Final** | 12,40s (golpe) | Nome em leve e negrito, o ponto vermelho cai como ponto final e `DESIGN ENGINEER — 2026` é digitado embaixo. |

## 2. Passo a passo com o Claude Code

1. **Instale a skill** [`brand-motion-intro`](https://github.com/Akiiiiyama/skills-para-designers/tree/main/skills/01-explore/brand-motion-intro). O roteiro completo deste reel está em `references/kinetic-reel.md`.
2. **Peça com contexto.** Exemplo:
   > Atue como especialista em craft design e se inspire neste vídeo, sempre voltando para Design Engineer. Reel vertical de 14s. Papéis em ordem: Design Engineer e depois Product Designer. Use o design system do meu portfólio e a música ~/Downloads/musica.mp3, só o trecho antes da voz.
3. **Aprove a proposta antes do código.** O Claude analisa a referência e propõe as cenas. Ajuste a ordem e as frases aqui, que é o momento mais barato.
4. **Música.** O Claude encontra o andamento (130 BPM no exemplo), os golpes fortes e onde a voz começa (aos 14s, por isso o vídeo tem 14s). Se houver uma palavra falada no meio, ele troca esse trecho por um trecho igual de antes, cortado na batida.
5. **Prévia em 1080p.** Confira primeiro uma prancha de quadros e depois o vídeo. Assista com som.
6. **Ajustes.** Exemplo real: "a sequência eu quero Design Engineer e depois Product Designer". Se o Claude mudar mais do que você pediu, diga o que deve voltar.
7. **Alta resolução.** Depois de aprovado: 2160×3840 para Reels.
8. **Versão desktop.** Peça "agora no formato desktop em alta resolução". A cena é recomposta em 16:9 (3840×2160), sem cortar a vertical.

## 3. Cores

Com preto, a combinação mais forte e coerente é **preto + branco + um único acento saturado**, como o vermelho da marca, usado em cerca de 10% da tela. O cinza entra como apoio para rótulos e código. Um segundo acento saturado (verde-limão, azul elétrico) compete com o primeiro: use um ou outro.

## 4. Erros comuns

| Problema | O que fazer |
|---|---|
| Pedi um ajuste e sumiram cenas que eu gostava | Diga exatamente o que mudar e o que manter. Peça para voltar à versão anterior e mudar só aquele trecho. |
| Vídeo rápido demais | Menos itens por cena, ou mais batidas por item. Não encurte o que você gostou sem decidir. |
| Voz da música por cima do texto | Use só o começo instrumental. Troque palavras faladas por trechos iguais, na batida. |
| Texto embaixo da interface do Instagram | Mantenha rótulos e textos longe do topo e da base no 9:16. |
| Versão horizontal cortada da vertical | Recomponha a cena em 16:9. |
| Arquivos da cena perdidos | Guarde as cenas num repositório. Pastas temporárias são apagadas. |

## 5. Checklist

- [ ] Referência traduzida para o seu ofício, não copiada
- [ ] Cada cena mostra design e código
- [ ] Papéis na ordem que você escolheu
- [ ] Cortes na batida, mudanças grandes nos golpes fortes
- [ ] Um fio condutor do começo ao fim
- [ ] Música sem voz
- [ ] Prévia aprovada antes da alta resolução
- [ ] Versões 9:16 e 16:9 recompostas
- [ ] Cenas salvas num repositório
