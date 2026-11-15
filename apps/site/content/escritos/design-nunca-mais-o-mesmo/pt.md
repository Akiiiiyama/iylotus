Assisti à palestra "Design Will Never Be The Same", da Meaghan Choi, na uxcon vienna. Ela lidera o design do Claude Code na Anthropic e está vivendo de dentro o que muita gente ainda está tentando entender de fora: o que acontece com o papel do designer quando as linhas entre design, código e produto começam a se misturar.

O título parece um alerta, mas a última frase da palestra vira o sentido: o design nunca mais vai ser o mesmo porque vai ser mais do que jamais foi. Este texto é o que eu tirei dessa conversa, misturado com o que eu venho sentindo na prática.

## De convencer pessoas a ninguém precisar ser convencido

A Meaghan abre contando que, há um ano, boa parte do trabalho dela era convencer designers e times de design a experimentar programar com IA. E quando conseguia, vinha a segunda batalha: convencer a engenharia a deixar esses designers acessarem os repositórios de código.

Hoje, segundo ela, ninguém precisa mais ser convencido. O problema virou o oposto. Uma pesquisa da Designer Fund, do começo de 2026, mostra que 65% dos designers dizem estar assumindo mais responsabilidades de produto ou de engenharia. O papel do designer já vai muito além do design.

## Estressante e divertido ao mesmo tempo

Uma das coisas mais honestas da palestra é admitir que o design nunca foi tão difícil. Sempre parece que a gente está atrasado: ferramenta nova toda semana, fluxo novo pra otimizar todo dia, um monte de termo que ainda é mais buzzword do que prática.

Ao mesmo tempo, ela mostra gente construindo coisas incríveis, divertidas e até "inúteis" de propósito, projetos que não existiriam sem as ferramentas de IA. E resume assim: o design nunca foi tão estressante e nunca foi tão divertido.

Pra ela, parte do desconforto vem de falarmos da mudança de um jeito vago, como se ela simplesmente acontecesse com a gente. Então a palestra tenta nomear o que exatamente mudou, e foi isso que mais me ajudou a organizar o pensamento.

Eu concordo. É uma era difícil, com excesso de informação chegando rápido demais. Mas vejo os curiosos, os que têm senso crítico e estratégico, prosperando muito nessa movimentação.

## As três mudanças de base

A primeira mudança é a mais óbvia: qualquer um pode programar. A Meaghan chama o código com IA de segundo grande caso de uso da IA, depois da busca, e diz sem rodeios que designers devem programar. Esse debate acabou, é parte do trabalho.

A segunda vem da primeira: testar uma ideia nova ficou praticamente de graça. Temos uma abundância de ideias, o que não é necessariamente bom.

A terceira é a que pesa no emocional: a expectativa de velocidade. O que levava meses agora, na teoria, leva dias ou horas. Mesmo quando não é verdade, o ambiente faz parecer que a gente deveria estar mais rápido.

O resultado é que o processo que a gente aprendeu (descobrir, definir, explorar, refinar, construir e lançar) foi comprimido em algo parecido com construir e lançar. Só que não é o mesmo "construir e lançar" de antes.

| Antes | Agora |
|---|---|
| Cada etapa tinha um entregável concreto | Iteração contínua em cima de algo que funciona |
| Um dono claro por etapa (PM, design, engenharia) | Papéis misturados, cada um aprendendo com o outro |
| Handoff entre funções | Responsabilidade e decisão compartilhadas |
| Semanas ou meses | Ciclos muito mais curtos |

Os times mais bem-sucedidos que ela vê são os que se apoiam uns nos outros e aprendem com as habilidades dos parceiros. A engenharia ficou muito mais rápida, mas nem todas as partes do processo aceleraram junto. O design ainda não acompanhou, e a qualidade ficou difícil de sustentar num mundo em que todo mundo está lançando coisa.

## O novo desafio: decidir o que vale construir

Ela faz uma pergunta pra plateia: quantas vezes este ano alguém jogou no seu colo uma ideia ou uma demo feita no fim de semana? Quase todo mundo levanta a mão. Depois: quantas dessas ideias eram boas? Quase ninguém.

Antes, uma demo era sinal de esforço, e esforço indicava que tinha algo bom ali. Hoje construir é tão barato que a demo deixou de ser sinal de qualquer coisa. Ela chama isso de "idea slop" e diz que acertar 10 a 20% das ideias já é inovação de nível gênio.

Por isso as perguntas de sempre continuam existindo, e talvez nunca tenham sido tão importantes:

- Isso deveria existir?
- Pra quem é? Essa pessoa existe mesmo ou é só você?
- Que problema resolve? É um problema real?
- Faz sentido dentro do produto que estamos construindo?

Ela dá um exemplo da Anthropic. O Claude Design começou como uma demo de um engenheiro mostrando que o Claude conseguia gerar HTML. Um designer do time viu ali uma ferramenta para designers, fez um protótipo funcional, percebeu que o resultado ficava muito melhor quando o Claude tinha acesso ao design system e criou uma skill pra isso. Depois veio a marca, depois os slides, e os times de marketing e vendas começaram a usar. Cada decisão de produto nesse caminho foi tomada pelo design.

Daí saem as novas habilidades que ela coloca na mesa:

| Habilidade | O que significa |
|---|---|
| Público e casos de uso | O que sempre foi base do design: pra quem e pra quê |
| Demos > mocks | Iterar num produto que funciona de verdade, não em documento ou tela estática |
| M-LVU-P | Definir o primeiro produto mínimo amável, viável ou usável |
| Estratégia | Entender como a ideia entra no roadmap: prioridade, quantas pessoas, plano de lançamento |

Pra mim, a habilidade nova mais importante é a ousadia de transformar uma ideia em algo que realmente funciona. Já passamos da era do documento estático. Você precisa usar e garantir que aquilo funcione.

## Decidir quando está pronto

A segunda parte do novo processo é saber quando algo está pronto pra lançar. A Meaghan mostra como a contribuição de código dos designers da Anthropic cresceu nos últimos seis meses, e é código indo pra produção, não um playground. Ela lembra que, no emprego anterior, precisava implorar por acesso ao repositório e mesmo assim não podia fazer merge.

Antes, era a engenharia que ditava quando algo estava pronto ("isso leva duas ou três semanas"). Hoje muitas vezes não existe handoff: é o designer que implementa a última milha, e garantir que está pronto virou responsabilidade do design.

O exemplo que ela usa é o Claude Code desktop, que teve três lançamentos com réguas diferentes:

| Quando | Régua de lançamento | Quem puxou |
|---|---|---|
| Final de 2025 | Funcionar. Feito em uma semana, com várias arestas | Design e engenharia juntos |
| Começo de 2026 | Redesign pra virar uma ferramenta de desenvolvimento de verdade | Quase todo pelo design |
| Meados de 2026 | Velocidade e confiabilidade | Decisão conjunta, com muito trabalho de design em loading, hover e cliques |

O terceiro é o que mais me chamou atenção: um esforço de performance, que tradicionalmente seria só da engenharia, também tinha muito trabalho de design dentro.

## Programar não é suficiente

Esse é o ponto que mais me pegou. Sim, a gente deve programar. Mas a Meaghan diz que isso não basta, e sugere perguntar a um engenheiro se o trabalho dele é só codar. Não é.

O time de engenharia tem outras responsabilidades dentro do escopo, e aprendeu ao longo de anos a lidar com a esteira que atravessa todo dia. É isso que a gente precisa aprender com eles:

- **Estimar escopo e prazo** de implementação.
- **Definir o que é "pronto"** de forma concreta. Não dá mais pra dizer "você vai saber quando vir". Qualidade precisa ser definida e medida.
- **Negociar o prazo**, reconhecendo quando adiar ou quando algo pode sair logo depois do lançamento.
- **Revisar PRs**, olhando o front-end e a experiência do usuário.
- **Transformar a revisão de design em checagem automática.**

Esse último merece um parágrafo próprio. Empresas grandes têm times de DevOps ou DevX cuja função é deixar a implementação mais rápida pra engenharia. Agora que designers estão programando, a gente precisa do mesmo: automações que verificam aderência ao design system, ao guia de conteúdo e às regras de acessibilidade. A própria Meaghan tem um bot que revisa PRs, e admite que a IA ainda não é ótima nisso, mas já mostra os primeiros sinais de que dá certo.

Ela lembra também que, quando você define a régua de lançamento, não está fazendo isso só pra você, e sim pro time inteiro que vai te ajudar a implementar a última milha.

No IY Lotus, o meu design system, eu fiz uma versão pequena disso. Em vez de conferir o contraste no olho, a régua virou um teste: cada par de texto e fundo precisa passar no AA (4,5:1 para texto, 3:1 para ícones e foco), no tema claro e no escuro. Se um token novo quebrar o contraste, o teste falha antes de publicar.

## Não é "taste", é julgamento

Com tudo misturado e os prazos comprimidos, não dá pra fazer tudo. Então ela pergunta: o que só o designer faz?

E responde que não é "taste", porque a palavra é vaga demais. É julgamento de design. E vai além, nomeando o que ela vê designers fazendo que outras funções não fazem:

- **Soluções criativas:** poucas funções exploram tanta variação e iteram em cima dela como a gente.
- **Simplificar a complexidade:** somos a ponte entre a tecnologia e as pessoas que usam o produto.
- **Coesão do produto:** cuidar da experiência de ponta a ponta, pra que o app pareça um só e não um monte de features soltas.
- **Acabamento:** os detalhes que transformam algo funcional numa experiência que dá prazer de usar.

O alerta dela é forte: se os próprios designers aceitarem que o design morreu e que somos automatizáveis, vamos acabar num mundo de apps sem alegria. Ela não acha que é pra lá que estamos indo, mas trata isso como um chamado à ação.

## O que ficou do Q&A

Algumas respostas da sessão de perguntas valem tanto quanto a palestra:

- **Pesquisa com usuários:** a Anthropic depende do time de pesquisa mais do que nunca. As pesquisas táticas foram automatizadas, e os pesquisadores passaram a cuidar das perguntas estratégicas. Quando designers ou engenheiros lançam pesquisas sozinhos, segundo ela, o resultado é ruim.
- **Organização dos times:** eles trabalham em "pods" fluidos, às vezes um designer e dois engenheiros, às vezes um PM e um designer, que mudam conforme a fase do projeto.
- **Como começar numa empresa mais tradicional:** começar pequeno, com um time de duas ou três pessoas. Quando a organização vê como é mais rápido decidir e construir assim, vira o caminho natural.
- **Designers como gargalo:** na Anthropic, o design virou o recurso mais disputado e o perfil que mais estão tentando contratar.
- **Ferramentas:** não existe a ferramenta ou o fluxo certo, assim como nunca existiu. E ela diz que não é bom estar na fronteira agora: se não trabalhasse num laboratório de IA, esperaria três ou quatro meses a poeira baixar antes de adotar algo novo.
- **Segurança:** quando o designer revisa um PR, olha o front-end e a experiência. A segurança fica com a engenharia, com os times de DevOps e com as checagens automáticas.

## Pra fechar

A grande mudança é que qualquer um pode programar. O nosso grande desafio é pensar no que realmente vale construir e no que realmente entrega valor.

Nosso processo está muito mais híbrido, e a gente precisa ir atrás de habilidades que antes não precisava. Mas esse momento também está abrindo oportunidades de construir coisas novas e mais criativas, e de moldar uma ideia do nosso jeito, sem depender de tanta gente pra ela sair do papel.

A Meaghan termina dizendo que isso não vai acontecer se a gente esperar que aconteça com a gente. É preciso ser aberto, curioso e tirar tempo pra aprender. Quem fizer isso não vai só se preparar, vai ajudar a definir o papel que o design vai ter daqui pra frente.

A palestra completa está no [YouTube](https://www.youtube.com/watch?v=na1OyJ3E7Kc).

## Leia também

[Do artefato ao PR](/pt/escritos/do-artefato-ao-pr), sobre a conversa dela no podcast Dive Club: como ela vai do artefato ao PR.
