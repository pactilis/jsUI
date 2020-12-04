import { Counter } from './jsview-counter.js';
import { VSTack } from '../layout/index.js';

export default {
  title: 'jsview-counter',
};

export const Simple = () =>
  VSTack(
    Counter().withAnimations([
      {
        keyframes: { transform: ['rotate(0deg)', 'rotate(360deg)'] },
        options: { duration: 1000, iterations: Infinity },
      },
    ])
  ).body;

export const CustomTitle = () => Counter('Hello Wolrd').body;

export const CustomTextColor = () =>
  VSTack(
    VSTack(
      Counter('Hi buddy')
        .textColor('darkRed')
        .withAnimations([
          {
            keyframes: { transform: ['rotate(0deg)', 'rotate(360deg)'] },
            options: { duration: 1000, iterations: Infinity },
          },
        ])
    ).context('--my-counter-context', { count: 45 })
  ).context('--my-counter-context', { count: 59 }).body;
