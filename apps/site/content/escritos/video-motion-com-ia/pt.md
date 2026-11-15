## Resumo

- O vídeo nasce de **uma frase com vírgulas**: cada vírgula vira uma transição. Exemplo: "Hi, I'm IY., Isabela Yukari, Design Engineer".
- A IA não abre o After Effects: ela **escreve a animação em código** (uma página HTML) e grava quadro a quadro em MP4. Por isso dá para mudar qualquer detalhe pedindo em texto.
- O que deixa o vídeo com cara de "desenhado" é a **estratégia**: um arco narrativo e **um objeto-herói** que atravessa o vídeo inteiro e fecha o ciclo no logo.
- A música **vem de você** (com licença). A IA analisa a faixa, acha os golpes da batida e prende cada transição neles.
- Antes de entregar, peça para a IA **conferir os quadros**: falhas de um único quadro passam despercebidas e aparecem no celular.

---

## 1. O que você vai criar

Um vídeo de 10 a 20 segundos, horizontal (16:9) ou vertical (9:16, para Stories e Reels), com:

- tipografia animada com as palavras da sua frase;
- linhas-guia e anotações técnicas, como numa ferramenta de design;
- um objeto que se transforma ao longo do vídeo (no exemplo, o ponto vermelho do logo vira esfera, vira a íris de um olho e volta a ser o ponto);
- a paleta, as fontes e as curvas de animação do seu design system;
- trilha sincronizada: a batida entra junto com a primeira transição.

## 2. O que preparar antes de pedir

| Item | Exemplo | Por que importa |
|---|---|---|
| **Frase com vírgulas** | "Hi, I'm IY., Isabela Yukari, Design Engineer" | Define quantas cenas e transições o vídeo tem. |
| **Referência** | Um post ou reel de motion que você admira | Dá ritmo e clima. Se for do Instagram, mande prints ou descreva: a IA geralmente não consegue assistir sem login. |
| **Sua marca** | Repositório do portfólio, Figma ou site | Cores, fontes, logo e curvas de animação saem daqui. |
| **Formato e duração** | 16:9, 20 segundos | Vertical não é recorte do horizontal: precisa ser recomposto. |
| **Clima em duas palavras** | "futurista e doce" | Guia o uso da cor, o peso do movimento e a música. |
| **Música licenciada** | Arquivo MP3 de um banco que você assina | A IA não baixa músicas de bancos por você. |

> Dica: decida **claro ou escuro** logo no começo. É a mudança mais cara depois que o vídeo existe.

## 3. A estratégia (o que separa um vídeo bonito de um vídeo memorável)

### Arco em cinco momentos

1. **Gancho**: algo se desenha na tela (linhas-guia, um ponto que cai).
2. **Identidade**: seu nome.
3. **Símbolo**: uma metáfora de como você trabalha. No exemplo, um olho que abre, olha para os lados e pisca: "visão de design".
4. **Papel**: o que você faz ("Design Engineer").
5. **Fechamento**: o logo.

### Um objeto-herói que fecha o ciclo

Escolha um elemento do seu logo (um ponto, uma letra, uma forma) e faça ele **viajar pelo vídeo inteiro**. No exemplo:

ponto vermelho cai → vira esfera de vidro → vira a íris do olho → volta a ser esfera → encolhe e vira o ponto do "IY.".

Começar e terminar no mesmo elemento faz 20 segundos parecerem planejados, e não montados.

### Elementos culturais, com cuidado

Se o vídeo carrega a sua identidade (no exemplo, katakana na vertical, um traço de ensō e um olho amendoado), peça que seja desenhado com elegância, em traço fino e **sem caricatura**. Use quando faz parte de quem você é, não como enfeite.

### Ritmo de leitura

Cada frase precisa ficar **inteira na tela por pelo menos 1,5 segundo**. No exemplo, a primeira versão de 12 segundos ficou rápida demais, e a final tem 20.

## 4. Passo a passo com o Claude Code

1. **Briefing.** Mande a frase, a referência e onde está a sua marca. Exemplo de pedido:
   > Quero um vídeo de motion de 20s, 16:9, no estilo desta referência. Texto: "Hi, I'm IY., Isabela Yukari, Design Engineer". Cada vírgula é uma transição. Use o design system do repositório do meu portfólio. Clima: futurista com glassmorfismo, mas doce.
2. **Estratégia.** Peça o arco e o objeto-herói **antes do código** e aprove o roteiro cena a cena.
3. **Primeira versão em quadros.** A IA monta a cena e mostra uma prancha com 9 a 12 quadros-chave. É mais rápido ajustar direção aqui do que num vídeo pronto.
4. **Ajustes em texto.** Exemplos reais deste projeto:
   - "Não quero escuro, quero a paleta do meu portfólio."
   - "Coloque um olho puxado no meio do vídeo."
   - "No final, a bola pode diminuir e virar o ponto vermelho do IY."
   - "Não passe tão rápido, deixe as palavras aparecerem mais devagar."
5. **Música.** Envie o arquivo. A IA encontra o andamento, os golpes fortes e o trecho em que a batida entra (veja a seção 5).
6. **Sincronização.** A IA ajusta o tempo de cada cena para que as transições caiam nos golpes.
7. **Render e conferência.** O vídeo é gravado a 60 quadros por segundo. Peça a varredura de quadros com defeito antes de receber o arquivo.
8. **Entrega.** Receba o MP4 e confira com som, de fone.

## 5. Música: o que pedir e o que conferir

- **Achar o golpe certo, não só o andamento.** A análise automática de ritmo pode errar por uma proporção (no exemplo, ela leu 80 BPM numa música de 120). Peça que a IA confira a lista de golpes fortes.
- **Começar perto do "drop".** O momento em que a batida volta depois de uma pausa é o melhor lugar para a primeira transição.
- **Fugir da voz.** Voz cantada compete com o texto na tela. Peça um trecho instrumental e ouça para confirmar.
- **Emendar só na batida.** Cortar dentro de uma pausa da própria música soa como um buraco (aconteceu no exemplo).
- **Terminar com o final real da música**, em vez de um fade no meio de uma frase musical.
- **Direitos:** para publicar, a licença precisa cobrir a plataforma. Outra saída é exportar o vídeo só com efeitos sonoros e adicionar a música pela biblioteca do próprio Instagram.

## 6. Erros comuns e como evitar

| Problema | O que fazer |
|---|---|
| Um "piscão" de um quadro no vídeo | Pedir a varredura de quadros com defeito antes da entrega. |
| Vidro (desfoque de fundo) que some em alguns quadros | Simular o vidro com gradiente e brilho, sem desfoque de fundo. |
| Vídeo rápido demais para ler | Pelo menos 1,5s por frase. Peça para desacelerar sem mudar a ordem das cenas. |
| Música com voz por cima do texto | Escolher trecho instrumental ou trocar o compasso com voz por um sem voz. |
| Gap no fim da música | Usar o final verdadeiro da faixa, emendado na batida. |
| Final genérico ("abre uma bola com o logo dentro") | Fechar o ciclo: o objeto-herói vira parte do logo. |
| Versão vertical cortada da horizontal | Recompor a cena em 1080×1920. |

## 7. Checklist final

- [ ] Frase dividida por vírgulas e cada transição com um nome
- [ ] Um objeto-herói que começa e termina o vídeo
- [ ] Cores, fontes e curvas do seu design system
- [ ] Cada frase legível por pelo menos 1,5s
- [ ] Transições nos golpes fortes da música
- [ ] Trecho sem voz, sem buraco nas emendas, com final musical
- [ ] Varredura de quadros sem defeitos
- [ ] Assistido com som antes de publicar

---

Para quem usa o Claude Code, o processo inteiro está empacotado na skill [`brand-motion-intro`](https://github.com/Akiiiiyama/skills-para-designers/tree/main/skills/01-explore/brand-motion-intro), do repositório *skills-para-designers*, com os scripts de render, análise de batida, emenda de áudio e varredura de quadros.
