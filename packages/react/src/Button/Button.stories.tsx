import type { Meta, StoryObj } from '@storybook/react';
import { Button, type ButtonVariant } from './Button';

const Arrow = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8h10M9 4l4 4-4 4" /></svg>
);
const Plus = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M8 3v10M3 8h10" /></svg>
);

const meta = {
  title: 'Components/Button',
  component: Button,
  args: { children: 'View work', variant: 'accent', size: 'md' },
  argTypes: {
    variant: { control: 'inline-radio', options: ['primary', 'accent', 'secondary', 'ghost', 'link'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    iconStart: { control: false },
    iconEnd: { control: false },
  },
  parameters: {
    docs: {
      description: {
        component: 'Ação clicável. `accent` (vermelho) é a ação principal e aparece uma vez por tela. Figma: `Button / variant, size, state`.',
      },
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

const VARIANTS: ButtonVariant[] = ['primary', 'accent', 'secondary', 'ghost', 'link'];

/** As 5 variantes nos estados que dá para mostrar parados. Hover, pressed e focus funcionam ao vivo. */
export const Matrix: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: '96px repeat(4, max-content)', gap: '18px 20px', alignItems: 'center' }}>
      <span />
      {['default', 'disabled', 'loading', 'with icon'].map((s) => <span key={s} className="iy-story-label">{s}</span>)}
      {VARIANTS.map((v) => [
        <span key={`${v}-l`} className="iy-story-label">{v}</span>,
        <Button key={`${v}-d`} variant={v}>Button</Button>,
        <Button key={`${v}-x`} variant={v} disabled>Button</Button>,
        <Button key={`${v}-b`} variant={v} loading>Saving</Button>,
        <Button key={`${v}-i`} variant={v} iconEnd={<Arrow />}>View case</Button>,
      ])}
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
      <Button variant="accent" size="sm">Small 32</Button>
      <Button variant="accent" size="md">Medium 44</Button>
      <Button variant="accent" size="lg">Large 56</Button>
    </div>
  ),
};

export const IconOnly: Story = {
  args: { children: undefined, variant: 'secondary', iconStart: <Plus />, 'aria-label': 'Add project' },
};

export const Loading: Story = {
  args: { loading: true, children: 'Saving' },
};

export const FullWidth: Story = {
  args: { fullWidth: true, children: 'Send message' },
  render: (args) => <div style={{ maxWidth: 360 }}><Button {...args} /></div>,
};
