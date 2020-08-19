import { html } from 'lit-html';
import { createView } from '../view.js';
import { VSTack } from './vstack.js';

export default {
  title: 'vstack',
};

export const Simple = () =>
  VSTack(
    createView(html`<button>A button</button>`),
    createView(html`<button>A button 2</button>`),
    createView(html`<button>A button 3</button>`)
  ).body;
