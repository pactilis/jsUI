import { html } from 'lit-html';
import { VSTack } from '../layout/index.js';
import { createView } from '../view.js';
import { Button } from './button.js';
import { Counter } from './jsview-counter.js';

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
  ).justifyItems('center').body;

export const CustomTitle = () =>
  Counter('Hello Wolrd')
    .incrementTrigger(Button('++'))
    .decrementTrigger(Button('--'))
    .comment([createView(html`COOL`), createView(html`Buddy`), Button('BIG')])
    .description(createView(html`This is my description`)).body;

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
  )
    .justifyItems('center')
    .context('--my-counter-context', { count: 59 }).body;
