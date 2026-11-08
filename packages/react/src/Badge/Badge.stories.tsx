import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './Badge';

const meta = {
  title: 'Components/Support/Badge',
  component: Badge,
  args: { children: 'AA 5.9 : 1', tone: 'accent' },
  argTypes: { tone: { control: 'inline-radio', options: ['accent', 'neutral', 'outline'] } },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Tones: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
      <Badge tone="accent">AA 5.9 : 1</Badge>
      <Badge tone="neutral">v0.1.0</Badge>
      <Badge tone="outline">Draft</Badge>
    </div>
  ),
};
