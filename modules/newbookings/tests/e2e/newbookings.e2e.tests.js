'use strict';

describe('Newbookings E2E Tests:', function () {
  describe('Test Newbookings page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/newbookings');
      expect(element.all(by.repeater('newbooking in newbookings')).count()).toEqual(0);
    });
  });
});
