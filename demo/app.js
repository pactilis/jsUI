import { html } from 'lit-html';
import 'reflect-metadata';
import { createView, render } from '../dist/index.js';
import { Router } from '../dist/router/index.js';

render(
  Router({
    pattern: '(/)',
    viewFactory: ({ active }) =>
      import('../dist/demo/jsview-counter.js').then(module => {
        const { Counter } = module;
        return Counter('Hello JsView').active(active).textColor('darkRed');
      }),
  }).fallback({
    viewFactory: () =>
      createView(html`
        <div>
          <header>HEADER</header>

          ${Router(
            {
              pattern: '/view1(/)',
              viewFactory: ({ active }) =>
                import('../dist/demo/jsview-counter.js').then(module => {
                  const { Counter } = module;
                  return Counter('Hello View 1')
                    .active(active)
                    .textColor('darkGreen');
                }),
            },
            {
              pattern: '/view2(/)',
              viewFactory: ({ active }) =>
                import('../dist/demo/jsview-counter.js').then(module => {
                  const { Counter } = module;
                  return Counter('Hello View 2')
                    .active(active)
                    .textColor('darkBlue');
                }),
            }
          ).fallback({
            viewFactory: () =>
              createView(html`404 View <a href="/">Go Home</a>`),
          }).body}
        </div>
      `),
  }),

  document.querySelector('#demo')
);
