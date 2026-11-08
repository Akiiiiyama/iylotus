import type { Meta, StoryObj } from '@storybook/react';
import { Switch } from './Switch';

const meta = {
  title: 'Components/Inputs/Switch',
  component: Switch,
  args: { label: 'Dark mode', defaultChecked: true },
  parameters: {
    docs: { description: { component: 'O toggle do reel. Para ajustes que valem na hora; dentro de formulário, use Checkbox.' } },
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start' }}>
      <Switch label="Off" />
      <Switch label="On" defaultChecked />
      <Switch label="Label after" labelPosition="end" defaultChecked />
      <Switch label="Disabled" disabled />
    </div>
  ),
};
