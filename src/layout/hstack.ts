import { View } from '../view.js';
import { Grid } from './grid.js';

export function HSTack(...elements: View[]) {
  return Grid(...elements)
    .templateColumns('max-content')
    .alignItems('center')
    .gridColumnGap('0.5rem')
    .gridAutoFlow('column')
    .gridAutoColumns('max-content');
}

HSTack.View = Grid.View;
