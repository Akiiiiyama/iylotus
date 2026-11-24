## Resumo

- **Engenharia de prompts** é a prática de escrever instruções que levam um modelo de linguagem à resposta que você precisa.
- O modelo **não entende** como uma pessoa: ele prevê o texto mais provável a partir do que está escrito. O que fica implícito, ele não sabe.
- Um bom prompt tem **5 elementos**: instrução, contexto, exemplo, dados de entrada e formato da saída.
- Para designers, isso é uma habilidade familiar: **um prompt é um briefing**. E, cada vez mais, é também parte do produto que a gente desenha.

---

## 1. O que é engenharia de prompts

Prompt é o texto que você envia para um modelo de IA: uma pergunta, um pedido, um material para analisar. Engenharia de prompts é escrever esse texto de forma **intencional**, testar o resultado e ajustar até a resposta ficar útil.

Não é sobre decorar "prompts mágicos". É sobre comunicar bem: dizer o que você quer, para quem, com base em quê e em que formato.

## 2. Como o modelo lê um prompt

Entender o mecanismo explica por que algumas instruções funcionam e outras não.

1. **Tokenização.** O texto é quebrado em *tokens*: palavras, pedaços de palavras ou caracteres.
2. **Embeddings.** Cada token vira um vetor numérico que representa seu significado.
3. **Atenção.** Na arquitetura *Transformer*, o modelo relaciona cada token com todos os outros do texto, não só com o vizinho. É assim que ele usa o contexto.
4. **Previsão.** O modelo calcula qual é o próximo token mais provável, escreve, e repete até terminar a resposta.

O que isso significa na prática:

| Como o modelo funciona | O que fazer no prompt |
|---|---|
| Prevê a resposta mais provável | Seja específico. Pedido vago gera resposta genérica, porque genérico é o mais provável. |
| Relaciona todas as partes do texto | Dê contexto. Cada detalhe relevante muda o peso do resto. |
| Só conhece o que está escrito | Não deixe nada implícito. O que está na sua cabeça não está no prompt. |
| Aprende por padrões | Mostre exemplos. Um exemplo explica estilo melhor que uma descrição. |

## 3. Por que é importante

- **Qualidade.** A diferença entre uma resposta genérica e uma resposta utilizável costuma estar no prompt, não no modelo.
- **Tempo.** Um prompt bem estruturado reduz o vai e volta de correções.
- **Consistência.** Prompts estruturados podem ser reaproveitados e compartilhados com o time, gerando resultados parecidos todas as vezes.
- **Senso crítico.** Quem sabe como o modelo funciona entende melhor seus limites: quando ele pode inventar, quando falta contexto, quando a resposta precisa de revisão.

## 4. Por que importa para designers

### Um prompt é um briefing

Designers já sabem que um briefing ruim gera um trabalho ruim. Objetivo, público, restrições, referências, entregável: são exatamente os elementos de um bom prompt. A habilidade não é nova, só mudou o destinatário.

### A IA já está no fluxo de design

- **Pesquisa:** sintetizar entrevistas, agrupar feedbacks, levantar hipóteses.
- **UX writing:** gerar variações de microcopy, mensagens de erro, estados vazios.
- **Exploração visual e protótipos:** ferramentas que geram telas e código a partir de texto respondem diretamente à qualidade do pedido.
- **Design engineering:** pedir componentes que respeitem o design system exige passar tokens, regras e exemplos no prompt.

Em todos esses casos, quem escreve o prompt está, na prática, dirigindo o resultado.

### O prompt também é interface

Em produtos com IA, o designer não só *usa* prompts: ele **desenha** a experiência em torno deles. Isso inclui:

- O comportamento e o tom do assistente (as instruções de sistema).
- O que acontece quando a IA não sabe, erra ou precisa de mais informação.
- Como o usuário escreve o próprio pedido: sugestões, exemplos, campos que já carregam contexto.

Entender engenharia de prompts ajuda a desenhar essas experiências com conhecimento de causa, e a conversar de igual para igual com engenharia e produto.

### Critério de qualidade

A IA gera rápido, mas não decide o que é bom. Avaliar se a resposta atende ao usuário, ao contexto e ao padrão de qualidade continua sendo trabalho de design. Um prompt bem escrito já traz esse critério embutido: ele diz o que é uma boa resposta antes de ela existir.

## 5. Os 5 elementos de um bom prompt

![Cinco camadas empilhadas em vista isométrica, de cima para baixo: Instrução, em vermelho, Contexto, Exemplo, Dados e Formato, cada uma ligada ao seu rótulo](/escritos/engenharia-de-prompts/01-estrutura-do-prompt.jpg "As cinco camadas de um prompt. Cada uma responde a uma pergunta que a IA não consegue adivinhar sozinha.")

| Elemento | O que é | Exemplo (pesquisa de UX) |
|---|---|---|
| **Instrução** | A tarefa, direta e sem ambiguidade | "Sintetize as entrevistas abaixo em temas principais." |
| **Contexto** | Para quem é, qual o objetivo, em que situação | "São entrevistas com usuários de um app de finanças pessoais que abandonaram o cadastro. O objetivo é priorizar melhorias no onboarding." |
| **Exemplo** | Um trecho do que você espera | "Para cada tema, algo como: *Tema: desconfiança ao pedir dados · Evidência: 'por que precisam do meu CPF já na primeira tela?'*" |
| **Dados de entrada** | O material específico a ser usado | As transcrições, notas ou respostas da pesquisa. |
| **Formato da saída** | Tamanho, estrutura, tom | "Tabela com tema, frequência, citação e impacto. No máximo 6 temas, ordenados por impacto." |

### Modelo para copiar

```
[INSTRUÇÃO]
O que você quer que seja feito, em uma frase.

[CONTEXTO]
Para quem é, qual o objetivo, qual a situação.

[EXEMPLO]
Um trecho do resultado que você espera.

[DADOS DE ENTRADA]
O material que o modelo deve usar.

[FORMATO DA SAÍDA]
Tamanho, estrutura (tópicos, tabela, parágrafos) e tom.

Antes de responder, me pergunte o que faltar.
```

## 6. Antes e depois

**Antes**

```
Me dê ideias de onboarding para um app.
```

O resultado é uma lista que serviria para qualquer produto: tour guiado, tooltips, checklist.

**Depois**

```
Sugira 3 ideias de onboarding para um app de finanças pessoais.

Público: pessoas de 25 a 35 anos que nunca usaram um app de controle de gastos.
Problema: muitos usuários abandonam o cadastro antes de ver valor no produto.

Exemplo do que espero: "Mostrar um resumo de gastos simulado antes de pedir
qualquer dado, para a pessoa ver o valor primeiro."

Formato: para cada ideia, nome, como funciona (2 frases), qual problema resolve
e um risco. Tom direto.
```

O pedido é o mesmo. A diferença é que, no segundo, o modelo não precisa adivinhar nada.

## 7. Erros comuns

1. **Pedir tudo num prompt só.** Divida em etapas: estrutura, conteúdo, refinamento.
2. **Não dar exemplo.** Um trecho do que você quer vale mais que um parágrafo descrevendo.
3. **Não definir o formato.** Se você não diz tamanho, tom e estrutura, o modelo escolhe.
4. **Aceitar a primeira versão.** A primeira resposta é rascunho. Peça ajustes.
5. **Não pedir para o modelo perguntar o que falta.** Uma linha no final do prompt evita respostas baseadas em suposições.

## 8. Para levar

O melhor prompt não é o mais longo. É o que não deixa nada para o modelo adivinhar.

Se você sabe escrever um bom briefing, já sabe metade do caminho.

---

Próximo passo: [Agentes e modelos do Claude](/pt/escritos/agentes-e-modelos).
