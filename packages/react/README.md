# @iylotus/react

React components of [IY Lotus](https://github.com/Akiiiiyama/iylotus). Accessible by default, themed with `@iylotus/styles`.

```bash
npm i @iylotus/react @iylotus/styles
```

```tsx
import '@iylotus/styles';
import '@iylotus/react/styles.css';
import { Button, TextField, Card, CardTag, CardTitle } from '@iylotus/react';

<Button variant="accent">View work</Button>
<TextField label="Email" hint="Only to reply to you" />
```

| Group | Components |
|---|---|
| Action | `Button` |
| Inputs | `TextField`, `TextArea`, `Select`, `Checkbox`, `RadioGroup` + `Radio`, `Switch` |
| Surface | `Card`, `CardMedia`, `CardBody`, `CardTag`, `CardTitle`, `CardMeta`, `CardStat` |
| Support | `Tag`, `Badge`, `Avatar`, `Link`, `Divider` |

- Prop names match the Figma variants: `<Button variant="accent" size="md" />` is `Button / variant=accent, size=md`.
- Fields always have a visible label; hint and error are linked with `aria-describedby`.
- Requires React 18 or newer.

Docs and live examples: run `npm run storybook` in the repository.

MIT
