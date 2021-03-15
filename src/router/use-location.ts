import { useEffect, useMemo } from '../hooks/index.js';

const callbacks = new Set<(location: Location) => void>();

export function register(callback: (location: Location) => void) {
  callbacks.add(callback);
}

export function unregister(callback: (location: Location) => void) {
  callbacks.delete(callback);
}

export function navigate(url: string) {
  window.history.pushState({}, '', url);
  callbacks.forEach(cb => cb(window.location));
}

export function useLocation(callback: (location: Location) => void) {
  useEffect(() => {
    const listener = useMemo(() => () => callback(window.location), [callback]);
    window.addEventListener('popstate', listener);

    register(callback);
    callback(window.location);
    return () => {
      unregister(callback);
      window.removeEventListener('popstate', listener);
    };
  }, []);
}
