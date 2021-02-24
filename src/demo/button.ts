import { html } from 'lit-html';
import { view } from '../index.js';

class Props {
  label = '';
  onClick?: () => void = undefined;
}

function template({ label, onClick }: Props) {
  return html` <button @click="${() => onClick?.()}">${label}</button> `;
}

export const [Button] = view('demo-button', {
  template,
  viewRoot(element) {
    return element.shadowRoot?.querySelector('button') as Element;
  },
  Props,
  mapBuilder: ButtonBuilder => (label: string) => ButtonBuilder().label(label),
});
