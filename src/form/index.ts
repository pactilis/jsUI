import { html } from 'lit-html';
import { useState } from '../hooks/index.js';
import { View } from '../view.js';
import { view } from '../index.js';
import { Builder } from '../builder.js';

function formTemplate<T>({
  factory,
  value: initialValue,
  isValid: initialIsValid,
  onChange,
  onSubmit,
}: FormProps<T>) {
  const [value, setValue] = useState(initialValue);
  const [isValid, setIsValid] = useState(initialIsValid);
  const [touched, setTouched] = useState(false);

  const isFormValid = Object.keys(isValid).every(
    name => isValid[name as keyof T]
  );

  if (touched) {
    onChange?.(value, isFormValid);
  }

  const onFieldChange = (
    name: keyof T,
    fieldValue: any,
    fieldIsValid: boolean
  ) => {
    setValue({
      ...value,
      [name]: fieldValue,
    });
    setIsValid({
      ...isValid,
      [name]: fieldIsValid,
    });
    setTouched(true);
  };

  return html`
    <form>
      ${factory?.({
        onFieldChange,
        value,
        isValid: isFormValid,
        touched,
        submit: () => onSubmit?.(value, isFormValid),
      }).body}
    </form>
  `;
}

export class FormProps<T> {
  factory?: (_: FormFactoryParam<T>) => View = undefined;
  value: T = {} as T;
  isValid: { [key in keyof T]: boolean } = {} as { [key in keyof T]: boolean };
  onChange?: (value: T, isValid: boolean) => void = undefined;
  onSubmit?: (value: T, isValid: boolean) => void = undefined;
}

export interface FormFactoryParam<T> {
  onFieldChange: (name: keyof T, value: unknown, isValid: boolean) => void;
  value: T;
  touched: boolean;
  isValid: boolean;
  submit: () => void;
}

export const [FormViewBuilder, FormView] = view<FormProps<any>>(
  'jsview-form',
  {
    template: formTemplate as any,
  },
  FormProps
);

export function Form<T>(factory: (_: FormFactoryParam<T>) => View) {
  return ((FormViewBuilder() as unknown) as Builder<FormProps<T>>).factory(
    factory
  );
}
