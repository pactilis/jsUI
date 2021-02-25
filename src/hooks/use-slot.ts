import { useEffect } from './use-effect.js';

export function useSlot(
  process: (...components: Element[]) => any,
  deps: any[],
  name = ''
) {
  useEffect(element => {
    const slotElement:
      | HTMLSlotElement
      | null
      | undefined = element.shadowRoot?.querySelector(
      name ? `slot[name="${name}"]` : 'slot'
    );
    if (slotElement) {
      const components = slotElement.assignedElements();
      return process(...components);
    }
    return null;
  }, deps);
}
