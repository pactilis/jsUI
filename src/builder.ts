/* eslint-disable no-param-reassign */
import { View, Clazz } from './view.js';

export type Builder<T> = {
  [k in keyof T]-?: T[k] extends boolean
    ? (arg?: T[k]) => Builder<T>
    : (arg: T[k]) => Builder<T>;
} &
  View;

export function createViewBuilder<T extends View>(
  Ctor: Clazz<T>,
  initValue: any = {},
  cssProps: Map<string, string> = new Map()
): Builder<T> {
  const builder = (new Proxy(Object.assign(new Ctor(), initValue) as T, {
    get(target, prop) {
      if (prop === 'body') {
        return target.body;
      }

      if (!Object.prototype.hasOwnProperty.call(target, prop)) {
        const propFn = (target as any)[prop];

        if (typeof propFn === 'function') {
          return (...args: any) => {
            propFn.call(target, ...args);
            return builder;
          };
        }
        return propFn;
      }

      if (cssProps.has(String(prop))) {
        return (value: string) => {
          target.style(cssProps.get(String(prop))!, value);
          return builder;
        };
      }

      const defaultValue =
        typeof (target as any)[prop] === 'boolean' ? true : undefined;

      return (x: any = defaultValue): Builder<T> => {
        (target as any)[prop] = x;
        return builder;
      };
    },
  }) as unknown) as Builder<T>;
  return builder;
}

export function generateBindings<T extends object>(
  obj: T,
  ignore: (keyof T)[] = []
): { [k: string]: any } {
  const options: { [k: string]: any } = {};

  Object.getOwnPropertyNames(obj)
    .filter(prop => !['attrs', 'styles', 'context', ...ignore].includes(prop))
    .forEach(((prop: keyof T) => {
      switch (typeof obj[prop]) {
        case 'boolean':
          options[`?${prop}`] = obj[prop];
          break;
        case 'function':
          options[`@${String(prop).substr(2).toLocaleLowerCase()}`] = obj[prop];
          break;
        case 'object':
          options[`.${prop}`] = obj[prop];
          break;
        default:
          options[String(prop)] = obj[prop];
      }
    }) as any);

  return options;
}

export interface CssProp {
  propName: string;
  cssPropTarget: string;
}
