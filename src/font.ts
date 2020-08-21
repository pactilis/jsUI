import { View } from './view.js';

export interface Font {
  fontFamily?: string;
  fontSize?: string;
  fontWeight?: string;
  letterSpacing?: string;
  textTransform?:
    | 'none'
    | 'capitalize'
    | 'uppercase'
    | 'lowercase'
    | 'full-width'
    | 'full-size-kana';
}

View.prototype.font = function font({
  fontSize,
  fontWeight,
  fontFamily,
  letterSpacing,
  textTransform,
}: Font) {
  if (fontSize) {
    this.style('font-size', fontSize);
  }
  if (fontWeight) {
    this.style('font-weight', fontWeight);
  }
  if (fontFamily) {
    this.style('font-family', fontFamily);
  }
  if (letterSpacing) {
    this.style('letter-spacing', letterSpacing);
  }
  if (textTransform) {
    this.style('text-transform', textTransform);
  }
  return this;
};

declare module './view.js' {
  interface View {
    font: (font: Font) => View;
  }
}
