import type { Meta, StoryObj } from '@storybook/react';
import { TextArea } from './TextArea';

const meta = {
  title: 'Components/Inputs/TextArea',
  component: TextArea,
  args: { label: 'Message', placeholder: 'Tell me about the project', hint: 'A few lines are enough', maxLength: 280, showCount: true },
  decorators: [(Story) => <div style={{ maxWidth: 480 }}><Story /></div>],
} satisfies Meta<typeof TextArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const WithError: Story = { args: { defaultValue: 'Hi', error: 'Write at least 20 characters' } };
export const Disabled: Story = { args: { disabled: true, defaultValue: 'Sent on Nov 8' } };
