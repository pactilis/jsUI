import { css, html } from 'lit-element';
import { cssProp, view } from '../factory.js';
import { View } from '../view.js';
import './grid-item.js';

export * from './grid-item.js';

function template({ elements }: { elements?: View[] }) {
  return html` <slot>${elements?.map(el => el.body)}</slot> `;
}

const cssTemplate = css`
  :host {
    display: grid;
    grid-template-columns: var(--grid-template-columns);
    grid-template-rows: var(--grid-template-rows);
    align-items: var(--grid-align-items);
    justify-items: var(--grid-justify-items);

    column-gap: var(--grid-column-gap, var(--grid-gap));
    grid-column-gap: var(--grid-column-gap, var(--grid-gap));

    row-gap: var(--grid-row-gap, var(--grid-gap));
    grid-row-gap: var(--grid-row-gap, var(--grid-gap));

    grid-auto-flow: var(--grid-auto-flow);
    grid-auto-columns: var(--grid-auto-columns);
    grid-auto-rows: var(--grid-auto-rows);
  }
`;

export class GridProps {
  elements?: View[] = undefined;

  @cssProp('--grid-template-columns')
  templateColumns = '';

  @cssProp('--grid-template-rows')
  templateRows = '';

  @cssProp('--grid-align-items')
  alignItems = '';

  @cssProp('--grid-justify-items')
  justifyItems = '';

  @cssProp('--grid-gap')
  gridGap = '';

  @cssProp('--grid-column-gap')
  gridColumnGap = '';

  @cssProp('--grid-row-gap')
  gridRowGap = '';

  @cssProp('--grid-auto-flow')
  gridAutoFlow = '';

  @cssProp('--grid-auto-columns')
  gridAutoColumns = '';

  @cssProp('--grid-auto-rows')
  gridAutoRows = '';
}

export const [GridViewBuilder, GridView] = view(
  'jsview-grid',
  { template, cssTemplate },
  GridProps
);

export function Grid(...elements: View[]) {
  return GridViewBuilder()
    .templateColumns('none')
    .templateRows('none')
    .alignItems('normal')
    .justifyItems('auto')
    .gridGap('normal')
    .gridColumnGap('var(--grid-gap)')
    .gridRowGap('var(--grid-gap)')
    .gridAutoFlow('row')
    .gridAutoColumns('auto')
    .gridAutoRows('auto')
    .elements(elements);
}
