'use strict';

const expect = require('chai').expect;

const config = require('../app/config');
const daoUtil = require('../app/daoUtil');

describe('daoUtil', () => {

  describe('getIndexName', () => {
    let originalIndex;

    before(() => originalIndex = config.es.index);
    after(() => config.es.index = originalIndex);

    describe('when index name is abc', () => {
      beforeEach(() => config.es.index = 'abc');
      describe('when type is an array', () => {
        it('should return array of types prefixed with index from config',
          () => expect(daoUtil.getIndexName(['x', 'z', 'y'])).to.eql(['abc-x', 'abc-z', 'abc-y']));
      });
      describe('when type is a string', () => {
        it('should return type prefixed with index from config',
          () => expect(daoUtil.getIndexName('zyx')).to.eql('abc-zyx'));
      });
    });
    describe('when index name is def', () => {
      beforeEach(() => config.es.index = 'def');
      describe('when type is an array', () => {
        it('should return array of types prefixed with index from config',
          () => expect(daoUtil.getIndexName(['c', 'a', 'b'])).to.eql(['def-c', 'def-a', 'def-b']));
      });
      describe('when type is a string', () => {
        it('should return type prefixed with index from config',
          () => expect(daoUtil.getIndexName('xyz')).to.eql('def-xyz'));
      });
    });
  });
});
