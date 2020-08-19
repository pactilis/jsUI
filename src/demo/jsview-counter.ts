import { cssProp } from '../factory.js';
import { css, html, useState, view, useEffect } from '../index.js';

function template({ title }: CounterProps) {
  const [count, setCount] = useState(5);

  useEffect(() => {
    document.title = `You clicked ${count} times`;
  });

  return html`
    <h2>${title} Nr. ${count}!</h2>
    <button @click=${() => setCount(prevCount => prevCount + 1)}>
      increment
    </button>
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
