import { spread } from '@open-wc/lit-helpers/src/spread';
import { html } from 'lit-html';
import { ifDefined } from 'lit-html/directives/if-defined';
import { styleMap } from 'lit-html/directives/style-map';
import { createView } from './view.js';

export function Slot(name?: string) {
  return createView(
    ({ attrs, styles }) => html`
      <slot
        ...=${spread(attrs)}
        style="${styleMap(styles)}"
        name="${ifDefined(name)}"
      ></slot>
    `
  );
}
