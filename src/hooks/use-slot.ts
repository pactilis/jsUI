import { useEffect } from './use-effect.js';

export function useSlot(
  process: (component: Element | null) => any,
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
      const content = slotElement.assignedElements();
      const component = content.length > 0 ? content[0] : null;
      return process(component);
    }
    return null;
  }, deps);
}
