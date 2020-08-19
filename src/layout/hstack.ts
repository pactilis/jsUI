import { Grid } from './grid.js';
import { ViewElement, View } from '../view.js';
import { view } from '../index.js';

function template({
  elements,
  verticalAlign,
  spacing,
  columnSize,
}: HSTackProps) {
  const col = columnSize || 'max-content';

  return Grid(...elements)
    .templateColumns(col)
    .alignItems(verticalAlign ?? 'center')
    .gridColumnGap(spacing ?? '0.5rem')
    .gridAutoFlow('column')
    .gridAutoColumns(col);
}

export class HSTackProps {
  elements: View[] = [];
  verticalAlign?: string = undefined;
  spacing?: string = undefined;
  columnSize?: string = undefined;
}

export const [HSTackViewBuilder, HSTackView, HSTackElement] = view(
  'jsview-hstack',
  {
    template,
    viewRoot: element => {
      const root = element.shadowRoot!.querySelectorAll('*')[0] as ViewElement;
      return root.view.viewRoot(root);
    },
  },
  HSTackProps
);

export function HSTack(...elements: View[]) {
  return HSTackViewBuilder().elements(elements);
}
