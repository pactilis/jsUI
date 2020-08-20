import { html } from 'lit-html';
import { HSTack } from '../layout/index.js';
import { createView } from '../view.js';
import { Form } from './index.js';

export default {
  title: 'form',
};

export const Simple = () =>
  Form<{ name: string; gender: string }>(
    ({ value, isValid, touched, onFieldChange, submit }) =>
      HSTack(
        createView(
          html`
            <div>
              <label for="name">Name:</label>
              <input
                id="name"
                type="text"
                name="name"
                required
                value="${value.name}"
                @change="${(e: { target: HTMLInputElement }) =>
                  onFieldChange(
                    'name',
                    e.target.value,
                    e.target.checkValidity()
                  )}"
              />
            </div>
          `
        ),

        createView(
          html`
            <div>
              <label for="gender">Gender:</label>
              <select
                id="gender"
                .value="${value.gender}"
                name="gender"
                required
                @change="${(e: { target: HTMLSelectElement }) =>
                  onFieldChange(
                    'gender',
                    e.target.value,
                    e.target.checkValidity()
                  )}"
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
            ?disabled="${!isValid || !touched}"
            type="submit"
            @click="${submit}"
          >
            Submit
          </button>`
        )
      ).verticalAlign('end')
  )
    .value({ name: 'Jonatan', gender: 'F' })
    .isValid({ name: true, gender: true })
    .onChange((value, isValid) => console.log('form change', value, isValid))
    .onSubmit((value, isValid) =>
      console.log('submitting form', value, isValid)
    ).body;
