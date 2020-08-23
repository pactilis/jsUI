import { cssProp } from '../factory.js';
import { css, html, useState, view, useEffect } from '../index.js';
import { navigate } from '../router/index.js';
import { useContext } from '../hooks/useContext.js';

function template({ title, active }: CounterProps) {
  const [count, setCount] = useState(5);

  useEffect(() => {
    document.title = `You clicked ${count} times`;
    return () => console.log('clearing effect', count);
  });

  const context = useContext('--my-counter-context');
  console.log('context =>', context);

  return html`
    <h2>${title} Nr. ${count}!</h2>
    <div>active: ${active}</div>
    <button @click=${() => setCount(prevCount => prevCount + 1)}>
      increment
    </button>

    <a href="/demo/view1">Go to view 1</a>
    <button @click="${() => navigate('/demo')}">Go home</button>
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
