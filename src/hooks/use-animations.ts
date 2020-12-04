import { ViewAnimation } from '../view.js';
import { useEffect } from './use-effect.js';
import { useState } from './use-state.js';

export function useAnimations(animations: ViewAnimation[], deps: any[]) {
  const [value, setValue] = useState<ViewAnimation[]>([]);
  useEffect(() => {
    setValue([...animations]);
  }, deps);
  return value;
}
