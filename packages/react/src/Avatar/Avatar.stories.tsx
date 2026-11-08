import type { Meta, StoryObj } from '@storybook/react';
import { Avatar } from './Avatar';

const meta = {
  title: 'Components/Support/Avatar',
  component: Avatar,
  args: { name: 'Isabela Yukari', size: 'md', dot: true },
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] } },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <Avatar name="Isabela Yukari" size="sm" />
      <Avatar name="Isabela Yukari" size="md" />
      <Avatar name="Isabela Yukari" size="lg" />
      <Avatar name="Isabela Yukari" size="lg" dot={false} />
    </div>
  ),
};
/** Se a foto não carregar, as iniciais aparecem no lugar. */
export const BrokenImage: Story = { args: { src: 'https://example.invalid/photo.jpg', size: 'lg' } };
