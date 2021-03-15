import 'reflect-metadata';
import { assert, expect } from '@open-wc/testing';
import { html, TemplateResult } from 'lit-html';
import { slot, view } from './factory.js';
import { fixture, query } from './view-testing.js';
import { View } from './view.js';
import { Form } from './form/index.js';

function createSampleButtonView(tag: string) {
  class ButtonProps {
    label = 'Click';
  }
  return view(tag, {
    Props: ButtonProps,
    mapBuilder: ButtonBuilder => (label: string) =>
      ButtonBuilder().label(label),

    template({ label }: ButtonProps) {
      return html`<button>${label}</button>`;
    },
  });
}

function createSampleView(tag: string) {
  class Props {
    @slot()
    slotted?: TemplateResult | View = undefined;

    title?: string = 'This is my title';

    innerComponent?: View = undefined;
  }

  const [Component] = view(tag, {
    Props,
    mapBuilder: ComponentBuilder => (slotted?: TemplateResult | View) =>
      ComponentBuilder().slotted(slotted),

    template({ innerComponent, title }: Props) {
      return html`
        <h1>${title}</h1>
        <h1>This is my title 2</h1>
        <div class="section content">This is a section</div>
        ${innerComponent?.body}
        <slot></slot>
      `;
    },
  });
  return { Component };
}

async function render(
  tag: string,
  props: {
    slotted?: TemplateResult | View;
    innerComponent?: View;
    title?: string;
  } = {}
) {
  const { Component } = createSampleView(tag);
  const element = await fixture(
    Component(props.slotted)
      .innerComponent(props.innerComponent)
      .title(props.title ?? 'This is my title')
  );
  return { element };
}

describe('View testing', () => {
  describe('query', () => {
    it('queries a View element shadow dom child by tag name', async () => {
      const { element } = await render('sample-1');
      const title = query(element, 'h1');
      expect(title?.tagName).to.eq('H1');
      expect(title?.textContent).to.eq('This is my title');
    });

    it('queries a View element shadow dom child by class selector', async () => {
      const { element } = await render('sample-2');
      const section = query(element, '.section');
      expect(section?.tagName).to.eq('DIV');
      assert(
        section?.classList.contains('section'),
        'Found child has the requested class'
      );
    });

    it('can retrieve view element shadow dom child that lands in an inner-component slot', async () => {
      const { Component: InnerComponent } = createSampleView('sample-3-inner');
      const { element } = await render('sample-3', {
        innerComponent: InnerComponent(
          html`<div class="slotted">I am slotted</div>`
        ),
      });

      const slotted = query(element, '.slotted');
      assert(
        slotted?.classList.contains('slotted'),
        'requested child has the requested class'
      );
      expect(slotted?.textContent).to.eq('I am slotted');
    });

    it('queries a View element shadow dom child by Builder function', async () => {
      const { Component: InnerComponent } = createSampleView('sample-4-inner');
      const { element } = await render('sample-4', {
        innerComponent: InnerComponent().title('Inner component'),
      });

      const inner = query(element, InnerComponent);
      assert(inner?.view instanceof InnerComponent.View);
      expect(inner?.view.title).to.eq('Inner component');
    });

    it('queries a child that lands in the shadow dom of a child', async () => {
      const { Component: InnerComponent } = createSampleView('sample-5-inner');
      const [Button] = createSampleButtonView('button-5');

      const { element } = await render('sample-5', {
        innerComponent: InnerComponent()
          .title('Inner component')
          .innerComponent(Button('Deep inner component')),
      });
      const deepChild = query(element, InnerComponent, Button);
      assert(
        deepChild?.view instanceof Button.View,
        'Requested element comes from the right View class'
      );
      expect(deepChild?.view.label).to.eq('Deep inner component');
    });

    it('can go down by 3 level of deepness', async () => {
      const { Component: InnerComponent } = createSampleView('sample-6-inner');
      const [Button] = createSampleButtonView('button-6');

      const { element } = await render('sample-6', {
        innerComponent: InnerComponent()
          .title('Inner component')
          .innerComponent(
            InnerComponent().innerComponent(Button('Very deep inner component'))
          ),
      });
      const veryDeepChild = query(
        element,
        InnerComponent,
        InnerComponent,
        Button
      );
      assert(
        veryDeepChild?.view instanceof Button.View,
        'Requested element comes from the right View class'
      );
      expect(veryDeepChild?.view.label).to.eq('Very deep inner component');
    });

    it('cannot go down more than 3 level', async () => {
      const { Component: InnerComponent } = createSampleView('sample-7-inner');
      const [Button] = createSampleButtonView('button-7');

      const { element } = await render('sample-7', {
        innerComponent: InnerComponent()
          .title('Inner component')
          .innerComponent(
            InnerComponent().innerComponent(
              InnerComponent().innerComponent(
                Button('Very deep inner component')
              )
            )
          ),
      });
      expect(() =>
        query(element, InnerComponent, InnerComponent, InnerComponent, Button)
      ).to.throw('a maximum of 3 search classes is required but got 4');
    });

    it('can go down up to 3 level with the last search param being a string or tag', async () => {
      const { Component: InnerComponent } = createSampleView('sample-8-inner');

      const { element } = await render('sample-8', {
        innerComponent: InnerComponent()
          .title('Inner component')
          .innerComponent(
            Form(() =>
              InnerComponent(html`<input id="name" value="Jonatan" />`)
            )
          ),
      });
      const deepChild = query(element, InnerComponent, 'input');
      expect(deepChild?.tagName).to.eq('INPUT');
      expect(deepChild?.id).to.eq('name');
      expect(deepChild?.value).to.eq('Jonatan');
    });
  });
});
