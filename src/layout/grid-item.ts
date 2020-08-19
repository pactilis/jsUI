import { View } from '../view.js';

View.prototype.gridItem = function gridItem({
  gridColumn,
  gridRow,
  alignSelf,
  justifySelf,
}: GridItemOptions) {
  this.style('grid-column', gridColumn);
  this.style('grid-row', gridRow);
  this.style('align-self', alignSelf);
  this.style('justify-self', justifySelf);
  return this;
};

declare module '../view' {
  interface View {
    gridItem: (options: GridItemOptions) => this;
  }
}

export interface GridItemOptions {
  gridColumn?: string;
  gridRow?: string;
  alignSelf?: string;
  justifySelf?: string;
}
