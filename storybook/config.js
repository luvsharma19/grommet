import { addDecorator, configure } from '@storybook/react';
import { withOptions } from '@storybook/addon-options';
import grommetLight from './theme.js';

const req = require.context(
  '../src/js',
  true,
  /\.stories\.js$|\/stories\/.*\.js$/,
);

function loadStories() {
  req.keys().forEach(filename => req(filename));
}

addDecorator(
  withOptions({
    theme: grommetLight,
  }),
);

configure(loadStories, module);
