import { getCurrent, incrementIndex } from './core.js';

interface State<T> {
  value: T;
  setValue: (val: T | ((prev: T) => T)) => void;
}

const store: Map<symbol, Map<number, State<any>>> = new Map();

const components: Map<symbol, { requestUpdate: () => void }> = new Map();

export function subscribe(
  componentId: symbol,
  component: { requestUpdate: () => void }
) {
  components.set(componentId, component);
}

export function clearState(componentId: symbol) {
  store.delete(componentId);
  components.delete(componentId);
}

export function useState<T>(
  initialValue: T
): [T, (val: T | ((prev: T) => T)) => void] {
  const [currentComponent, currentIndex] = getCurrent();

  if (!currentComponent) {
    throw new Error('No current component');
  }
  if (!store.has(currentComponent)) {
    store.set(currentComponent, new Map<number, State<T>>());
  }
  const stateMap: Map<number, State<T>> = store.get(currentComponent)!;
  if (!stateMap.has(currentIndex)) {
    stateMap.set(currentIndex, {
      value: initialValue,
      setValue: createSetState(currentComponent, currentIndex),
    });
  }
  const { value, setValue } = stateMap.get(currentIndex)!;

  incrementIndex();

  return [value, setValue];
}

function createSetState<T>(component: symbol, index: number) {
  return function (val: ((prev: T) => T) | T) {
    const state: State<T> = store.get(component)!.get(index)!;
    const previousValue = state.value;

    if (typeof val === 'function') {
      state.value = (val as (prev: T) => T)(state.value);
    } else {
      state.value = val;
    }
    if (previousValue != state.value) {
      components.get(component)!.requestUpdate();
    }
  };
}
