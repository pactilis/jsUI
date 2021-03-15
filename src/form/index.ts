import { html } from 'lit-html';
import { Builder } from '../builder.js';
import { view } from '../factory.js';
import { useEffect, useState } from '../hooks/index.js';
import { Clazz, View } from '../view.js';

export class FormProps<T> {
  factory?: (_: FormFactoryParam<T>) => View = undefined;
  value: T = {} as T;
  isValid: { [key in keyof T]: boolean } = {} as { [key in keyof T]: boolean };
  onChange?: (value: T, isValid: boolean) => void = undefined;
  onSubmit?: (value: T, isValid: boolean) => void = undefined;
  onResetting?: () => void = undefined;
  onResetted?: () => void = undefined;
  resetDeps: any = [];
}

export interface FormFactoryParam<T> {
  onFieldChange: (name: keyof T, value: unknown, isValid: boolean) => void;
  value: T;
  touched: boolean;
  isValid: boolean;
  submit: () => void;
  resetting: boolean;
  setReset: (name: keyof T, fn: () => void) => void;
}

export const [Form, FormView]: [
  (<T>(factory: (_: FormFactoryParam<T>) => View) => Builder<FormProps<T>>) & {
    View: Clazz<FormProps<unknown> & View>;
  },
  Clazz<FormProps<unknown> & View>,
  Clazz<unknown>
] = view('jsview-form', {
  Props: FormProps,

  mapBuilder: FormBuilder => <T>(factory: (_: FormFactoryParam<T>) => View) =>
    ((FormBuilder() as unknown) as Builder<FormProps<T>>).factory(factory),

  template: function formTemplate<T>({
    factory,
    value: initialValue,
    isValid: initialIsValid,
    onChange,
    onSubmit,
    onResetting,
    onResetted,
    resetDeps,
  }: FormProps<T>) {
    const [value, setValue] = useState(initialValue);
    const [isValid, setIsValid] = useState(initialIsValid);
    const [touched, setTouched] = useState(false);
    const [formFieldChanged, setFormFieldChanged] = useState(false);
    const [resetStore, setResetStore] = useState<
      { [k in keyof T]: () => void }
    >({} as any);
    const [resetting, setResetting] = useState(false);

    const isFormValid = Object.keys(isValid).every(
      name => isValid[name as keyof T]
    );

    useEffect(() => {
      if (touched && formFieldChanged) {
        onChange?.(value, isFormValid);
        setFormFieldChanged(false);
      }
    }, [touched, formFieldChanged]);

    const onFieldChange = (
      name: keyof T,
      fieldValue: any,
      fieldIsValid: boolean
    ) => {
      setValue(oldValue => ({
        ...oldValue,
        [name]: fieldValue,
      }));
      setIsValid(oldValid => ({
        ...oldValid,
        [name]: fieldIsValid,
      }));
      setTouched(true);
      setFormFieldChanged(true);
    };

    const setReset = (name: keyof T, fn: () => void) => {
      setResetStore(prev => ({
        ...prev,
        [name]: fn,
      }));
    };

    useEffect(() => {
      setResetting(true);
      setValue(initialValue);
      setIsValid(initialIsValid);
      setTouched(false);
      setFormFieldChanged(false);

      onResetting?.();
    }, resetDeps);

    useEffect(() => {
      if (resetting) {
        Object.keys(value).forEach(name => {
          resetStore[name as keyof T]?.();
        });
        setResetting(false);
        onResetted?.();
        onChange?.(value, isFormValid);
      }
    }, [resetting]);

    return html`
      <form>
        ${factory?.({
          onFieldChange,
          value,
          isValid: isFormValid,
          touched,
          submit: () => onSubmit?.(value, isFormValid),
          resetting,
          setReset,
        }).body}
      </form>
    `;
  } as any,

  noShadow: true,
});
