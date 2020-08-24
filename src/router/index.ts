import { spread } from '@open-wc/lit-helpers/src/spread';
import { html, nothing, TemplateResult } from 'lit-html';
import { styleMap } from 'lit-html/directives/style-map';
import { until } from 'lit-html/directives/until';
import { view } from '../factory.js';
import { useState, useEffect } from '../hooks/index.js';
import { createView, View } from '../view.js';
import { parseRoute, RoutingParam } from './route-parser.js';
import { useLocation } from './use-location.js';

function template({ routes, fallback, manualLocation }: RouterProps) {
  const [location, setLocation] = useState<Location | undefined>(
    manualLocation // for testing
  );

  const [matchedRoutes, setMatchedRoutes] = useState(new Set<string>());

  useLocation(location => {
    if (!manualLocation) {
      setLocation({ ...location });
    }
  });

  if (!location) {
    return html``;
  }

  let routingParam: RoutingParam | undefined;
  const { pathname: path, search } = location;

  const route = routes
    .filter(r => !!r.pattern)
    .find(({ pattern }) => {
      const parsingResult = parseRoute(pattern!, path, search);
      if (parsingResult) {
        routingParam = parsingResult;
        return true;
      }
      return false;
    });

  useEffect(() => {
    if (route) {
      matchedRoutes.add(route.pattern!);
      setMatchedRoutes(matchedRoutes);
    }
  });

  return [
    ...routes
      .filter(r => r === route || matchedRoutes.has(r.pattern!))
      .map(r => {
        if (r === route) {
          return wrap(r, routingParam, true).style('display', 'block');
        }
        return wrap(r, routingParam, false).style('display', 'none');
      }),
    fallback
      ? wrap(fallback, undefined, !route).style(
          'display',
          !route ? 'block' : 'none'
        )
      : (nothing as TemplateResult),
  ];
}

export class RouterProps {
  routes: Route[] = [];
  fallback?: Route = undefined;
  manualLocation?: Location = undefined;
}

export interface Route {
  pattern?: string;
  viewFactory: <T, U>(param: {
    routingParam?: RoutingParam<T, U>;
    active: boolean;
  }) => Promise<View> | View;
}

export const [RouterViewBuilder, RouterView] = view(
  'jsview-router',
  { template },
  RouterProps
);

export function Router(...routes: Route[]) {
  return RouterViewBuilder().routes(routes);
}

export { navigate } from './use-location.js';
export * from './link.js';

function wrap(route: Route, routingParam?: RoutingParam, active = false) {
  return createView(
    ({ styles, attrs }) => html`
      <div ...=${spread(attrs)} style="${styleMap(styles)}">
        ${until(
          Promise.resolve(route.viewFactory({ routingParam, active })).then(
            v => v.body
          )
        )}
      </div>
    `
  );
}
