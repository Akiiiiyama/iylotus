import type { Meta, StoryObj } from '@storybook/react';
import { TextField } from './TextField';

const Search = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="7" cy="7" r="5" /><path d="M11 11l3 3" /></svg>
);

const meta = {
  title: 'Components/Inputs/TextField',
  component: TextField,
  args: { label: 'Email', placeholder: 'you@email.com', hint: 'Only to reply to you' },
  parameters: {
    docs: { description: { component: 'Campo de texto com rótulo sempre visível, ajuda e erro ligados por `aria-describedby`. Figma: `TextField / state`.' } },
  },
  decorators: [(Story) => <div style={{ maxWidth: 360 }}><Story /></div>],
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** Os estados lado a lado. Focus funciona ao vivo: clique num campo. */
export const States: Story = {
  decorators: [(Story) => <div style={{ maxWidth: 'none' }}><Story /></div>],
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 32, maxWidth: 1040 }}>
      <TextField label="Name" placeholder="Isabela Yukari" hint="How you want to be called" />
      <TextField label="Portfolio" prefix="https://" defaultValue="isabelayukari.com" hint="Fixed prefix" />
      <TextField label="Email" defaultValue="isabela@" error="Add the domain, like isabela@email.com" />
      <TextField label="Company" placeholder="Unavailable" disabled hint="Unlocks after the previous step" />
      <TextField label="Find a component" type="search" prefix={<Search />} suffix="⌘K" placeholder="Button, Card…" />
      <TextField label="Headline" defaultValue="Design Engineer" maxLength={40} showCount />
    </div>
  ),
};

export const WithError: Story = {
  args: { defaultValue: 'isabela@', error: 'Add the domain, like isabela@email.com' },
};
