import { html } from 'lit-html';
import { css } from 'lit-element';
import { cssProp, useContext, useEffect, useState, view } from '../index.js';
import { HSTack, VSTack } from '../layout/index.js';
import { Link } from '../router/link.js';
import { Button } from './button.js';
import { createView, View } from '../view.js';
import { slot } from '../factory.js';
import { useSlot } from '../hooks/use-slot.js';
import { Slot } from '../slot.js';

const MY_COUNTER_CONTEXT = '--my-counter-context';

export class CounterProps {
  title?: string = '';
  active?: boolean = false;

  @slot('increment')
  incrementTrigger?: View = Button('+');

  @slot('decrement')
  decrementTrigger?: View = Button('-');

  @slot()
  comment = [createView(html``)];

  @slot()
  description = createView(html``);

  @cssProp('--jsview-counter-text-color')
  textColor?: string = undefined;
}

function template({ title, active }: CounterProps) {
  const [count, setCount] = useState(5);

  useEffect(() => {
    document.title = `You clicked ${count} times`;
    return () => console.log('clearing effect', count);
  });

  useSlot(
    component => {
      if (component) {
        const listener = () => setCount(prev => prev + 2);
        component.addEventListener('click', listener);
        return () => component.removeEventListener('click', listener);
      }
      return null;
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
      return null;
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
    ${VSTack(Slot('decrement'), VSTack(Slot()), Slot('increment')).body}
    ${HSTack(
      Link('Home').to('/'),
      Link('view 1').to('/view1'),
      Link('view 2').to('/view2')
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
