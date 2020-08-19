import { css, html } from 'lit-element';
import { View } from '../view.js';
import { view, cssProp } from '../index.js';
import './grid-item.js';

export * from './grid-item.js';

function template({ elements }: { elements?: View[] }) {
  return html`
    <div class="container">
      ${elements?.map(el => el.body)}
    </div>
  `;
}

const cssTemplate = css`
  .container {
    display: grid;
    grid-template-columns: var(--grid-template-columns, 1fr);
    grid-template-rows: var(--grid-template-rows);
    align-items: var(--grid-align-items);
    justify-items: var(--grid-justify-items);
    grid-gap: var(--grid-gap, normal);
    grid-column-gap: var(--grid-column-gap, var(--grid-gap, normal));
    grid-row-gap: var(--grid-row-gap, var(--grid-gap, normal));
    grid-auto-flow: var(--grid-auto-flow, row);
    grid-auto-columns: var(--grid-auto-columns, auto);
    grid-auto-rows: var(--grid-auto-rows, auto);
  }
`;

export class GridProps {
  elements?: View[] = undefined;
  @cssProp('--grid-template-columns')
  templateColumns?: string = undefined;
  @cssProp('--grid-template-rows')
  templateRows?: string = undefined;
  @cssProp('--grid-align-items')
  alignItems?: string = undefined;
  @cssProp('--grid-justify-items')
  justifyItems?: string = undefined;
  @cssProp('--grid-gap')
  gridGap?: string = undefined;
  @cssProp('--grid-column-gap')
  gridColumnGap?: string = undefined;
  @cssProp('--grid-row-gap')
  gridRowGap?: string = undefined;
  @cssProp('--grid-auto-flow')
  gridAutoFlow?: string = undefined;
  @cssProp('--grid-auto-columns')
  gridAutoColumns?: string = undefined;
  @cssProp('--grid-auto-rows')
  gridAutoRows?: string = undefined;
}

export const [GridViewBuilder, GridView] = view(
  'jsview-grid',
  { template, cssTemplate },
  GridProps
);

export function Grid(...elements: View[]) {
  return GridViewBuilder().elements(elements);
}
