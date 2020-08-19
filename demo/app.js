import { Counter } from '../dist/demo/jsview-counter.js';
import { render } from '../dist/index.js';

render(
  Counter('Hello JsView').textColor('darkRed'),
  document.querySelector('#demo')
);
