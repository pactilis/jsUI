import { spread } from '@open-wc/lit-helpers/src/spread';
import { html, nothing, TemplateResult } from 'lit-html';
import { styleMap } from 'lit-html/directives/style-map';
import { until } from 'lit-html/directives/until';
import { view } from '../factory.js';
import { useEffect, useMemo, useState } from '../hooks/index.js';
import { createView, View } from '../view.js';
import { parseRoute, RoutingParam } from './route-parser.js';
import { useLocation } from './use-location.js';

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

function template({ routes, fallback, manualLocation }: RouterProps) {
  const [location, setLocation] = useState<Location | undefined>(
    manualLocation // for testing
  );

  const [matchedRoutes, setMatchedRoutes] = useState(new Set<string>());
  const [displayedRoutes, setDisplayedRoutes] = useState<Route[]>([]);

  useLocation(loc => {
    if (!manualLocation) {
      setLocation({ ...loc });
    }
  });

  if (!location) {
    return html``;
  }

  const [route, routingParam] = useMemo(() => {
    const { pathname: path, search } = location;

    let rParam: RoutingParam | undefined;

    const r = routes
      .filter(({ pattern }) => !!pattern)
      .find(({ pattern }) => {
        const parsingResult = parseRoute(pattern!, path, search);
        if (parsingResult) {
          rParam = parsingResult;
          return true;
        }
        return false;
      });

    return [r, rParam];
  }, [routes, location]);

  useEffect(() => {
    if (route && !matchedRoutes.has(route.pattern!)) {
      setMatchedRoutes(
        prevMatchedRoutes => new Set([...prevMatchedRoutes, route.pattern!])
      );
      setDisplayedRoutes(prevDisplayedRoutes => [
        ...prevDisplayedRoutes,
        route,
      ]);
    }
  }, [route]);

  return [
    fallback
      ? wrap(fallback, undefined, !route).style(
          'display',
          !route ? 'block' : 'none'
        )
      : (nothing as TemplateResult),
    ...displayedRoutes.map(r => {
      if (r.pattern === route?.pattern) {
        return wrap(r, routingParam, true).style('display', 'block');
      }
      return wrap(r, routingParam, false).style('display', 'none');
    }),
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

export const [Router, RouterView] = view('jsview-router', {
  template,
  Props: RouterProps,
  mapBuilder: RouterBuilder => (...routes: Route[]) =>
    RouterBuilder().routes(routes),
});

export * from './link.js';
export { navigate } from './use-location.js';
