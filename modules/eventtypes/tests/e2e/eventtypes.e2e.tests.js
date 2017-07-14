'use strict';

describe('Eventtypes E2E Tests:', function () {
  describe('Test Eventtypes page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/eventtypes');
      expect(element.all(by.repeater('eventtype in eventtypes')).count()).toEqual(0);
    });
  });
});
