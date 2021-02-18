import { View } from '../view.js';
import { Grid } from './grid.js';

export function VSTack(...elements: View[]) {
  return Grid(...elements)
    .templateColumns('1fr')
    .gridGap('0.5rem');
}
