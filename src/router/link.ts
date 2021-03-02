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
  onActivate?: () => void = undefined;
}

function template({ trigger, triggerEvent, to, onActivate }: LinkProps) {
  const listener = useMemo(
    () => (e: Event) => {
      e.preventDefault();
      onActivate?.();
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
