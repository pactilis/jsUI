/* eslint-disable no-undef */
import { render, createView, html } from '../dist/index.js';
import { Router } from '../dist/router/index.js';

render(
  Router(
    {
      pattern: '/demo(/)',
      viewFactory: ({ active }) => {
        return import('../dist/demo/jsview-counter.js').then(module => {
          const { Counter } = module;
          return Counter('Hello JsView').active(active).textColor('darkRed');
        });
      },
    },
    {
      pattern: '/demo/view1(/)',
      viewFactory: ({ active }) => {
        return import('../dist/demo/jsview-counter.js').then(module => {
          const { Counter } = module;
          return Counter('Hello View 1').active(active).textColor('darkGreen');
        });
      },
    },
    {
      pattern: '/demo/view2(/)',
      viewFactory: ({ active }) => {
        return import('../dist/demo/jsview-counter.js').then(module => {
          const { Counter } = module;
          return Counter('Hello View 2').active(active).textColor('darkBlue');
        });
      },
    }
  ).fallback({ viewFactory: () => createView(html`404 View <a href="/demo/">Go Home</a>`) }),
  document.querySelector('#demo')
);
