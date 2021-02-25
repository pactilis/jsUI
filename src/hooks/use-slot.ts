import { useEffect } from './use-effect.js';

export function useSlot(
  process: (...components: Element[]) => any,
  deps: any[],
  name = ''
) {
  useEffect(element => {
    const selector = name ? `slot[name="${name}"]` : 'slot:not([name])';
    const slotElement:
      | HTMLSlotElement
      | null
      | undefined = element.shadowRoot?.querySelector(selector);

    if (slotElement) {
      const components = slotElement.assignedElements();
      return process(...components);
    }
    return null;
  }, deps);
}
