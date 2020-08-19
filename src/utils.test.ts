import { expect } from '@open-wc/testing';
import { toDashCase } from './util.js';

describe('utils', () => {
  describe('toDashCase', () => {
    it('converts camel case to dash case', async () => {
      expect(toDashCase('myCamelCase')).to.equal('my-camel-case');
    });
  });
});
