import { html } from 'lit-html';
import { createView } from '../view.js';
import { Router } from './index.js';

export default {
  title: 'router',
};

export const Simple = () =>
  Router(
    {
      pattern: '/',
      viewFactory: () => createView(html`<h2>Root view</h2>`),
    },
    {
      pattern: '/:id',
      viewFactory: ({ routingParam }) =>
        createView(
          html`<h2>
            view ${(routingParam?.params as { id: string } | undefined)?.id}
          </h2>`
        ),
    }
  )
    .fallback({ viewFactory: () => createView(html`View 404`) })
    .manualLocation({ pathname: '/2', search: '' } as Location).body;

export const WithFallback = () =>
  Router(
    {
      pattern: '/',
      viewFactory: async () => createView(html`<h2>Root view</h2>`),
    },
    {
      pattern: '/:id',
      viewFactory: async ({ routingParam, active }) =>
        createView(
          html`<h2 ?active="${active}">
            view ${(routingParam?.params as { id: string } | undefined)?.id}
          </h2>`
        ),
    }
  )
    .fallback({ viewFactory: async () => createView(html`View 404`) })
    .manualLocation({ pathname: '/unknown/2', search: '' } as Location).body;
