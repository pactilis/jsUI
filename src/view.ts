import { LitElement } from 'lit-element';
import {
  nothing,
  render as litRender,
  RenderOptions,
  TemplateResult,
} from 'lit-html';

export abstract class View {
  attrs: { [key: string]: string } = {};
  styles: { [key: string]: string } = {};

  abstract get body(): TemplateResult | string | typeof nothing;

  viewRoot(element: Element): Element {
    return element;
  }

  slot(name: string): this {
    this.attrs['slot'] = name;
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

  attr(attrs: { [key: string]: string }) {
    this.attrs = {
      ...this.attrs,
      ...attrs,
    };
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

export { html } from 'lit-html';
export { css } from 'lit-element';

export type ViewElement = LitElement & { view: View };

class TemplateView extends View {
  constructor(private template: () => TemplateResult) {
    super();
  }
  get body() {
    return this.template();
  }
}

export function createView(
  template: (() => TemplateResult) | TemplateResult
): View {
  if (typeof template === 'function') {
    return new TemplateView(template);
  }
  return new TemplateView(() => template);
}

export type Clazz<T> = new (...args: any[]) => T;
