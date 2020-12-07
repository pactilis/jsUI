import { useEffect } from './use-effect.js';
import { useState } from './use-state.js';

export function useMemo<T>(computeFunc: () => T, deps: any[]) {
  const [value, setValue] = useState(computeFunc());
  useEffect(() => {
    setValue(computeFunc());
  }, deps);
  return value;
}
