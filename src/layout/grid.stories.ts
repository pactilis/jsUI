import { html } from 'lit-html';
import { createView } from '../view.js';
import { Grid } from './grid.js';

export default {
  title: 'grid',
};

export const Simple = () =>
  Grid(
    createView(html`<button>A button</button>`),
    createView(html`<button>A button 2</button>`),
    createView(html`<button>A button 3</button>`)
  )
    .templateColumns('repeat(2, 1fr)')
    .gridGap('2rem').body;
