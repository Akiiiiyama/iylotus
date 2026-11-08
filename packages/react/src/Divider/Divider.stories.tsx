import type { Meta, StoryObj } from '@storybook/react';
import { Divider } from './Divider';

const meta = {
  title: 'Components/Support/Divider',
  component: Divider,
  args: { weight: 'hairline' },
  argTypes: { weight: { control: 'inline-radio', options: ['hairline', 'strong'] } },
} satisfies Meta<typeof Divider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { render: (args) => <div style={{ maxWidth: 520 }}><Divider {...args} /></div> };
export const UnderTitle: Story = {
  render: () => (
    <div style={{ maxWidth: 520, display: 'grid', gap: 14 }}>
      <h3 style={{ margin: 0, fontSize: 40, fontWeight: 300, letterSpacing: '-0.03em' }}>Comp<b>onents</b></h3>
      <Divider weight="strong" />
      <p style={{ margin: 0 }}>Strong under section titles, hairline between items.</p>
      <Divider />
      <p style={{ margin: 0 }}>Next item</p>
    </div>
  ),
};
