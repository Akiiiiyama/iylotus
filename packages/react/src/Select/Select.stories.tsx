import type { Meta, StoryObj } from '@storybook/react';
import { Select } from './Select';

const ROLES = ['Design Engineer', 'Product Designer', 'UX/UI Designer', 'Design Systems'];

const meta = {
  title: 'Components/Inputs/Select',
  component: Select,
  args: {
    label: 'Role',
    placeholder: 'Choose a role',
    hint: 'Native select: works with keyboard and mobile pickers',
    children: ROLES.map((r) => <option key={r} value={r}>{r}</option>),
  },
  argTypes: { children: { control: false } },
  decorators: [(Story) => <div style={{ maxWidth: 360 }}><Story /></div>],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Selected: Story = { args: { defaultValue: 'Design Engineer', placeholder: undefined } };
export const WithError: Story = { args: { error: 'Choose a role to continue' } };
export const Disabled: Story = { args: { disabled: true } };
