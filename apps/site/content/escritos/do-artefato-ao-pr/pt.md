Assisti ao episódio do Dive Club em que o Ridd conversa com a Meaghan Choi, que lidera o design do Claude Code na Anthropic. Foi quase uma hora de alguém abrindo a cozinha: como ela sai de um pedido do time, chega num protótipo que as pessoas usam de verdade e termina num pull request, sem a etapa de repasse para a engenharia no meio.

O ponto central da conversa não é a ferramenta: o trabalho do designer não diminuiu, ele subiu de nível. A execução vai para o modelo, e o pensamento sobre a forma do produto e o modelo mental continua com a gente. Este texto é o que eu tirei dessa conversa.

## Primeiro a forma, depois a tela

Antes de falar de interface, a Meaghan usa o Claude como parceiro de produto. Ela traz pesquisa e dados, desenha o fluxo e se pergunta se aquilo precisa mesmo de uma UI.

Parece óbvio, mas é fácil pular essa parte quando gerar uma tela leva segundos. O modelo executa uma ideia ruim sem questionar. Decidir a forma do produto continua sendo trabalho do designer, e é o que dá valor a todo o resto.

## Um link vivo no lugar do arquivo estático

Em vez de mandar um arquivo que ninguém abre, ela compartilha um artefato: um link interativo, versionado, que a pessoa usa como se fosse o produto. O Ridd compara com mandar um arquivo do Figma para executivos, que quase nunca abrem.

Os artefatos começaram como improviso. As pessoas pediam HTML para o Claude e mandavam umas para as outras, até isso virar o jeito de prototipar dentro do time. A lógica é simples: validar rápido depende de diminuir o esforço de quem revisa. Um link que funciona no navegador traz feedback mais cedo e mais concreto do que uma sequência de prints.

## O artefato também guarda a decisão

Além de protótipo, o artefato vira registro. Pede três ou quatro variações, junta um resumo da pesquisa e dos dados e linka artefatos relacionados. Ela descreve o resultado como quase um mini microsite e um *decision log*.

Assim, qualquer pessoa consegue entender por que uma decisão foi tomada, e não só o que foi decidido. É justamente a parte da documentação que costuma se perder entre uma reunião e outra.

## Do artefato ao PR, num fluxo só

O fluxo que ela mostrou é curto. O time manda um pedido, ela pede ao Claude um artefato com a proposta, o time itera em cima dele e, quando chega em média fidelidade, o Claude reconstrói usando os componentes reais e leva para o repositório. Daí vira um pull request, e a revisão continua junto com a engenharia.

O protótipo deixa de ser descartável. O que foi validado vira o ponto de partida do código, e a conversa com a engenharia acontece no PR, em cima de algo que funciona. Ela contou que mais da metade do código que entrega hoje sai de PRs iniciados pelo Claude.

## Delegar o repetitivo e respeitar o trabalho dos outros

O polimento de UI, a limpeza de código e a abertura de PR vão para o modelo, com as preferências dela salvas: PR em rascunho, prints de antes e depois, CI rodando. O Claude acompanha conversas no Slack e trabalho já mergeado, propõe mudanças e avisa quando o merge acontece. O que é repetitivo vira configuração, e o tempo livre vai para os problemas ambíguos.

Tem um detalhe que vale destacar. Às vezes ela empilha PRs de refinamento em cima do PR de uma pessoa engenheira, em vez de reescrever o que já estava lá. Designer que entrega código ganha a confiança do time quando contribui sem passar por cima de ninguém.

## Saber quando o craft importa

Trabalho experimental não precisa de polimento. O cuidado com o acabamento vale mais quando a forma do produto já está definida, porque polir cedo demais é gastar tempo em algo que ainda vai mudar. E a qualidade é do time inteiro: a ideia é facilitar para engenharia e produto também enxergarem os problemas e subirem o nível juntos.

Ela também separa o que precisa ser fixo do que pode se adaptar. Login, cobrança e configurações têm que ser estáveis, enquanto outras partes do produto podem mudar conforme quem usa. Decidir essa fronteira é trabalho de design.

E nada de dogma com ferramenta: ela continua no Figma, com auto layout, quando iterar ali é mais rápido do que no código.

## O designer que vai se destacar

No fim, o Ridd pergunta qual designer vai se dar bem daqui pra frente. A primeira resposta dela não foi técnica: ser aberto e curioso. Ter ideias e desenvolvê-las, mas soltar quando aparece um caminho melhor. Atualizar o tempo todo a forma de pensar, o próprio papel e o produto. Se apoiar na ambiguidade, achar um ponto de partida e seguir em frente, mesmo quando o caminho parece caótico.

Depois ela completa com discernimento para decidir o que construir e responsabilidade de ponta a ponta. E lembra que ainda estamos no começo, então quem está trabalhando agora ajuda a definir como isso vai ser.

## O que eu levo para o meu trabalho

Saí do episódio com cinco coisas para testar. Antes de abrir qualquer ferramenta, escrever em poucas linhas a forma do produto e o modelo mental. No próximo pedido de feature, mandar um protótipo em artefato em vez de prints ou arquivo estático. Gerar três variações com um resumo do racional e usar isso como registro da decisão. Quando o protótipo estiver validado, levar para o repositório com os componentes reais e abrir um PR em rascunho, com prints de antes e depois. E salvar essas preferências de PR num `CLAUDE.md`, para não repetir sempre.

Nada disso depende de trabalhar na Anthropic. Depende de tratar o protótipo como o começo do produto, e não como um desenho que alguém vai refazer depois.

## Para assistir

O episódio tem cerca de 54 minutos e está no [YouTube](https://www.youtube.com/watch?v=jEEbjiC4JE0). Os trechos que eu mais voltaria:

| Minuto | Assunto |
|---|---|
| 01:35 | Entrada na Anthropic e começo do Claude Code |
| 03:14 | Design para linha de comando (CLI) |
| 07:45 | O momento "mágico" e personalidade na ferramenta |
| 10:19 | Artefatos: prototipação, compartilhamento e decision log |
| 19:38 | Claude Tag: um Claude compartilhado pela organização |
| 27:56 | PRs iniciados pelo Claude |
| 31:53 | Delegar execução vs. pensar o design em alto nível |
| 38:48 | Desapegar do craft |
| 42:48 | Interfaces fixas vs. adaptativas |
| 46:53 | Novos desafios e o papel do designer |
