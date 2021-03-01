import { html } from 'lit-html';
import { styleMap } from 'lit-html/directives/style-map';
import { createView } from '../view.js';
import { Grid, InlineGrid } from './grid.js';

export default {
  title: 'grid',
};

export const Simple = () =>
  Grid(
    createView(html`<button>A button</button>`),
    Grid(
      createView(html`<button>A button 2</button>`),
      createView(
        ({ styles }) =>
          html`<button style="${styleMap(styles)}">A button 3</button>`
      ).gridItem({ placeSelf: 'center stretch' })
    )
      .templateColumns('1fr')
      .gridRowGap('1rem')
      .gridItem({
        placeSelf: 'stretch',
      }),
    createView(html`<button>A button 4</button>`)
  )
    .grid('100px 300px / auto-flow 200px')
    .templateColumns('repeat(2, 1fr)')
    .gridGap('2rem')
    .placeItems('center').body;

export const Inline = () =>
  InlineGrid(
    createView(html`<button>A button</button>`),
    createView(html`<button>A button 2</button>`)
  )
    .templateColumns('repeat(2, 1fr)')
    .gridGap('0.5rem').body;
