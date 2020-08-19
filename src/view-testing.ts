import { fixture as wcFixture } from '@open-wc/testing';
import { TemplateResult } from 'lit-html';
import { View, ViewElement, Clazz } from './view.js';

export function fixture<T extends Element>(
  template: View
): Promise<ViewElement>;

export function fixture<T extends Element>(
  template:
    | string
    | number
    | boolean
    | string[]
    | number[]
    | Node
    | boolean[]
    | Node[]
    | TemplateResult
    | TemplateResult[]
    | View
): Promise<T> {
  if (template instanceof View) {
    return wcFixture(template.body as TemplateResult);
  }
  return wcFixture(template);
}

export function query<K extends keyof HTMLElementTagNameMap>(
  element: ViewElement,
  search: K
): HTMLElementTagNameMap[K] | null;

export function query<K extends keyof SVGElementTagNameMap>(
  element: ViewElement,
  search: K
): SVGElementTagNameMap[K] | null;

export function query<E extends Element = Element>(
  element: ViewElement,
  search: string
): Element | null;

export function query<K extends keyof HTMLElementTagNameMap | Element>(
  element: ViewElement,
  ...searchClasses: Clazz<View>[]
): ViewElement | null;

export function query(
  element: ViewElement,
  ...searchClasses: Clazz<View>[] | string[]
): ViewElement | Element | null {
  if (searchClasses.length === 0) {
    return element;
  }

  const view = element.view;
  if (typeof searchClasses[0] === 'string') {
    return (
      view
        .viewRoot(element)
        .shadowRoot?.querySelector(searchClasses[0] as string) ?? null
    );
  }
  const nodes = view.viewRoot(element).shadowRoot?.querySelectorAll('*');
  if (!nodes) {
    return null;
  }
  for (let i = 0; i < nodes!.length; ++i) {
    const el: ViewElement = nodes[i] as any;
    if (el.view instanceof (searchClasses[0] as any)) {
      return query(el, ...(searchClasses as Clazz<View>[]).slice(1));
    }
  }
  return null;
}

export function queryAll(
  element: ViewElement,
  search: string
): NodeListOf<Element>;

export function queryAll(
  element: ViewElement,
  ...searchClasses: Clazz<View>[]
): Element[];

export function queryAll(
  element: ViewElement,
  ...searchClasses: Clazz<View>[] | string[]
): Element[] | NodeListOf<Element> {
  if (searchClasses.length === 0) {
    return [];
  }
  const view = element.view;
  if (typeof searchClasses[0] === 'string') {
    return (
      view
        .viewRoot(element)
        .shadowRoot?.querySelectorAll(searchClasses[0] as string) ?? []
    );
  }
  const nodes = view.viewRoot(element).shadowRoot?.querySelectorAll('*');
  if (!nodes) {
    return [];
  }
  const elements: Element[] = [];

  for (let i = 0; i < nodes!.length; ++i) {
    const el: ViewElement = nodes[i] as any;
    if (
      ((searchClasses as unknown) as View[]).find(
        (C: any) => el.view instanceof C
      )
    ) {
      elements.push(el);
    }
  }

  return elements;
}
