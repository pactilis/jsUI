import { expect } from '@open-wc/testing';
import { cssPropsFrom } from './factory.js';

describe('factory', () => {
  describe('cssPropsFrom', () => {
    it('creates css props map from array of string', async () => {
      const expected = new Map([
        ['myCssProp', '--my-css-prop'],
        ['anotherCssProp', '--another-css-prop'],
      ]);
      expect(cssPropsFrom('myCssProp', 'anotherCssProp')).to.deep.equal(
        expected
      );
    });

    it('generetes an empty map from empty array', async () => {
      expect(cssPropsFrom()).to.deep.eq(new Map());
    });
  });
});
