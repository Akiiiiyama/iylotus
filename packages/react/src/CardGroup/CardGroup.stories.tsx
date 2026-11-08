import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardBody, CardMeta, CardTag, CardTitle } from '../Card/Card';
import { CardGroup } from './CardGroup';

const meta = {
  title: 'Components/CardGroup',
  component: CardGroup,
  args: { spotlight: true },
  parameters: {
    docs: { description: { component: 'Agrupa cards. Com `spotlight`, o card em foco fica em evidência e os outros se apagam (mouse e teclado). O layout fica com quem usa.' } },
  },
} satisfies Meta<typeof CardGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

const items: [string, string, 'raised' | 'ink' | 'red'][] = [['Design ', 'System', 'red'], ['Built with ', 'Lotus', 'raised'], ['Motion in ', 'code', 'ink']];

/** Grade de projetos com destaque. Passe o mouse ou use Tab. */
export const Spotlight: Story = {
  render: (args) => (
    <CardGroup {...args} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 16, maxWidth: 900 }}>
      {items.map(([a, b, tone]) => (
        <Card key={b} href="#case" tone={tone}>
          <CardBody>
            <CardTag>Case</CardTag>
            <CardTitle><span className="iy-lt">{a}</span><span className="iy-bd">{b}</span></CardTitle>
            <CardMeta>Product · Design Engineering →</CardMeta>
          </CardBody>
        </Card>
      ))}
    </CardGroup>
  ),
};

/** Sem spotlight: cada card mantém o hover do card isolado (sobe e ganha contorno). */
export const Default: Story = { ...Spotlight, args: { spotlight: false } };
