/* eslint-disable no-param-reassign */
import { getCurrent, incrementIndex } from './core.js';

interface Effect {
  func: (element: HTMLElement) => (() => void) | void;
  clearFn?: () => void;
  deps?: any[];
  shouldRun: boolean;
}

const store: Map<symbol, Map<number, Effect>> = new Map();

export function useEffect(
  fn: (element: HTMLElement) => void | (() => void),
  deps?: any[]
) {
  const [currentComponent, currentIndex] = getCurrent();

  if (!currentComponent) {
    throw new Error('No current component');
  }
  if (!store.has(currentComponent)) {
    store.set(currentComponent, new Map<number, Effect>());
  }
  const effectMap = store.get(currentComponent)!;
  const previousEffect = effectMap.get(currentIndex);

  effectMap.set(currentIndex, {
    func: fn,
    clearFn: previousEffect?.clearFn,
    deps,
    shouldRun: !equal(deps, previousEffect?.deps),
  });
  incrementIndex();
}

export function executeEffects(componentId: symbol, element: HTMLElement) {
  const effectMap = store.get(componentId);
  if (!effectMap) {
    return;
  }
  [...effectMap.keys()]
    .sort()
    .map(index => effectMap.get(index))
    .filter(eff => eff?.shouldRun)
    .forEach(async eff => {
      eff!.clearFn?.();
      const ret = eff!.func(element);
      if (ret) {
        eff!.clearFn = ret;
      } else {
        eff!.clearFn = undefined;
      }
    });
}

export function clearEffects(componentId: symbol) {
  const effectMap = store.get(componentId);
  if (!effectMap) {
    return;
  }
  [...effectMap.keys()]
    .sort()
    .map(index => effectMap.get(index))
    .forEach(async eff => {
      eff!.clearFn?.();
    });
  store.delete(componentId);
}

function equal(deps?: any[], prevDeps?: any[]): boolean {
  if (!prevDeps || !deps) {
    return false;
  }
  if (deps.length !== prevDeps.length) {
    return false;
  }
  for (let i = 0; i < deps.length; i += 1) {
    if (deps[i] !== prevDeps[i]) {
      return false;
    }
  }
  return true;
}
