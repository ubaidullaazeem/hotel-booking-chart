'use strict';

describe('Counters E2E Tests:', function () {
  describe('Test Counters page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/counters');
      expect(element.all(by.repeater('counter in counters')).count()).toEqual(0);
    });
  });
});
