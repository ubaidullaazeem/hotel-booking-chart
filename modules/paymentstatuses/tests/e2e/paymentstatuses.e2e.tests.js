'use strict';

describe('Paymentstatuses E2E Tests:', function () {
  describe('Test Paymentstatuses page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/paymentstatuses');
      expect(element.all(by.repeater('paymentstatus in paymentstatuses')).count()).toEqual(0);
    });
  });
});
