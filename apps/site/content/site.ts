// Conteúdo do site em inglês e português. Vem da versão pública do portfólio, sem dados internos de empresas:
// os projetos das empresas aparecem só pelo tipo de trabalho, e os detalhes ficam para uma conversa no LinkedIn.

export const LANGS = ['en', 'pt'] as const;
export type Lang = (typeof LANGS)[number];

export const LINKS = {
  github: 'https://github.com/Akiiiiyama',
  // TODO: trocar pelo endereço do perfil da Isabela no LinkedIn.
  linkedin: 'https://www.linkedin.com/',
  iylotus: 'https://github.com/Akiiiiyama/iylotus',
  skill: 'https://github.com/Akiiiiyama/skills-para-designers/tree/main/skills/brand-motion-intro',
  pilulas: 'https://github.com/Akiiiiyama/pilulas-ia',
};

/** Trecho com destaque: texto normal, depois o destaque, depois o resto. */
export type Highlight = { a: string; hl?: string; b?: string };

type Project = {
  id: 'iylotus' | 'site' | 'skill' | 'pilulas';
  tag: string;
  title: [string, string];
  body: string;
  meta: string;
  href: string;
  cta: string;
};

type Job = { years: string; org: string; role: string; work: string };

export type Dict = {
  nav: { work: string; experience: string; about: string; contact: string };
  theme: string;
  langSwitch: string;
  skip: string;
  hero: { label: string; counter: string; subtitle: string; line: Highlight; ctaWork: string };
  work: { label: string; title: [string, string]; lede: string; projects: Project[] };
  experience: { label: string; title: [string, string]; lede: string; jobs: Job[]; cta: string; ctaButton: string };
  about: { label: string; title: [string, string]; bio: Highlight[]; keywordsLabel: string; keywords: string[]; stackLabel: string; stack: { group: string; items: string[] }[] };
  contact: { label: string; title: [string, string]; body: string; linkedin: string; github: string };
  footer: string;
};

const STACK_ITEMS = {
  design: ['Figma', 'FigJam', 'Framer', 'Notion', 'Maze'],
  ai: ['Claude Code', 'Claude Design', 'Cursor', 'Antigravity', 'Gemini Enterprise', 'Codex', 'Devin', 'v0'],
  code: ['HTML / CSS', 'React', 'Next.js', 'TypeScript', 'GitHub', 'WebGL'],
};

export const dict: Record<Lang, Dict> = {
  en: {
    nav: { work: 'Work', experience: 'Experience', about: 'About', contact: 'Contact' },
    theme: 'Dark mode',
    langSwitch: 'Português',
    skip: 'Skip intro',
    hero: {
      label: 'Design Engineer · São Paulo',
      counter: '00 / 05',
      subtitle: 'I design in pixels and ship in code.',
      line: { a: 'Senior Design Engineer with ', hl: '10+ years across design and engineering', b: ', building digital products. Currently at Itaú Unibanco, the largest bank in Latin America.' },
      ctaWork: 'See the work',
    },
    work: {
      label: 'Work',
      title: ['Things I ', 'build'],
      lede: 'Projects I design and ship end to end, from the first sketch to the code that runs them.',
      projects: [
        { id: 'iylotus', tag: 'Design system', title: ['IY ', 'Lotus'], body: 'My design system. Tokens in four layers, from root to bloom, light and dark themes checked for WCAG contrast, and React components documented in Storybook.', meta: 'Figma · Tokens · React · npm', href: LINKS.iylotus, cta: 'View on GitHub' },
        { id: 'site', tag: 'This website', title: ['Built with ', 'Lotus'], body: 'The first product made with IY Lotus. Next.js and React, a WebGL intro that runs at 60 fps, English and Portuguese, light and dark.', meta: 'Next.js · WebGL · TypeScript', href: LINKS.iylotus, cta: 'View the code' },
        { id: 'skill', tag: 'AI tooling', title: ['Motion in ', 'code'], body: 'A Claude Code skill that turns one sentence, a design system and a music track into a motion video, with every cut on the beat.', meta: 'Claude Code · Skill · Motion', href: LINKS.skill, cta: 'See the skill' },
        { id: 'pilulas', tag: 'Writing', title: ['AI ', 'pills'], body: 'Short guides for designers on prompts, agents and AI-made motion, in Portuguese and English.', meta: 'Guides · PT / EN', href: LINKS.pilulas, cta: 'Read the guides' },
      ],
    },
    experience: {
      label: 'Experience',
      title: ['Where I ', 'worked'],
      lede: 'Product design for banking and retail, and an engineering background that started it all.',
      jobs: [
        { years: '2023 — now', org: 'Itaú Unibanco', role: 'Senior Design Engineer · Product Designer', work: 'Customer benefits program · Account migration, onboarding and cross-sell' },
        { years: '2022 — 2023', org: 'Midway · Riachuelo', role: 'Product Designer', work: 'Account and card acquisition and activation' },
        { years: '2021 — 2022', org: 'Hub Delivery', role: 'Product Designer · Freelance', work: 'Internal platform for the operations team' },
        { years: '2016 — 2022', org: 'RD', role: 'Engineer · Expansion specialist', work: 'Retail store expansion projects' },
      ],
      cta: 'Behind every line there is a design decision and a code decision. I’ll tell you about them on LinkedIn.',
      ctaButton: 'Talk on LinkedIn',
    },
    about: {
      label: 'About',
      title: ['Design ', 'Engineer'],
      bio: [
        { a: 'Ten years of professional experience, the last five in digital product. My foundation is end-to-end product design: discovery, research, flows, prototyping, usability testing, design systems and metrics. ', hl: 'AI sits on top of that foundation', b: ', not in place of it.' },
        { a: 'I don’t just use AI tools: ', hl: 'I build the ones my team uses', b: '. Reusable skills, playbooks and prompts that turn good practice into capabilities the whole squad can reuse, always with a human in the loop.' },
        { a: 'That is what I call ', hl: 'design2code', b: ': working prototypes and specs engineering uses directly. My engineering background holds this up, with systems thinking and comfort with real constraints. I work in the space where design and engineering happen at the same time.' },
      ],
      keywordsLabel: 'Keywords',
      keywords: ['Design engineering', 'AI-first product design', 'Design-to-code', 'Agentic workflows', 'Design systems', 'Interaction design', 'Motion design', 'Accessibility', 'User research', 'Fintech'],
      stackLabel: 'Tools',
      stack: [
        { group: 'Design', items: STACK_ITEMS.design },
        { group: 'AI & agents', items: STACK_ITEMS.ai },
        { group: 'Code', items: STACK_ITEMS.code },
      ],
    },
    contact: {
      label: 'Contact',
      title: ['Let’s ', 'talk'],
      body: 'Hiring for design engineering, or curious about how I work? Send me a message on LinkedIn.',
      linkedin: 'LinkedIn',
      github: 'GitHub',
    },
    footer: 'Designed and built by Isabela Yukari with IY Lotus.',
  },
  pt: {
    nav: { work: 'Projetos', experience: 'Experiência', about: 'Sobre', contact: 'Contato' },
    theme: 'Modo escuro',
    langSwitch: 'English',
    skip: 'Pular abertura',
    hero: {
      label: 'Design Engineer · São Paulo',
      counter: '00 / 05',
      subtitle: 'Desenho em pixels e entrego em código.',
      line: { a: 'Senior Design Engineer com ', hl: '+10 anos entre design e engenharia', b: ', construindo produtos digitais. Hoje no Itaú Unibanco, o maior banco da América Latina.' },
      ctaWork: 'Ver projetos',
    },
    work: {
      label: 'Projetos',
      title: ['O que eu ', 'construo'],
      lede: 'Projetos que eu desenho e entrego de ponta a ponta, do primeiro rascunho ao código que faz tudo funcionar.',
      projects: [
        { id: 'iylotus', tag: 'Design system', title: ['IY ', 'Lotus'], body: 'Meu design system. Tokens em quatro camadas, da raiz ao florescer, temas claro e escuro com contraste WCAG verificado e componentes React documentados no Storybook.', meta: 'Figma · Tokens · React · npm', href: LINKS.iylotus, cta: 'Ver no GitHub' },
        { id: 'site', tag: 'Este site', title: ['Feito com ', 'Lotus'], body: 'O primeiro produto feito com o IY Lotus. Next.js e React, uma abertura em WebGL a 60 quadros por segundo, português e inglês, claro e escuro.', meta: 'Next.js · WebGL · TypeScript', href: LINKS.iylotus, cta: 'Ver o código' },
        { id: 'skill', tag: 'Ferramenta de IA', title: ['Motion em ', 'código'], body: 'Uma skill do Claude Code que transforma uma frase, um design system e uma música num vídeo de motion, com cada corte na batida.', meta: 'Claude Code · Skill · Motion', href: LINKS.skill, cta: 'Ver a skill' },
        { id: 'pilulas', tag: 'Escrita', title: ['Pílulas de ', 'IA'], body: 'Guias curtos para designers sobre prompts, agentes e motion feito com IA, em português e inglês.', meta: 'Guias · PT / EN', href: LINKS.pilulas, cta: 'Ler os guias' },
      ],
    },
    experience: {
      label: 'Experiência',
      title: ['Por onde ', 'passei'],
      lede: 'Design de produto para banco e varejo, e uma formação em engenharia que começou tudo.',
      jobs: [
        { years: '2023 — hoje', org: 'Itaú Unibanco', role: 'Senior Design Engineer · Product Designer', work: 'Programa de vantagens para clientes · Migração de contas, onboarding e cross-sell' },
        { years: '2022 — 2023', org: 'Midway · Riachuelo', role: 'Product Designer', work: 'Aquisição e ativação de contas e cartões' },
        { years: '2021 — 2022', org: 'Hub Delivery', role: 'Product Designer · Freelance', work: 'Plataforma interna do time de operações' },
        { years: '2016 — 2022', org: 'RD', role: 'Engenheira · Especialista em expansão', work: 'Projetos de expansão de lojas de varejo' },
      ],
      cta: 'Por trás de cada linha tem uma decisão de design e uma de código. Te conto no LinkedIn.',
      ctaButton: 'Conversar no LinkedIn',
    },
    about: {
      label: 'Sobre',
      title: ['Design ', 'Engineer'],
      bio: [
        { a: 'São dez anos de experiência profissional, os últimos cinco em produto digital. Minha base é design de produto de ponta a ponta: discovery, pesquisa, fluxos, prototipagem, testes de usabilidade, design system e métricas. ', hl: 'A IA entra por cima dessa base', b: ', não no lugar dela.' },
        { a: 'Não só uso ferramentas de IA: ', hl: 'construo as que o time usa', b: '. Skills, playbooks e prompts reutilizáveis que transformam boas práticas em capacidades da squad inteira, sempre com humano no loop.' },
        { a: 'É o que chamo de ', hl: 'design2code', b: ': protótipos funcionais e especificações que engenharia usa direto. Minha formação em engenharia sustenta isso, com pensamento sistêmico e conforto com restrições reais. Trabalho no espaço onde design e engenharia acontecem ao mesmo tempo.' },
      ],
      keywordsLabel: 'Palavras-chave',
      keywords: ['Design engineering', 'Design de produto AI-first', 'Design2Code', 'Fluxos com agentes', 'Design system', 'Interaction design', 'Motion design', 'Acessibilidade', 'Pesquisa com usuários', 'Fintech'],
      stackLabel: 'Ferramentas',
      stack: [
        { group: 'Design', items: STACK_ITEMS.design },
        { group: 'IA e agentes', items: STACK_ITEMS.ai },
        { group: 'Código', items: STACK_ITEMS.code },
      ],
    },
    contact: {
      label: 'Contato',
      title: ['Vamos ', 'conversar'],
      body: 'Contratando para design engineering, ou curioso sobre como eu trabalho? Me manda uma mensagem no LinkedIn.',
      linkedin: 'LinkedIn',
      github: 'GitHub',
    },
    footer: 'Desenhado e construído por Isabela Yukari com o IY Lotus.',
  },
};
