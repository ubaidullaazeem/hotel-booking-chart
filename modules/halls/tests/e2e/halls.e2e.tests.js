'use strict';

describe('Halls E2E Tests:', function () {
  describe('Test Halls page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/halls');
      expect(element.all(by.repeater('hall in halls')).count()).toEqual(0);
    });
  });
});
