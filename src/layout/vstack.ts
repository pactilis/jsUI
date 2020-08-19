import { view } from '../index.js';
import { View, ViewElement } from '../view.js';
import { Grid } from './grid.js';

function template({ elements, horizontalAlign, spacing }: VSTackProps) {
  return Grid(...elements)
    .templateColumns('1fr')
    .justifyItems(horizontalAlign ?? 'center')
    .gridGap(spacing ?? '0.5rem');
}

export class VSTackProps {
  elements: View[] = [];
  horizontalAlign?: string = 'center';
  spacing?: string = '0.5rem';
}

export const [VSTackViewBuilder, VSTackView] = view(
  'jsui-vstack',
  {
    template,
    viewRoot: element => {
      const root = element.shadowRoot!.querySelectorAll('*')[0] as ViewElement;
      return root.view.viewRoot(root);
    },
  },
  VSTackProps
);

export function VSTack(...elements: View[]) {
  return VSTackViewBuilder().elements(elements);
}
