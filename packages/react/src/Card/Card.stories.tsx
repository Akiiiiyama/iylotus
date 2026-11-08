import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardBody, CardMedia, CardMeta, CardStat, CardTag, CardTitle } from './Card';

const Logo = ({ dot }: { dot?: string }) => (
  <span style={{ fontWeight: 700, fontSize: 'clamp(52px, 6vw, 88px)', letterSpacing: '-0.04em', lineHeight: 1 }} aria-hidden="true">
    IY<span className="iy-dot" style={dot ? { color: dot } : undefined}>.</span>
  </span>
);

const meta = {
  title: 'Components/Card',
  component: Card,
  args: { tone: 'raised', shape: 'rounded', children: null },
  argTypes: {
    tone: { control: 'inline-radio', options: ['raised', 'grey', 'ink', 'red'] },
    shape: { control: 'inline-radio', options: ['rounded', 'tile'] },
    children: { control: false },
  },
  parameters: {
    docs: { description: { component: 'Agrupa um assunto. `raised` segue o tema; `grey`, `ink` e `red` são cenas fixas do reel. Com `href`, o card inteiro vira um link.' } },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Card de case do portfólio: mídia, tag, título leve/negrito e meta. O card inteiro é o link. */
export const Project: Story = {
  render: (args) => (
    <div style={{ maxWidth: 320 }}>
      <Card {...args} href="#case">
        <CardMedia aria-hidden="true"><Logo /></CardMedia>
        <CardBody>
          <CardTag>Case</CardTag>
          <CardTitle><span className="iy-lt">Design </span><span className="iy-bd">System</span></CardTitle>
          <CardMeta>Product · Design Engineering →</CardMeta>
        </CardBody>
      </Card>
    </div>
  ),
};

/** Os quatro artefatos do reel, colados (gap 2), como na seção Craft. */
export const Artifacts: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2, maxWidth: 1040 }}>
      <Card tone="grey" shape="tile">
        <CardTag>Tokens</CardTag>
        <Logo />
        <CardMeta>--accent: #C8102E;</CardMeta>
      </Card>
      <Card tone="ink" shape="tile" href="#case">
        <CardTag>Case</CardTag>
        <CardTitle><span className="iy-lt">Design </span><span className="iy-bd">System</span></CardTitle>
        <CardMeta>Product · Design Engineering →</CardMeta>
      </Card>
      <Card tone="red" shape="tile">
        <CardTag>Accessibility</CardTag>
        <Logo />
        <span style={{ alignSelf: 'flex-start', background: '#FFFFFF', color: '#141414', borderRadius: 999, padding: '6px 14px', fontWeight: 700, fontSize: 14 }}>AA 5.9 : 1</span>
      </Card>
      <Card tone="raised" shape="tile">
        <CardTag>Stat</CardTag>
        <CardStat value="12" suffix="+" />
        <CardMeta>components in v1</CardMeta>
      </Card>
    </div>
  ),
};

export const Base: Story = {
  render: (args) => (
    <div style={{ maxWidth: 360 }}>
      <Card {...args}>
        <CardBody>
          <CardTag>Base</CardTag>
          <CardTitle><span className="iy-lt">Card </span><span className="iy-bd">base</span></CardTitle>
          <p style={{ margin: 0, fontSize: 14, color: 'var(--color-text-secondary)' }}>Superfície, borda hairline, raio lg e padding 24. Serve de base para os outros.</p>
          <CardMeta>padding 24 · radius 18</CardMeta>
        </CardBody>
      </Card>
    </div>
  ),
};
