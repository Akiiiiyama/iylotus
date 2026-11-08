import type { Decorator, Preview } from '@storybook/react';
import '@iylotus/styles';
import '../src/Button/Button.css';
import './preview.css';

// Troca o tema pelo menu da barra do Storybook: aplica data-theme no bloco de cada story.
const withTheme: Decorator = (Story, context) => (
  <div data-theme={context.globals.theme} className="iy-story">
    <Story />
  </div>
);

const preview: Preview = {
  decorators: [withTheme],
  globalTypes: {
    theme: {
      description: 'Tema do IY Lotus',
      toolbar: { title: 'Theme', icon: 'mirror', items: ['light', 'dark'], dynamicTitle: true },
    },
  },
  initialGlobals: { theme: 'light' },
  parameters: {
    layout: 'fullscreen',
    controls: { expanded: true },
    a11y: { test: 'error' },
  },
};

export default preview;
