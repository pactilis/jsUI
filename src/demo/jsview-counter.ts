import { cssProp } from '../factory.js';
import { useContext } from '../hooks/use-context.js';
import { css, html, useEffect, useState, view } from '../index.js';
import { HSTack } from '../layout/index.js';
import { Link } from '../router/link.js';
import { createView } from '../view.js';

const MY_COUNTER_CONTEXT = '--my-counter-context';

function template({ title, active }: CounterProps) {
  const [count, setCount] = useState(5);

  useEffect(() => {
    document.title = `You clicked ${count} times`;
    return () => console.log('clearing effect', count);
  });

  const context = useContext(MY_COUNTER_CONTEXT);
  console.log('context =>', context);

  return html`
    <h2>${title} Nr. ${count}!</h2>
    <div>active: ${active}</div>
    ${HSTack(
      createView(html`
        <button @click=${() => setCount(prevCount => prevCount - 1)}>-</button>
      `),
      createView(html`
        <button @click=${() => setCount(prevCount => prevCount + 1)}>+</button>
      `)
    ).body}
    ${HSTack(
      Link('Home').to('/demo'),
      Link('view 1').to('/demo/view1'),
      Link('view 2').to('/demo/view2')
    ).body}
  `;
}

const cssTemplate = css`
  :host {
    display: block;
    padding: 25px;
    color: var(--jsview-counter-text-color, #000);
  }
`;

export class CounterProps {
  title?: string = '';
  active?: boolean = false;

  @cssProp('--jsview-counter-text-color')
  textColor?: string = undefined;
}

export const [CounterViewBuilder, CounterView] = view(
  'jsview-counter',
  { template, cssTemplate },
  CounterProps
);

export function Counter(title = 'Hey there') {
  return CounterViewBuilder().title(title);
}
