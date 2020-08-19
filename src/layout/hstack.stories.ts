import { HSTack } from './hstack.js';
import { createView } from '../view.js';
import { html } from 'lit-html';

export default {
  title: 'hstack',
};

export const Simple = () =>
  HSTack(
    createView(html`<button>A button</button>`),
    createView(html`<button>A button 2</button>`),
    createView(html`<button>A button 3</button>`)
  ).body;
