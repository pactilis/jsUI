import { TemplateResult } from 'lit-html';
import { slot, view } from '../factory.js';
import { useMemo, useSlot } from '../hooks/index.js';
import { Slot } from '../slot.js';
import { View } from '../view.js';
import { navigate } from './use-location.js';

export class LinkProps {
  @slot()
  trigger?: View | TemplateResult = undefined;

  triggerEvent = 'click';

  to = '';
}

function template({ trigger, triggerEvent, to }: LinkProps) {
  const listener = useMemo(
    () => (e: Event) => {
      e.preventDefault();
      navigate(to);
    },
    [to]
  );

  useSlot(
    component => {
      if (component) {
        component.addEventListener(triggerEvent, listener);
        return () => component.removeEventListener(triggerEvent, listener);
      }
    },
    [trigger, triggerEvent, to, listener]
  );

  return Slot();
}

export const [Link] = view('jsui-router-link', {
  template,
  Props: LinkProps,
  mapBuilder: LinkBuilder => (trigger: View | TemplateResult) =>
    LinkBuilder().trigger(trigger),
});

// export class LinkView extends View {
//   label = '';
//   to = '';

//   className = '';

//   private onClick = (e: Event) => {
//     e.preventDefault();
//     navigate(this.to);
//   };

//   get body() {
//     return html`
//       <a
//         ...=${spread(this.attrs)}
//         style="${styleMap(this.styles)}"
//         class="${this.className}"
//         href="${this.to}"
//         @click="${this.onClick}"
//         >${this.label}
//       </a>
//     `;
//   }
// }

// export function Link(label: string) {
//   return createViewBuilder(LinkView).label(label);
// }
