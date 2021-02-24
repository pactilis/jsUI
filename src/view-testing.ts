import { fixture as wcFixture } from '@open-wc/testing';
import { TemplateResult } from 'lit-html';
import { Clazz, View, ViewElement } from './view.js';

export function fixture(template: View): Promise<ViewElement>;

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

export function query(element: ViewElement, search: string): Element | null;

export function query(
  element: ViewElement,
  ...searchClasses: { View: Clazz<View> }[]
): ViewElement | null;

export function query(
  element: ViewElement,
  ...searchClasses: { View: Clazz<View> }[] | string[]
): ViewElement | Element | null {
  if (searchClasses.length === 0) {
    return View.root(element);
  }

  if (typeof searchClasses[0] === 'string') {
    return (
      View.root(element).shadowRoot?.querySelector(
        searchClasses[0] as string
      ) ?? null
    );
  }
  const nodes = View.root(element).shadowRoot?.querySelectorAll('*');
  if (!nodes) {
    return null;
  }
  for (let i = 0; i < nodes!.length; i += 1) {
    const el: ViewElement = nodes[i] as any;
    if (el.view instanceof searchClasses[0].View) {
      return query(el, ...(searchClasses as { View: Clazz<View> }[]).slice(1));
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
  ...searchClasses: { View: Clazz<View> }[]
): Element[];

export function queryAll(
  element: ViewElement,
  ...searchClasses: { View: Clazz<View> }[] | string[]
): Element[] | NodeListOf<Element> {
  if (searchClasses.length === 0) {
    return [];
  }
  if (typeof searchClasses[0] === 'string') {
    return (
      View.root(element).shadowRoot?.querySelectorAll(
        searchClasses[0] as string
      ) ?? []
    );
  }
  const nodes = View.root(element).shadowRoot?.querySelectorAll('*');
  if (!nodes) {
    return [];
  }
  const elements: Element[] = [];

  for (let i = 0; i < nodes!.length; i += 1) {
    const el: ViewElement = nodes[i] as any;
    if (
      (searchClasses as { View: Clazz<View> }[]).find(
        C => el.view instanceof C.View
      )
    ) {
      elements.push(View.root(el));
    }
  }

  return elements;
}
