import { useState } from './use-state.js';
import { useEffect } from './use-effect.js';
import { View } from '../view.js';

export function useContext<T>(token: string) {
  const [value, setValue] = useState<T | undefined>(undefined);
  useEffect(element => {
    const key = getComputedStyle(element).getPropertyValue(token);
    setValue(View.contextStore.get(token)?.keyMap.get(key));
  });
  return value;
}
