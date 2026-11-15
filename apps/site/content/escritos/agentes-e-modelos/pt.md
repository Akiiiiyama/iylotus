## Resumo

- Um **agente** é o mesmo modelo de linguagem rodando em loop: decide um passo, usa uma ferramenta, lê o resultado e decide de novo.
- Num agente, um prompt vago não gera só uma resposta genérica. Gera uma **sequência de ações na direção errada**.
- Os modelos do Claude se diferenciam por **capacidade, velocidade e custo**. Mais capaz é mais lento e mais caro.
- Antes de trocar de modelo, vale ajustar o **esforço** (*effort*): o quanto o modelo pensa antes de responder.
- Cada modelo segue instruções de um jeito um pouco diferente. **Um prompt bom num modelo pode precisar de ajuste em outro.**

---

## 1. Chat, workflow e agente

Todos usam um LLM. A diferença é **quem decide o caminho**.

| Tipo | Quem decide os passos | Como age | Quando usar |
|---|---|---|---|
| **Chat** | Você, a cada mensagem | Recebe um prompt e devolve uma resposta | Perguntas, rascunhos, ideias, revisão |
| **Workflow** | O código, num caminho definido antes | Várias chamadas ao modelo numa ordem fixa | Tarefas previsíveis e repetidas |
| **Agente** | O próprio modelo, enquanto trabalha | Planeja, usa ferramentas, observa e ajusta | Tarefas abertas, sem número de passos previsível |

## 2. Como um agente funciona

A base é um **LLM aumentado**: o modelo com acesso a ferramentas (ler arquivos, buscar na web, rodar código, usar uma tela), a busca de informação e a memória.

1. **Recebe o objetivo:** o seu prompt, as instruções de sistema e a lista de ferramentas.
2. **Decide o próximo passo:** o modelo continua prevendo o próximo token, como sempre. A diferença é que parte desses tokens vira um **pedido de ação**.
3. **O sistema executa:** quem age de fato é o programa em volta do modelo.
4. **O resultado volta como texto:** entra no contexto, e o modelo passa a considerar o que aconteceu.
5. **Repete ou para:** até terminar, chegar a um limite de passos ou precisar da aprovação de uma pessoa.

> O agente não é um modelo diferente. É o mesmo LLM com um loop e ferramentas em volta.

### Padrões entre o chat e o agente

Antes de usar um agente, veja se um caminho fixo resolve:

- **Encadeamento:** a saída de uma etapa vira a entrada da próxima.
- **Roteamento:** classifica o pedido e manda para o fluxo certo.
- **Paralelização:** divide em partes independentes, ou roda várias vezes e compara.
- **Orquestrador:** um modelo quebra a tarefa e delega para outros (subagentes).
- **Avaliador:** um modelo gera, outro critica, até ficar bom.

## 3. O que muda no prompt para agentes

- **Diga se é para sugerir ou para fazer.** Os modelos atuais seguem a instrução ao pé da letra: "pode sugerir melhorias?" gera sugestões. "Melhore o contraste deste componente" gera a mudança.
- **Explique o porquê.** Com o motivo de uma regra, o agente aplica a ideia em casos que você não previu.
- **Defina o que é sucesso e como verificar.** Sem uma pessoa olhando cada passo, o agente precisa saber quando terminou: rodar um teste, comparar com o design, olhar a tela.
- **Combine os limites de autonomia.** Ações locais e reversíveis podem seguir. Apagar, publicar ou enviar mensagem pedem confirmação.
- **Peça para investigar antes de responder.** "Leia o arquivo antes de falar sobre ele" reduz respostas inventadas.
- **Mantenha o escopo pequeno.** Agentes tendem a fazer além do pedido. Diga para fazer só o necessário.
- **Em tarefas longas, peça para registrar o progresso** num arquivo de notas ou no histórico do git.

## 4. Os modelos do Claude

Todos os modelos atuais leem texto e imagem, usam ferramentas, funcionam em vários idiomas e têm janela de contexto de 1 milhão de tokens. O que muda é o equilíbrio entre capacidade, velocidade e custo.

| Modelo | Para quê | Velocidade | Custo (entrada / saída, por milhão de tokens) |
|---|---|---|---|
| **Fable 5.1** | O mais capaz: raciocínio difícil, agentes que trabalham por horas, pesquisa profunda | Mais lento | US$ 10 / US$ 50 |
| **Opus 5.5** | O ponto de partida recomendado: agentes de código e trabalho de conhecimento longos | Moderado | US$ 4 / US$ 20 |
| **Sonnet 5.5** | O melhor equilíbrio entre velocidade e inteligência para o dia a dia | Rápido | US$ 2 / US$ 10 |
| **Haiku 5.5** | O mais rápido e barato: classificar, extrair, rotear, tarefas em grande volume | O mais rápido | a partir de US$ 0,10 / US$ 0,50 |

*Valores de outubro de 2026. Existe também o **Mythos 5.1**, com as mesmas capacidades do Fable 5.1, liberado só para organizações verificadas pela Anthropic.*

Uma analogia de design: é como escolher entre fazer um wireframe rápido, um protótipo navegável ou um teste de usabilidade completo. Nem toda pergunta precisa do método mais caro.

### Esforço (*effort*)

Os modelos atuais **pensam antes de responder**, e o quanto pensam é ajustável pelo nível de esforço (de baixo a máximo). Mais esforço dá respostas mais cuidadosas, só que mais lentas e caras.

Muitas vezes, **ajustar o esforço resolve melhor do que trocar de modelo.**

### Como escolher

Há dois caminhos:

- **Começar pela eficiência:** comece pelo Haiku, teste e só suba se faltar capacidade. Bom para protótipos, respostas em tempo real e tarefas simples em volume.
- **Começar pela capacidade:** comece pelo Opus, ajuste o prompt, e depois veja se dá para baixar o esforço ou trocar por um modelo mais leve. Se nem com esforço alto o resultado chega lá, suba para o Fable.

Também dá para **combinar modelos**: um modelo mais capaz coordena e delega o trabalho repetitivo para modelos mais baratos.

O mais importante: **teste com as suas tarefas reais.** Um conjunto pequeno de exemplos seus diz mais do que qualquer tabela.

## 5. Por que o prompt muda de um modelo para outro

Cada modelo tem seu próprio guia de prompting, porque cada um reage de um jeito às mesmas instruções. Algumas diferenças que aparecem:

- **Tamanho da resposta:** alguns modelos escrevem mais por padrão, outros menos. Se o tamanho importa, peça explicitamente.
- **Iniciativa:** modelos mais novos são mais proativos. Instruções antigas como "na dúvida, use a ferramenta" podem fazer o modelo exagerar.
- **Ao pé da letra:** os modelos atuais fazem exatamente o que foi pedido. Se você quer algo além do básico, peça.
- **Atualizações de progresso:** em tarefas longas, alguns modelos contam pouco do que estão fazendo. Se você quer acompanhar, peça um resumo a cada etapa.

A lição para designers: **um prompt é como um componente.** Funciona bem no contexto para o qual foi desenhado, e precisa ser testado de novo quando o contexto muda.

## 6. Por que isso é assunto de design

- **Transparência:** mostrar o plano e cada passo do agente é o que faz a pessoa confiar no que está acontecendo.
- **Pontos de aprovação:** decidir onde o agente para e pergunta é desenhar o equilíbrio entre autonomia e controle.
- **Interface agente-computador:** as ferramentas que o agente usa precisam de nome claro, descrição e exemplos. É design de interface, só que o usuário é o modelo.
- **Escolha de modelo é decisão de experiência:** velocidade, custo e qualidade mudam o que a pessoa sente ao usar o produto.

## Para levar

Um bom prompt diz o que fazer. Um bom prompt para agente também diz como saber que deu certo. E o modelo certo é o menor que resolve bem a sua tarefa.
