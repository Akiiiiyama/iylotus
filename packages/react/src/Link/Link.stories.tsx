import type { Meta, StoryObj } from '@storybook/react';
import { Link } from './Link';

const meta = {
  title: 'Components/Support/Link',
  component: Link,
  args: { children: 'View on GitHub', href: 'https://github.com/Akiiiiyama/iylotus', external: true },
} satisfies Meta<typeof Link>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const InText: Story = {
  render: () => (
    <p style={{ maxWidth: 520, fontSize: 18, lineHeight: 1.6, margin: 0 }}>
      I design in pixels and ship in code. The tokens live in <Link href="#tokens">@iylotus/tokens</Link>, and the source is
      on <Link href="https://github.com/Akiiiiyama/iylotus" external>GitHub</Link>.
    </p>
  ),
};
