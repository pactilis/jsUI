import { css } from 'lit-element';
import { html } from 'lit-html';
import { slot } from '../factory.js';
import { useSlot } from '../hooks/use-slot.js';
import { cssProp, useContext, useEffect, useState, view } from '../index.js';
import { HSTack } from '../layout/index.js';
import { Link } from '../router/link.js';
import { Slot } from '../slot.js';
import { View } from '../view.js';
import { Button } from './button.js';

const MY_COUNTER_CONTEXT = '--my-counter-context';

export class CounterProps {
  title?: string = '';
  active?: boolean = false;

  @slot('increment')
  incrementTrigger?: View = undefined;

  @slot('decrement')
  decrementTrigger?: View = undefined;

  @slot()
  comment: View[] = [];

  @cssProp('--jsview-counter-text-color')
  textColor?: string = undefined;
}

function template({ title, active }: CounterProps) {
  const [count, setCount] = useState(5);

  useEffect(() => {
    document.title = `You clicked ${count} times`;
    return () => console.log('clearing effect', count);
  });

  useSlot((...elements) => {
    console.log('Every slots', elements);
  }, []);

  useSlot(
    component => {
      if (component) {
        const listener = () => setCount(prev => prev + 2);
        component.addEventListener('click', listener);
        return () => component.removeEventListener('click', listener);
      }
    },
    [],
    'increment'
  );

  useSlot(
    component => {
      if (component) {
        const listener = () => setCount(prev => prev - 2);
        component.addEventListener('click', listener);
        return () => component.removeEventListener('click', listener);
      }
    },
    [],
    'decrement'
  );

  const context = useContext(MY_COUNTER_CONTEXT);
  console.log('context =>', context);

  return html`
    <h2>${title} Nr. ${count}!</h2>
    <div>active: ${active}</div>
    ${HSTack(
      Button('-').onClick(() => setCount(prevCount => prevCount - 1)),
      Button('+').onClick(() => setCount(prevCount => prevCount + 1))
    ).body}
    ${HSTack(Slot('decrement'), Slot(), Slot('increment')).justifyItems(
      'center'
    ).body}
    ${HSTack(
      Link(html`<a href="/">Home</a>`).to('/'),
      Link(html`<a href="/view1">view 1</a>`).to('/view1'),
      Link(html`<a href="/view2">view 2</a>`).to('/view2')
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

export const [Counter] = view('jsview-counter', {
  template,
  cssTemplate,
  Props: CounterProps,
  mapBuilder: CounterBuilder => (title = 'Hey there') =>
    CounterBuilder().title(title),
});
