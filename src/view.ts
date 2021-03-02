import { LitElement } from 'lit-element';
import {
  nothing,
  render as litRender,
  RenderOptions,
  TemplateResult,
} from 'lit-html';

export class ViewContext {
  count = 0;
  valueMap: WeakMap<any, string> = new WeakMap();
  keyMap: Map<string, any> = new Map();
}

export interface ViewAnimation {
  keyframes: Keyframe[] | PropertyIndexedKeyframes | null;
  options?: number | KeyframeAnimationOptions | undefined;
}

export abstract class View {
  attrs: { [key: string]: string | boolean } = {};
  styles: { [key: string]: string } = {};
  animations: ViewAnimation[] = [];

  static contextStore: Map<string, ViewContext> = new Map();

  abstract get body(): TemplateResult | string | typeof nothing;

  static root(element: ViewElement): Element {
    return element.view.viewRoot(element);
  }

  // eslint-disable-next-line class-methods-use-this
  viewRoot(element: Element): Element {
    return element;
  }

  withAnimations(animations: ViewAnimation[]) {
    this.animations = animations;
    return this;
  }

  slot(name: string): this {
    if (name) {
      this.attrs.slot = name;
    }
    return this;
  }

  color(color: string) {
    this.style('color', color);
    return this;
  }

  style(nameOrStyles: string | { [key: string]: string }, value?: string) {
    if (typeof nameOrStyles === 'string') {
      if (value) {
        this.styles[nameOrStyles] = value;
      }
    } else {
      this.styles = {
        ...this.styles,
        ...nameOrStyles,
      };
    }

    return this;
  }

  attr(
    nameOrAttrs: string | { [key: string]: string | boolean },
    value?: string | boolean
  ) {
    if (typeof nameOrAttrs === 'string') {
      if (typeof value === 'boolean') {
        this.attrs[`?${nameOrAttrs}`] = value;
        return this;
      }
      this.attrs[nameOrAttrs] = value ?? '';
      return this;
    }
    this.attrs = {
      ...this.attrs,
      ...nameOrAttrs,
    };
    return this;
  }

  className(name: string) {
    return this.attr('class', name);
  }

  context(token: string, value: any) {
    if (!View.contextStore.has(token)) {
      View.contextStore.set(token, new ViewContext());
    }
    const viewContext = View.contextStore.get(token)!;
    if (!viewContext.valueMap.has(value)) {
      const key = `${token}-${viewContext.count}`;
      viewContext.valueMap.set(value, key);
      viewContext.keyMap.set(key, value);
      viewContext.count += 1;
    }
    const key = viewContext.valueMap.get(value);
    this.style(token, key);
    return this;
  }
}

export function render(
  result: unknown,
  container: Element | DocumentFragment,
  options?: Partial<RenderOptions>
) {
  if (result instanceof View) {
    return litRender(result.body, container, options);
  }
  return litRender(result, container, options);
}

export type ViewElement = LitElement & { view: View };

class TemplateView extends View {
  constructor(
    private template: (opts: {
      attrs: { [key: string]: string | boolean };
      styles: { [key: string]: string };
    }) => TemplateResult
  ) {
    super();
  }
  get body() {
    return this.template({ attrs: this.attrs, styles: this.styles });
  }
}

export function createView(
  template:
    | ((opts: {
        attrs: { [key: string]: string | boolean };
        styles: { [key: string]: string };
      }) => TemplateResult)
    | TemplateResult
): View {
  if (typeof template === 'function') {
    return new TemplateView(template);
  }
  return new TemplateView(() => template);
}

export type Clazz<T> = new (...args: any[]) => T;
