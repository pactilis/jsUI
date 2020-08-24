import { spread } from '@open-wc/lit-helpers/src/spread';
import { html } from 'lit-html';
import { styleMap } from 'lit-html/directives/style-map';
import { createViewBuilder } from '../builder.js';
import { View } from '../view.js';
import { navigate } from './use-location.js';

export class LinkView extends View {
  label = '';
  to = '';

  className = '';

  get body() {
    return html`
      <a
        ...=${spread(this.attrs)}
        style="${styleMap(this.styles)}"
        class="${this.className}"
        href="${this.to}"
        @click="${this.#onClick}"
        >${this.label}
      </a>
    `;
  }

  #onClick = (e: Event) => {
    e.preventDefault();
    navigate(this.to);
  };
}

export function Link(label: string) {
  return createViewBuilder(LinkView).label(label);
}
