import { View } from '../view.js';

View.prototype.gridItem = function gridItem({
  gridColumn,
  gridRow,
  alignSelf,
  justifySelf,
  gridColumnStart,
  gridColumnEnd,
  gridRowStart,
  gridRowEnd,
  gridArea,
  placeSelf,
}: GridItemOptions) {
  this.style('grid-column', gridColumn, false);
  this.style('grid-row', gridRow, false);
  this.style('align-self', alignSelf, false);
  this.style('justify-self', justifySelf, false);
  this.style('grid-column-start', gridColumnStart, false);
  this.style('grid-column-end', gridColumnEnd, false);
  this.style('grid-row-start', gridRowStart, false);
  this.style('grid-row-end', gridRowEnd, false);
  this.style('grid-area', gridArea, false);
  this.style('place-self', placeSelf, false);
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
  gridColumnStart?: string;
  gridColumnEnd?: string;
  gridRowStart?: string;
  gridRowEnd?: string;
  gridArea?: string;
  placeSelf?: string;
}
