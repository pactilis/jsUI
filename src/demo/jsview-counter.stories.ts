import 'reflect-metadata';
import { Counter } from './jsview-counter.js';

export default {
  title: 'jsview-counter',
};

export const Simple = () => Counter().body;

export const CustomTitle = () => Counter('Hello Wolrd').body;

export const CustomTextColor = () =>
  Counter('Hi buddy').textColor('darkRed').body;
