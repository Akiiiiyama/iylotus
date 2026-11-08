import type { Meta, StoryObj } from '@storybook/react';
import { Tag } from './Tag';

const meta = {
  title: 'Components/Support/Tag',
  component: Tag,
  args: { children: 'Role 01 / 02' },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Examples: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      <Tag>Role 01 / 02</Tag>
      <Tag>Design Systems</Tag>
      <Tag>React</Tag>
      <Tag>Case · Product</Tag>
    </div>
  ),
};
