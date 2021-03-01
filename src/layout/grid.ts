import { css } from 'lit-element';
import { cssProp, slot, view } from '../factory.js';
import { Slot } from '../slot.js';
import { View } from '../view.js';
import './grid-item.js';

export * from './grid-item.js';

export class GridProps {
  @slot()
  elements: View[] = [];

  @cssProp('--grid-template-columns', 'usingTemplateColumns')
  templateColumns = '';

  @cssProp('--grid-template-rows', 'usingTemplateRows')
  templateRows = '';

  @cssProp('--grid-align-items', 'usingAlignItems')
  alignItems = '';

  @cssProp('--grid-justify-items', 'usingJustifyItems')
  justifyItems = '';

  @cssProp('--grid-gap', 'usingGap')
  gridGap = '';

  @cssProp('--grid-column-gap', 'usingColumnGap')
  gridColumnGap = '';

  @cssProp('--grid-row-gap', 'usingRowGap')
  gridRowGap = '';

  @cssProp('--grid-auto-flow', 'usingAutoFlow')
  gridAutoFlow = '';

  @cssProp('--grid-auto-columns', 'usingAutoColumns')
  gridAutoColumns = '';

  @cssProp('--grid-auto-rows', 'usingAutoRows')
  gridAutoRows = '';

  @cssProp('--grid-template-areas', 'usingTemplateAreas')
  templateAreas = '';

  @cssProp('--grid-template', 'usingTemplate')
  template = '';

  @cssProp('--place-items', 'usingPlaceItems')
  placeItems = '';

  @cssProp('--justify-content', 'usingJustifyContent')
  justifyContent = '';

  @cssProp('--align-content', 'usingAlignContent')
  alignContent = '';

  @cssProp('--place-content', 'usingPlaceContent')
  placeContent = '';

  @cssProp('--grid', 'usingGrid')
  grid = '';
}

export const [Grid] = view('jsview-grid', {
  template() {
    return Slot();
  },

  cssTemplate: css`
    :host {
      display: grid;
    }

    :host([inline]) {
      display: inline-grid;
    }

    :host([usingTemplateColumns]) {
      grid-template-columns: var(--grid-template-columns);
    }

    :host([usingTemplateRows]) {
      grid-template-rows: var(--grid-template-rows);
    }

    :host([usingAlignItems]) {
      align-items: var(--grid-align-items);
    }

    :host([usingJustifyItems]) {
      justify-items: var(--grid-justify-items);
    }

    :host([usingColumnGap]) {
      column-gap: var(--grid-column-gap);
      grid-column-gap: var(--grid-column-gap);
    }

    :host([usingRowGap]) {
      row-gap: var(--grid-row-gap);
      grid-row-gap: var(--grid-row-gap);
    }

    :host([usingGap]) {
      gap: var(--grid-gap);
      grid-gap: var(--grid-gap);
    }

    :host([usingAutoFlow]) {
      grid-auto-flow: var(--grid-auto-flow);
    }

    :host([usingAutoColumns]) {
      grid-auto-columns: var(--grid-auto-columns);
    }

    :host([usingAutoRows]) {
      grid-auto-rows: var(--grid-auto-rows);
    }

    :host([usingTemplateAreas]) {
      grid-template-areas: var(--grid-template-areas);
    }

    :host([usingTemplate]) {
      grid-template: var(--grid-template);
    }

    :host([usingPlaceItems]) {
      place-items: var(--place-items);
    }

    :host([usingJustifyContent]) {
      justify-content: var(--justify-content);
    }

    :host([usingAlignContent]) {
      align-content: var(--align-content);
    }

    :host([usingPlaceContent]) {
      place-content: var(--place-content);
    }

    :host([usingGrid]) {
      grid: var(--grid);
    }
  `,

  Props: GridProps,

  mapBuilder: GridBuilder => (...elements: View[]) =>
    GridBuilder().elements(elements),
});

export function InlineGrid(...elements: View[]) {
  return Grid(...elements).attr({ inline: '' });
}
InlineGrid.View = Grid.View;
