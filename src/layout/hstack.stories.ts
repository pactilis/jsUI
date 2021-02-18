import { html } from 'lit-html';
import { createView } from '../view.js';
import { HSTack } from './hstack.js';
import { VSTack } from './vstack.js';

export default {
  title: 'hstack',
};

export const Simple = () =>
  HSTack(
    createView(html`<button>A button</button>`),
    createView(html`<button>A button 2</button>`),
    createView(html`<button>A button 3</button>`)
  ).body;

export const InsideVSTack = () =>
  VSTack(
    HSTack(
      createView(html`<button>A button 1</button>`),
      createView(html`<button>A button 2</button>`),
      createView(html`<button>A button 3</button>`)
    ).gridColumnGap('5rem')
  )
    .gridColumnGap('1rem')
    .justifyItems('stretch').body;
