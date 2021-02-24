/* eslint-disable no-use-before-define */
import { spread } from '@open-wc/lit-helpers/src/spread';
import {
  CSSResult,
  html,
  LitElement,
  property,
  TemplateResult,
} from 'lit-element';
import { nothing } from 'lit-html';
import { styleMap } from 'lit-html/directives/style-map';
import { asStatic, asTag } from 'static-params';
import { Builder, createViewBuilder } from './builder.js';
import {
  clearEffects,
  clearState,
  executeEffects,
  setCurrentComponent,
  subscribe,
} from './hooks/index.js';
import { toDashCase } from './util.js';
import { Clazz, View, ViewAnimation } from './view.js';

export const cssPropMetadataKey = Symbol('cssProp');
export const slotMetadataKey = Symbol('slot');

export function view<T, U, V>(
  tag: string,
  options: ComponentOptionsWithCtorAndFactory<T, U, V>
): [V & { View: Clazz<View> }, Clazz<View>, Clazz<any>];

export function view<T, U extends T = T>(
  tag: string,
  options: ComponentOptionsWithCtor<T, U>
): [BuilderFactory<U> & { View: Clazz<View> }, Clazz<View>, Clazz<any>];

export function view<T, U extends T = T>(
  tag: string,
  options: ComponentOptions<T>
): [
  (() => Builder<View & { props: U }>) & { View: Clazz<View> },
  Clazz<View>,
  Clazz<any>
];

export function view<T, U extends T = T, V = BuilderFactory<U>>(
  tag: string,
  options:
    | ComponentOptions<T>
    | ComponentOptionsWithCtor<T, U>
    | ComponentOptionsWithCtorAndFactory<T, U, V>
) {
  const { template, slotTemplate, cssTemplate, cssProps, viewRoot } = options;
  let Props: Clazz<U> | undefined;
  let mapBuilder: ((_: () => Builder<U & View>) => V) | undefined;

  if (hasPropsCtor<T, U>(options)) {
    Props = options.Props;
  }
  if (hasFactory<T, U, V>(options)) {
    mapBuilder = options.mapBuilder;
  }

  let styles: CSSResult | CSSResult[] = [];
  if (cssTemplate) {
    styles = typeof cssTemplate === 'function' ? cssTemplate() : cssTemplate;
  }

  class ComponentClass extends LitElement {
    componentId = Symbol(tag);

    @property({ type: Object }) props!: T;
    @property({ type: Array }) animations: ViewAnimation[] = [];

    static styles = styles;

    render() {
      setCurrentComponent(this.componentId);
      const tpl = template.bind(this)(this.props);
      return processTemplate(tpl);
    }

    firstUpdated() {
      subscribe(this.componentId, this);
    }

    updated(changedProperties: Map<string | number | symbol, unknown>) {
      executeEffects(this.componentId, this);

      if (changedProperties.has('animations')) {
        this.animations.forEach(animation => {
          this.animate(animation.keyframes, animation.options);
        });
      }
    }

    disconnectedCallback() {
      clearState(this.componentId);
      clearEffects(this.componentId);
      super.disconnectedCallback();
    }
  }
  customElements.define(tag, ComponentClass);

  const shtml = asTag(html);
  const el = asStatic(tag);

  class ComponentView extends View {
    props?: T = undefined;

    slotProps = new Map<keyof T, string>();

    viewRoot(element: Element) {
      if (viewRoot) {
        return viewRoot(element);
      }
      return super.viewRoot(element);
    }

    constructor() {
      super();
      if (Props) {
        const mixin = new Props();
        const props = Object.keys(mixin);
        props.forEach(key => {
          this[key as keyof this] = mixin[key as keyof T] as any;
          const slotName = (Reflect as any).getMetadata(
            slotMetadataKey,
            mixin,
            key
          );
          if (slotName) {
            this.slotProps.set(key as keyof T, slotName);
          }
        });
      }
    }

    getPropValue(key: string) {
      if (this.props) {
        return this.props[key as keyof T];
      }
      return this[key as keyof this];
    }

    get body(): TemplateResult {
      return shtml`
        <${el}
          ...=${spread({ ...this.attrs })}
          .view="${this}"
          style="${styleMap(this.styles)}"
          .props="${this.props ? this.props : this}"
          .animations="${this.animations}"
        >
        ${
          slotTemplate
            ? processTemplate(
                slotTemplate(this.props ? this.props : (this as any))
              )
            : nothing
        }
        ${[...this.slotProps.keys()].map(key => {
          const keyView = this.getPropValue(key as string);

          const name = this.slotProps.get(key);
          return processTemplate(keyView as any, v =>
            v.slot(!name || name === 'default' ? '' : name)
          );
        })}
        </${el}>
      `;
    }
  }

  const _cssProps = cssProps ?? new Map<string, string>();
  if (Props && (Reflect as any).getMetadata) {
    const mixin = new Props();
    Object.keys(mixin).forEach(key => {
      const propName = (Reflect as any).getMetadata(
        cssPropMetadataKey,
        mixin,
        key
      );
      if (propName) {
        _cssProps.set(key, propName);
      }
    });
  }

  // eslint-disable-next-line func-names
  let ViewFactory: any = function () {
    return createViewBuilder(ComponentView, {}, _cssProps) as any;
  };

  if (mapBuilder) {
    ViewFactory = mapBuilder(ViewFactory);
  }

  ViewFactory.View = ComponentView;

  return [ViewFactory, ComponentView, ComponentClass] as any;
}

export function cssPropsFrom(...props: string[]) {
  return new Map<string, string>(
    props.map(prop => [prop, `--${toDashCase(prop)}`])
  );
}

export function cssProp(name: string) {
  if ((Reflect as any).metadata) {
    return (Reflect as any).metadata(cssPropMetadataKey, name);
  }
  return undefined;
}

export function slot(name = 'default') {
  if ((Reflect as any).metadata) {
    return (Reflect as any).metadata(slotMetadataKey, name);
  }
  return undefined;
}

function processTemplate(
  tpl: (TemplateResult | View) | (TemplateResult | View)[],
  viewPreprocessor: (_: View) => View = v => v
) {
  if (!tpl) {
    return nothing;
  }
  if (tpl instanceof View) {
    return viewPreprocessor(tpl).body;
  }
  if (tpl instanceof TemplateResult) {
    return tpl;
  }
  return tpl.map(t => (t instanceof View ? viewPreprocessor(t).body : t));
}

interface ComponentOptions<T> {
  template: (props: T) => (TemplateResult | View) | (TemplateResult | View)[];
  slotTemplate?: (
    props: T
  ) => (TemplateResult | View) | (TemplateResult | View)[];
  cssTemplate?: (() => CSSResult) | CSSResult;
  cssProps?: Map<string, string>;
  viewRoot?: (element: Element) => Element;
}
interface ComponentOptionsWithCtor<T, U> extends ComponentOptions<T> {
  Props: Clazz<U>;
}

export type BuilderFactory<T> = () => Builder<T & View>;

interface ComponentOptionsWithCtorAndFactory<T, U, V>
  extends ComponentOptionsWithCtor<T, U> {
  mapBuilder: (_: BuilderFactory<U>) => V;
}

function hasPropsCtor<T, U>(
  options: any
): options is ComponentOptionsWithCtor<T, U> {
  if ('Props' in options) {
    return true;
  }
  return false;
}

function hasFactory<T, U, V>(
  options: any
): options is ComponentOptionsWithCtorAndFactory<T, U, V> {
  return hasPropsCtor<T, U>(options) && 'mapBuilder' in options;
}
