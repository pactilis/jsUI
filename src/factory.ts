import { spread } from '@open-wc/lit-helpers/src/spread';
import {
  CSSResult,
  html,
  LitElement,
  property,
  TemplateResult,
} from 'lit-element';
import { styleMap } from 'lit-html/directives/style-map';
import { asStatic, asTag } from 'static-params';
import { Builder, createViewBuilder } from './builder.js';
import {
  setCurrentComponent,
  subscribe,
  clearState,
  executeEffects,
  clearEffects,
} from './hooks/index.js';
import { Clazz, View, ViewAnimation } from './view.js';
import { toDashCase } from './util.js';
import { nothing } from 'lit-html';

export const cssPropMetadataKey = Symbol('cssProp');

export function view<T, U extends T = T>(
  tag: string,
  options: ComponentOptions<T>
): [() => Builder<View & { props: U }>, Clazz<View>, Clazz<any>];

export function view<T, U extends T = T>(
  tag: string,
  options: ComponentOptions<T>,
  PropsCtor?: Clazz<U>
): [() => Builder<U & View>, Clazz<View>, Clazz<any>];

export function view<T, U extends T = T>(
  tag: string,
  {
    template,
    slotTemplate,
    cssTemplate,
    cssProps,
    viewRoot,
  }: ComponentOptions<T>,
  PropsCtor?: Clazz<U>
) {
  let styles: CSSResult | CSSResult[] = [];
  if (cssTemplate) {
    styles = typeof cssTemplate === 'function' ? cssTemplate() : cssTemplate;
  }

  class ComponentClass extends LitElement {
    componentId = Symbol();

    @property({ type: Object }) props!: T;
    @property({ type: Array }) animations: ViewAnimation[] = [];

    static styles = styles;

    render() {
      setCurrentComponent(this.componentId);
      const tpl = template.bind(this)(this.props);
      if (!tpl) {
        return nothing;
      }
      if (tpl instanceof View) {
        return tpl.body;
      }
      if (tpl instanceof TemplateResult) {
        return tpl;
      }
      return tpl.map(t => (t instanceof View ? t.body : t));
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

    viewRoot(element: Element) {
      if (viewRoot) {
        return viewRoot(element);
      }
      return super.viewRoot(element);
    }

    constructor() {
      super();
      if (PropsCtor) {
        const mixin = new PropsCtor();
        const props = Object.keys(mixin);
        props.forEach(key => {
          this[key as keyof this] = mixin[key as keyof T] as any;
        });
      }
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
            ? slotTemplate(this.props ? this.props : (this as any))
            : nothing
        }
        </${el}>
      `;
    }
  }

  const _cssProps = cssProps ?? new Map<string, string>();
  if (PropsCtor && (Reflect as any).getMetadata) {
    const mixin = new PropsCtor();
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

  return [
    function () {
      return createViewBuilder(ComponentView, {}, _cssProps) as any;
    },
    ComponentView,
    ComponentClass,
  ] as any;
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
}

export interface ComponentOptions<T> {
  template: (props: T) => (TemplateResult | View) | (TemplateResult | View)[];
  slotTemplate?: (
    props: T
  ) => (TemplateResult | View) | (TemplateResult | View)[];
  cssTemplate?: (() => CSSResult) | CSSResult;
  cssProps?: Map<string, string>;
  viewRoot?: (element: Element) => Element;
}
