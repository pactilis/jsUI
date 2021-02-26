/* eslint-disable import/no-duplicates */
import '@material/mwc-textfield';
import { html } from 'lit-html';
import { styleMap } from 'lit-html/directives/style-map';
import { view } from '../factory.js';
import { useState } from '../hooks/index.js';
import { HSTack } from '../layout/index.js';
import { createView } from '../view.js';
import { Form } from './index.js';

export default {
  title: 'form',
};

const [MyForm] = view('demo-my-form', {
  template() {
    const [resetCount, setResetCount] = useState(0);

    return Form<{ name: string; lastname: string; gender: string }>(
      ({ value, isValid, touched, onFieldChange, submit, setReset }) =>
        HSTack(
          createView(
            ({ styles }) => html`
              <div style="${styleMap(styles)}">
                <label for="name">Name:</label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  required
                  .value="${value.name}"
                  @change="${(e: { target: HTMLInputElement }) =>
                    onFieldChange(
                      'name',
                      e.target.value,
                      e.target.checkValidity()
                    )}"
                />
              </div>
            `
          ).color('blue'),

          createView(html`
            <mwc-textfield
              label="Lastname"
              required
              .value="${value.lastname}"
              @change="${(e: { target: any }) => {
                onFieldChange(
                  'lastname',
                  e.target.value,
                  e.target.checkValidity()
                );
              }}"
              @blur="${(e: any) => {
                setReset(
                  'lastname',
                  (() => {
                    const field = e.target;
                    return () => {
                      console.log('resetting textfield', field);
                      field.isUiValid = true;
                      field.mdcFoundation.setValid(true);
                    };
                  })()
                );
              }}"
            ></mwc-textfield>
          `),

          createView(
            html`
              <div>
                <label for="gender">Gender:</label>
                <select
                  id="gender"
                  .value="${value.gender}"
                  name="gender"
                  required
                  @blur="${(e: { target: HTMLSelectElement }) => {
                    onFieldChange(
                      'gender',
                      e.target.value,
                      e.target.checkValidity()
                    );
                  }}"
                >
                  <option value=""></option>
                  <option value="F">F</option>
                  <option value="M">M</option>
                </select>
              </div>
            `
          ),

          createView(
            html`<button
              type="button"
              @click="${() => setResetCount(count => count + 1)}"
            >
              Reset
            </button>`
          ),

          createView(
            html`<button
              ?disabled="${!isValid || !touched}"
              type="submit"
              @click="${submit}"
            >
              Submit
            </button>`
          )
        ).justifyItems('end')
    )
      .value({ name: `Jonatan ${resetCount}`, gender: 'F', lastname: '' })
      .resetDeps([resetCount])
      .isValid({ name: true, gender: true, lastname: false })
      .onChange((value, isValid) => console.log('form change', value, isValid))
      .onSubmit((value, isValid) =>
        console.log('submitting form', value, isValid)
      )
      .onResetting(() => console.log('Resetting form'))
      .onResetted(() => console.log('Resetted form'));
  },
});

export const Simple = () => MyForm().body;
