import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Radio, RadioGroup } from './Radio';

const meta = {
  title: 'Components/Inputs/RadioGroup',
  component: RadioGroup,
  args: { legend: 'Your role', defaultValue: 'engineer', children: null },
  argTypes: { children: { control: false } },
  render: (args) => (
    <RadioGroup {...args}>
      <Radio value="engineer" label="Design Engineer" />
      <Radio value="product" label="Product Designer" />
      <Radio value="systems" label="Design Systems" hint="Tokens, components and docs" />
    </RadioGroup>
  ),
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Row: Story = { args: { direction: 'row' } };
export const WithError: Story = { args: { defaultValue: undefined, error: 'Choose one option' } };
export const Disabled: Story = { args: { disabled: true } };

/** Grupo controlado: o valor vive no estado do React. */
export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = useState('product');
    return (
      <div style={{ display: 'grid', gap: 16 }}>
        <RadioGroup {...args} defaultValue={undefined} value={value} onChange={(e) => setValue(e.target.value)}>
          <Radio value="engineer" label="Design Engineer" />
          <Radio value="product" label="Product Designer" />
        </RadioGroup>
        <code className="iy-story-label">value: {value}</code>
      </div>
    );
  },
};
