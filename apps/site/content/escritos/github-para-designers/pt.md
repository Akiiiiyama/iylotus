## Resumo

- **Existe um processo**, e cada etapa dele é uma camada de proteção. A primeira regra é que ninguém mexe direto na main.
- O GitHub funciona como as **branches do Figma**: um arquivo principal, uma branch para mexer sem atrapalhar ninguém, um pedido de revisão e um merge.
- Uma mudança passa por **três lugares**: o seu computador, o GitHub e o site no ar. O commit, o push e o merge levam a mudança de um lugar para o outro.
- O **pull request é uma pergunta**, não uma alteração: outra pessoa revisa antes de qualquer coisa entrar.
- Com IA você não precisa digitar comandos, mas precisa **saber conferir cada etapa** antes de aprovar.

---

## 1. O medo de quebrar o código

Uma das coisas que eu mais vejo entre designers quando o assunto é GitHub é medo. Medo de abrir um PR e estragar o código de alguém, de apertar o botão errado e derrubar o site, de mexer numa coisa que o time inteiro usa.

Dá para entender: a primeira vez que a gente abre um repositório, parece que qualquer clique é definitivo. Mas o GitHub foi feito justamente para isso não acontecer. **Existe um processo, e se você segue o processo, você não quebra o código de ninguém.** Cada etapa existe para que a mudança seja vista, testada e aprovada antes de chegar no ar.

Este guia explica cada palavra pensando nisso, sempre com uma comparação que ajuda muito: **o GitHub funciona como as branches do Figma.**

Dois nomes antes de começar:

- **Git** é a ferramenta que guarda o histórico de todas as mudanças de um projeto, no seu computador.
- **GitHub** é o site onde esse histórico fica guardado na nuvem, para o time inteiro trabalhar junto.
- **Repositório** (ou *repo*) é a pasta do projeto com todo esse histórico dentro. É o "arquivo do Figma" do código.

## 2. As 8 palavras

### GitHub

![Duas áreas: em cima, GitHub, o projeto do time na nuvem, com a pessoa que revisa. Embaixo, na sua máquina, com a pessoa que cria e o notebook](/escritos/github-para-designers/01-github.jpg "Cada pessoa trabalha na própria máquina, e o GitHub junta tudo num lugar só.")

O GitHub é **onde o projeto do time mora**, na nuvem. Cada pessoa trabalha numa cópia no próprio computador e, quando termina, manda o que fez para lá. É no GitHub que o time vê, revisa e junta o trabalho de todo mundo.

### Main

![A linha da main com três commits brancos e o rótulo no ar no último deles](/escritos/github-para-designers/02-main.jpg "A main é a linha oficial. O último commit dela é o que está no ar.")

A **main** é a versão oficial do projeto, e em geral é a que está no ar. É o arquivo principal do Figma, aquele que todo mundo usa.

Por que ela te protege: **ninguém mexe direto na main**. Muitos times configuram o GitHub para bloquear isso (o nome da configuração é *branch protection*), então mesmo que alguém tente, o GitHub não deixa.

### Branch

![Uma linha tracejada sai da main e desce até a sua máquina, onde vira a linha vermelha minha-branch](/escritos/github-para-designers/03-branch.jpg "A branch nasce de um ponto da main e vira a sua linha de trabalho.")

A **branch** é uma cópia da main para você mexer à vontade, como criar uma branch de um arquivo no Figma. Ela nasce a partir de um ponto da main e, a partir daí, tudo que você faz fica nela.

Por que ela te protege: **se você errar na sua branch, a main nem fica sabendo.** Dá para testar, errar e refazer quantas vezes precisar.

### Commit

![Na sua máquina, três círculos vazados aparecem na linha da branch, cada um com um flash](/escritos/github-para-designers/04-commit.jpg "Cada commit é uma foto salva. Os círculos vazados mostram que eles ainda estão só no seu computador.")

O **commit** é uma foto salva das mudanças, com uma mensagem dizendo o que mudou ("Card: espaçamento de 16 para 24px"). É como salvar uma versão com nome no histórico do Figma.

Por que ele te protege: o commit fica **só no seu computador**, então ninguém vê ainda. E como cada commit é uma foto, dá para voltar para qualquer uma delas.

### Push

![Os commits sobem da sua máquina para o GitHub e viram círculos vermelhos cheios numa linha abaixo da main](/escritos/github-para-designers/05-push.jpg "No push, os commits sobem para o GitHub. A main continua igual.")

O **push** manda os seus commits do computador para o GitHub. Agora o time consegue ver a sua branch.

Por que ele te protege: repare que **a main continua do mesmo jeito**. Subir uma branch não muda nada do que está no ar. O contrário do push é o **pull**: trazer para o seu computador o que os outros já mandaram.

### Pull request (PR)

![A branch no GitHub fica dentro de um contorno tracejado, Pull Request #2 aprovado, e a pessoa que revisa diz aprovado](/escritos/github-para-designers/06-pull-request.jpg "O PR é a conversa: quem cria pede revisão e quem revisa aprova.")

O **pull request** é o pedido para juntar a sua branch na main, como o "Request review" de uma branch no Figma. É o coração do processo: **outra pessoa revisa antes de qualquer coisa entrar**, comenta linha por linha, pede ajuste e aprova.

Em muitos projetos, o PR também roda **testes automáticos** (os *checks*), que avisam se algo quebrou, e gera um **link de preview** para ver a mudança funcionando antes de ir ao ar.

Por que ele te protege: abrir um PR não é mexer no código de ninguém. É **fazer uma pergunta**: "posso juntar isto?".

### Merge

![A linha vermelha da branch volta para a main num commit novo, e o rótulo no ar passa para ele](/escritos/github-para-designers/07-merge.jpg "No merge, a branch volta para a main e a versão nova vai para o ar.")

O **merge** junta a branch na main. É o "Merge branch" do Figma. A mudança passa a ser oficial e, se o time publica a main automaticamente, vai para o ar.

Por que ele te protege: o merge só acontece **depois da aprovação** e com os testes passando.

### Tag

![Uma etiqueta vermelha v1.1.0 presa no commit de merge da main](/escritos/github-para-designers/08-tag.jpg "A tag dá um nome a uma versão.")

A **tag** dá um nome a uma versão, por exemplo `v1.1.0`. É como nomear uma versão no Figma como "v1.1, entregue para o dev".

Por que ela te protege: com a tag, dá para saber exatamente o que estava no ar em cada data e **voltar para aquela versão** se precisar.

### As 8 palavras numa tabela

| Palavra | O que é | No Figma seria |
|---|---|---|
| GitHub | Onde o projeto do time mora, na nuvem | A conta do time, onde ficam os arquivos |
| main | A versão oficial, em geral a que está no ar | O arquivo principal, a library publicada |
| branch | Uma cópia para mexer sem afetar a main | Criar uma branch do arquivo |
| commit | Uma foto salva das mudanças, com mensagem | Salvar uma versão com nome |
| push | Manda os commits para o GitHub | Sincronizar com a nuvem para o time ver |
| pull request | O pedido para juntar a branch na main, com revisão | O "Request review" da branch |
| merge | Junta a branch na main | O "Merge branch" |
| tag | Um nome para uma versão | Uma versão nomeada, "entregue" |

## 3. Os três lugares onde a sua mudança pode estar

Quase toda confusão com Git vem de não saber **onde** a mudança está naquele momento. São três lugares, e cada etapa leva a mudança de um para o outro.

| Lugar | O que acontece ali | Quem vê |
|---|---|---|
| **O seu computador** | Você (ou a IA) edita os arquivos. O commit salva no histórico, mas só aqui | Só você |
| **O GitHub** | O push manda os commits para cá. Aqui existem o PR e a revisão | O time |
| **O site no ar** (produção) | Em geral, uma ferramenta como a Vercel observa a main e publica sozinha tudo que entra nela | Todo mundo |

Uma frase para guardar: **o commit salva no seu computador, o push leva para o GitHub e o merge na main leva para o ar.**

## 4. O fluxo completo, passo a passo

O cenário: o projeto já está no ar e você quer ajustar o espaçamento de um card. Você não precisa decorar os comandos. O objetivo é reconhecer cada um quando a IA (ou um dev) rodar, e saber o que ele faz.

```bash
# 1. Ir para a main e trazer o que os outros já juntaram
git switch main
git pull

# 2. Criar a sua branch a partir da main atualizada
git switch -c ajuste/espacamento-card

# 3. Editar os arquivos (no editor, ou a IA edita)

# 4. Conferir o que mudou antes de salvar
git status    # quais arquivos mudaram
git diff      # as linhas exatas: o que saiu e o que entrou

# 5. Escolher o que vai no commit e salvar com uma mensagem
git add src/components/Card.css
git commit -m "Card: espaçamento de 16 para 24px, conforme o Figma"

# 6. Enviar a branch para o GitHub
git push -u origin ajuste/espacamento-card

# 7. Abrir o PR (ou clicar em "Compare & pull request" no site do GitHub)
gh pr create --base main --title "Card: espaçamento conforme o Figma"

# 8. Depois do merge, voltar para a main e atualizar
git switch main
git pull
```

Algumas observações sobre esses passos:

1. **O `git pull` antes de começar** evita partir de uma versão velha da main, que é a principal causa de conflito.
2. **O `git diff` antes do commit** é o momento de conferir se só mudou o que você esperava.
3. **O `git add` com o nome do arquivo** (em vez de `git add .`, que pega tudo) evita levar junto arquivos que você não queria.
4. **O `-u` no push** só é preciso na primeira vez: ele liga a sua branch local à branch no GitHub.
5. **Ajustes pedidos na revisão vão na mesma branch.** Você faz um commit novo, dá push, e o PR e o preview se atualizam sozinhos. Não precisa abrir outro PR.

### O que escrever na descrição do PR

A descrição é o que faz alguém aprovar sem precisar perguntar nada. Quatro blocos resolvem quase tudo:

```markdown
## O que mudou
Espaçamento interno do card de 16 para 24px.

## Por quê
Alinhar com o Figma (link do frame).

## Como testar
Abrir /projetos no preview, no desktop e no mobile.

## Antes e depois
(print) (print)

Closes #12
```

O `Closes #12` liga o PR à **issue** 12 (o pedido registrado no GitHub). Quando o PR entra na main, a issue fecha sozinha.

## 5. O mesmo fluxo pedindo para a IA

Com o Claude Code (ou o Copilot), você pede em português e a IA roda os comandos. O seu papel muda: em vez de digitar, você **confere** cada etapa antes de aprovar. A IA pede permissão para comandos como `git push`, então leia o comando antes de clicar em permitir.

| Etapa | O que pedir | O que conferir |
|---|---|---|
| Começar | "Atualiza a main e cria uma branch `ajuste/espacamento-card` para ajustar o card." | Ela rodou `git pull` antes? O nome da branch diz o que é? |
| Mudar | "Faz a mudança e me mostra o diff antes de commitar." | Só mudaram os arquivos que você esperava? |
| Commit | "Commita só os arquivos do card, com uma mensagem que diga o que mudou e por quê." | A mensagem é clara? Um assunto por commit? |
| PR | "Sobe a branch e abre um PR para a main com: o que mudou, por quê, como testar e o link do Figma." | O PR aponta para a main? A descrição está completa? O preview abriu? |
| Revisão | "Comentaram no PR que o espaço ficou grande no mobile. Ajusta na mesma branch e dá push." | Ela usou a mesma branch, sem abrir um PR novo? |
| Entender | "Me explica esse PR arquivo por arquivo, em português, e o que pode quebrar." | Serve também para revisar o PR de outras pessoas. |

### Sinais de alerta: pare e pergunte antes de aprovar

| Se aparecer | Por que é perigoso |
|---|---|
| Commit ou push direto na main | Pula a revisão. Tudo passa por branch e PR. |
| `git push --force` | Sobrescreve o histórico no GitHub e pode apagar o trabalho de outra pessoa. Em branch compartilhada, nunca. |
| `git reset --hard` | Joga fora mudanças sem volta. Pergunte o que vai ser perdido. |
| `.env`, senha ou chave no diff | Um segredo que vai para o GitHub precisa ser trocado, mesmo que você apague depois. |
| Arquivos que você não pediu | `node_modules`, `.DS_Store` e arquivos de build devem estar no `.gitignore` (a lista do que o Git ignora). |
| Desligar um teste para o PR passar | O teste falhou por um motivo. Peça para a IA explicar o motivo, não para esconder. |

## 6. Como funciona com o time

### A main sempre vai para o ar?

Na maioria dos times, sim, mas vale perguntar. O padrão comum tem três ambientes:

| Onde está o código | Para onde vai | Para que serve |
|---|---|---|
| Uma branch com PR aberto | **Preview**: um link temporário só daquele PR | Testar e fazer o design review antes de juntar |
| A main | **Produção** (ou **staging**, um "pré-produção", em times maiores) | A versão oficial. Por isso ninguém mexe nela direto |
| Uma tag (`v1.1.0`) | Um **release** marcado | Saber o que estava no ar em cada data e conseguir voltar |

Uma pergunta para o primeiro dia num time: **"O que acontece quando algo entra na main? Vai direto para o ar ou passa por staging?"** A resposta muda o cuidado que você precisa ter no merge.

### O caminho de uma mudança, do pedido até o ar

1. **Abrir uma issue.** O pedido por escrito no GitHub: o que mudar, por quê, o link do frame no Figma e quando está pronto.
2. **Combinar.** Quem mexe em quê? É só tela (front-end) ou precisa de dado novo do back-end? Combinar antes evita duas pessoas no mesmo arquivo.
3. **Branch e commits.** Quem implementa cria a branch a partir da main atualizada e faz commits pequenos, com mensagens claras.
4. **PR cedo, em rascunho.** Um PR marcado como *draft* mostra o caminho antes de terminar. Dá para corrigir a rota no começo, e não no fim.
5. **Checks e preview.** Os testes automáticos rodam (no GitHub, isso se chama **GitHub Actions** ou **CI**) e a ferramenta de deploy gera o link de preview. Check vermelho significa que algo quebrou.
6. **Revisão.** Quem é de engenharia revisa o código. Você revisa a tela no preview (o design review) e comenta no próprio PR, com print e link do Figma.
7. **Ajustes na mesma branch.** Cada push novo atualiza o mesmo PR e o mesmo preview.
8. **Aprovação e merge.** Com aprovação e checks verdes, o PR entra na main. A branch é apagada (os commits continuam na main).
9. **Deploy e conferência.** A main vai para o ar. Confira em produção. A issue fecha sozinha se o PR tinha `Closes #`.

### Onde cada conversa acontece

| Conversa | Onde |
|---|---|
| O pedido e o motivo | Na **issue** |
| A conversa sobre aquela mudança | No **PR**, com comentários na linha exata |
| Alinhar rápido | No chat ou numa call, mas a decisão final volta para a issue ou o PR |

Assim ninguém depende de lembrar "o que foi combinado naquela call".

## 7. Quero mudar algo no meio do projeto. E agora?

Essa é a dúvida mais comum quando a tela já está sendo implementada. A resposta depende de **onde o trabalho está** e do **tamanho da mudança**.

| Situação | O que fazer |
|---|---|
| **Ainda não começou** | Mude no pedido, não no código: atualize o Figma e a issue, e avise antes de a branch ser criada. |
| **PR aberto, ajuste pequeno** (espaço, cor, texto) | Comente no próprio PR, com o link do frame e um print. Quem está implementando faz o ajuste num commit novo, na mesma branch. |
| **PR aberto, mudança grande** (fluxo, componente novo) | Não mude o objetivo do PR no meio do caminho. Deixe ele terminar, abra uma issue nova e faça a mudança num PR novo depois. |
| **Já entrou na main** | Branch nova a partir da main atualizada e um PR novo. Nunca direto na main. |

Duas regras que valem em todos os casos:

- **Não edite a branch de outra pessoa sem combinar.** Seria como entrar na branch do Figma de alguém e mexer no frame que ela está desenhando. Se vocês combinarem que você mesma ajusta, avise no PR e dê `git pull` na branch antes de mexer.
- **Mudança nova pede PR novo.** PRs pequenos são mais fáceis de revisar e de desfazer.

### Quando a mudança precisa de dado novo

Muitos projetos têm um **BFF** (*Backend for Frontend*): uma camada de servidor feita sob medida para a tela, que busca dados em vários sistemas e entrega no formato que a tela precisa.

- Uma mudança **só visual** (espaço, cor, texto) não toca no BFF.
- Uma mudança que **pede um dado novo** (por exemplo, mostrar o saldo no card) toca no BFF e no front-end.

Nesse segundo caso, combine com quem cuida do back-end o formato do dado (o "contrato") antes de qualquer código. A ordem segura é: **primeiro o PR do BFF**, que *adiciona* o dado novo sem tirar nada do que já existe e vai para o ar sem quebrar a tela atual. **Depois, o PR do front-end** passa a usar o dado.

## 8. Conflito: quando duas pessoas mudam a mesma linha

Enquanto você trabalhava na sua branch, outra pessoa mudou **a mesma linha** e já juntou na main. O Git não sabe qual das duas versões vale, então para e pergunta. O arquivo fica assim:

```css
.card {
<<<<<<< main
  gap: 16px;
=======
  gap: 24px;
>>>>>>> ajuste/espacamento-card
}
```

A parte de cima é o que está na main, e a de baixo é o que está na sua branch. Resolver é escolher (ou combinar) as versões e apagar as marcas.

Pela IA, peça: *"Tem conflito com a main. Me mostra as duas versões de cada conflito e explica o que cada uma faz antes de resolver."* Se a escolha for de design, a decisão é sua. Se for de lógica, combine com quem mexeu.

No Figma é a mesma coisa: quando você faz merge de uma branch e alguém mudou o mesmo layer no arquivo principal, o Figma mostra os dois lados e pergunta qual manter. **Conflito não é erro: é o sistema pedindo uma decisão.** Branches curtas e `git pull` frequente deixam conflitos raros.

## 9. Desfazer sem pânico

O jeito certo de desfazer depende de até onde a mudança chegou. Quanto mais longe ela foi, mais seguro é desfazer **criando** algo novo, em vez de apagar.

| Situação | Comando | O que faz |
|---|---|---|
| Editei e quero descartar (ainda sem commit) | `git restore arquivo` | Volta o arquivo para o último commit. A edição se perde. |
| Errei a mensagem do último commit (ainda sem push) | `git commit --amend` | Reescreve o último commit. Só antes do push. |
| Fiz commit na main sem querer (ainda sem push) | Peça para a IA "mover esse commit para uma branch nova" | Cria a branch com o commit e deixa a main como estava. |
| Já entrou na main e quebrou algo no ar | `git revert <commit>` (ou o botão "Revert" no PR) | Cria um commit novo que desfaz o anterior, sem apagar o histórico, e passa por PR como qualquer mudança. |

O `revert` é a resposta para o medo do começo: **mesmo depois do merge, dá para desfazer.** O erro vira só mais um capítulo do histórico.

## 10. Boas práticas, mesmo no vibe coding

1. **Nunca direto na main.** Tudo passa por branch e PR. Em repositórios do time, ative a proteção da main (Settings → Branches).
2. **`git pull` antes de começar.** Começar de uma main velha é a principal fonte de conflito.
3. **Branch curta e com nome.** `feat/filtro-extrato`, `fix/botao-mobile`, `design/espacamento-card`. Ela vive dias, não semanas. Pergunte se o time tem um padrão.
4. **Commit pequeno, um assunto.** Fica fácil de revisar e de desfazer só aquela parte.
5. **Mensagem que diz o que e por quê.** "Card: espaçamento de 16 para 24px, conforme o Figma", e não "ajustes" ou "wip". Muitos times usam o padrão `feat:` / `fix:`.
6. **PR pequeno, com descrição.** O que mudou, por quê, como testar, antes e depois. Um PR de 50 linhas é revisado de verdade; um de 2.000 é aprovado sem ler.
7. **Leia o diff antes de aprovar**, principalmente o que a IA fez. Arquivo que você não esperava ver é sinal para perguntar.
8. **Segredo não entra no Git.** Chaves e senhas ficam no `.env`, e o `.env` fica no `.gitignore`. Se vazou, troque a chave.
9. **Checks verdes antes do merge.** Check vermelho é o projeto avisando que algo quebrou.
10. **Apague a branch depois do merge.** Os commits ficam na main e a lista de branches fica limpa.
11. **Um README que explica o projeto**: como rodar e como contribuir. É a primeira coisa que alguém do time (ou uma IA) lê.
12. **Tag nas versões importantes.** `v1.0.0` quando vai para o ar. Fica fácil saber o que estava publicado e voltar.

## 11. Cola de comandos

Os comandos que você vai ver a IA rodar, do mais seguro ao mais perigoso:

| Comando | O que faz | Risco |
|---|---|---|
| `git status` | Mostra em que branch você está e o que mudou | Nenhum, só lê |
| `git diff` | Mostra as linhas que mudaram e ainda não estão num commit | Nenhum, só lê |
| `git log --oneline` | Lista os commits, um por linha | Nenhum, só lê |
| `git switch -c nome` | Cria uma branch e entra nela | Nenhum |
| `git switch nome` | Troca de branch | Baixo |
| `git pull` | Traz do GitHub o que mudou | Baixo (pode gerar conflito) |
| `git add arquivo` | Separa o arquivo para o próximo commit | Confira se não pegou arquivo a mais |
| `git commit -m "…"` | Salva a foto no histórico, no seu computador | Baixo |
| `git push` | Envia os commits para o GitHub | Médio: o time passa a ver |
| `gh pr create` | Abre um pull request | Baixo |
| `git revert` | Desfaz um commit criando outro | Baixo, é o jeito seguro |
| `git reset --hard` | Apaga mudanças sem volta | **Alto** |
| `git push --force` | Sobrescreve o histórico no GitHub | **Alto** |

## 12. Um caminho para praticar

Pratique num repositório seu, onde errar não atrapalha ninguém:

1. **O ciclo completo.** Peça para a IA criar uma branch para um ajuste pequeno (um texto do README, por exemplo), leia o diff, abra o PR e faça o merge você mesma no site do GitHub. Você está pronta quando consegue dizer, a cada passo, onde a mudança está: no computador, no GitHub ou no ar.
2. **PR, revisão e issues.** Abra uma issue, peça um PR que a resolva e revise comentando linhas no GitHub. Depois, peça para a IA revisar o mesmo PR e compare com a sua leitura.
3. **Quando dá errado.** Crie de propósito duas branches que mudam a mesma linha e peça para a IA explicar o conflito antes de resolver. Ative a proteção da main no repositório.
4. **Do merge ao ar.** Num projeto com deploy automático, faça o design review pelo link de preview de um PR e crie uma tag e um release depois do merge.

![Fechamento: cada um na sua branch, todo mundo na mesma main, com a sequência branch, commit, push, PR, merge e tag](/escritos/github-para-designers/09-resumo.jpg "O fluxo inteiro numa linha.")

## Para levar

O que quebra código não é designer abrindo PR, é **pular etapa**: mexer direto na main, juntar sem revisão, ignorar o teste que ficou vermelho. Seguindo o caminho, o pior que pode acontecer é alguém comentar no seu PR pedindo um ajuste, e isso é ótimo, porque é assim que a gente aprende junto com a engenharia.

Se der para guardar uma frase só: **cada um na sua branch, todo mundo na mesma main.**

E no vibe coding, a IA digita os comandos, mas quem decide é você. Saber onde a mudança está e o que cada etapa protege é o que permite aprovar o que a IA fez com tranquilidade, ou parar e perguntar antes.
