// import 'reflect-metadata';
import { Counter } from './jsview-counter.js';
import { VSTack } from '../layout/index.js';

export default {
  title: 'jsview-counter',
};

export const Simple = () => Counter().body;

export const CustomTitle = () => Counter('Hello Wolrd').body;

export const CustomTextColor = () =>
  VSTack(
    VSTack(
      Counter('Hi buddy').textColor('darkRed')
    ).context('--my-counter-context', { count: 45 })
  ).context('--my-counter-context', { count: 59 }).body;
