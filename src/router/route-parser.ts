import { UrlPattern } from './url-pattern.js';

export function parseQueryParams<T>(query = ''): T {
  const queryParams = new URLSearchParams(query);
  const params: { [key: string]: string } = {};
  for (const [key, value] of queryParams as any) {
    params[key] = value;
  }
  return (params as unknown) as T;
}

/**
 * Match url path against a pattern and extract params
 */
export function parseRoute<T, U>(
  pattern: string,
  path: string,
  search = ''
): RoutingParam<T, U> | null {
  const urlPattern = new UrlPattern(pattern);
  const params = urlPattern.match(decodeURIComponent(path));
  if (params) {
    return {
      params,
      queryParams: parseQueryParams(search),
    };
  }
  return null;
}

export interface RoutingParam<T = unknown, U = unknown> {
  params: T;
  queryParams: U;
}
