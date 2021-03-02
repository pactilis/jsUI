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
  this.style('grid-column', gridColumn);
  this.style('grid-row', gridRow);
  this.style('align-self', alignSelf);
  this.style('justify-self', justifySelf);
  this.style('grid-column-start', gridColumnStart);
  this.style('grid-column-end', gridColumnEnd);
  this.style('grid-row-start', gridRowStart);
  this.style('grid-row-end', gridRowEnd);
  this.style('grid-area', gridArea);
  this.style('place-self', placeSelf);
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
