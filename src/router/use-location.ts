import { useEffect } from '../hooks/index.js';
import { installRouter } from 'pwa-helpers/router';

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
    installRouter(location => {
      callback(location);
    });
    register(callback);
  }, []);
}
