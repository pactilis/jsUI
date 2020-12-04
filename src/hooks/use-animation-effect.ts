import { ViewAnimation } from '../view.js';
import { useEffect } from './use-effect.js';

export function useAnimationEffect(
  animations: ViewAnimation[],
  deps: any[] = []
) {
  useEffect(element => {
    animations.forEach(({ keyframes, options }) =>
      element.animate(keyframes, options)
    );
  }, deps);
}
