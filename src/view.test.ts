import { spread } from '@open-wc/lit-helpers/src/spread';
import { expect } from '@open-wc/testing';
import { html } from 'lit-html';
import { styleMap } from 'lit-html/directives/style-map';
import { fixture } from './view-testing.js';
import { createView } from './view.js';

describe('View', () => {
  describe('attr', () => {
    it('sets boolean attribute when true', async () => {
      const el = await fixture(
        createView(
          ({ styles, attrs }) =>
            html`<div style="${styleMap(styles)}" ...=${spread(attrs)}>
              Test
            </div>`
        ).attr('open', true)
      );
      expect(el.hasAttribute('open')).to.be.true;
    });

    it('does not set boolean attribute when false', async () => {
      const el = await fixture(
        createView(
          ({ styles, attrs }) =>
            html`<div style="${styleMap(styles)}" ...=${spread(attrs)}>
              Test
            </div>`
        ).attr('open', false)
      );
      expect(el.hasAttribute('open')).to.be.false;
    });
  });

  describe('className', () => {
    it('sets class attribute', async () => {
      const el = await fixture(
        createView(
          ({ styles, attrs }) =>
            html`<div style="${styleMap(styles)}" ...=${spread(attrs)}>
              Test
            </div>`
        ).className('cool item__cold')
      );
      expect(el.className).to.eq('cool item__cold');
    });
  });
});
