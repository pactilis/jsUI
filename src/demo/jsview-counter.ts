import {
  BuilderFactory,
  css,
  cssProp,
  html,
  useContext,
  useEffect,
  useState,
  view,
} from '../index.js';
import { HSTack } from '../layout/index.js';
import { Link } from '../router/link.js';
import { Button } from './button.js';

const MY_COUNTER_CONTEXT = '--my-counter-context';

class Props {
  title?: string = '';
  active?: boolean = false;

  @cssProp('--jsview-counter-text-color')
  textColor?: string = undefined;
}

function template({ title, active }: Props) {
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
      Button('-').onClick(() => setCount(prevCount => prevCount - 1)),
      Button('+').onClick(() => setCount(prevCount => prevCount + 1))
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

export const [Counter] = view('jsview-counter', {
  template,
  cssTemplate,
  Props,
  mapBuilder: (CounterBuilder: BuilderFactory<Props>) => (
    title = 'Hey there'
  ) => CounterBuilder().title(title),
});
