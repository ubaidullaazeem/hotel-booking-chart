// Paymentstatuses service used to communicate Paymentstatuses REST endpoints
(function () {
  'use strict';

  angular
    .module('paymentstatuses')
    .factory('PaymentstatusesService', PaymentstatusesService);

  PaymentstatusesService.$inject = ['$resource'];

  function PaymentstatusesService($resource) {
    return $resource('api/paymentstatuses/:paymentstatusId', {
      paymentstatusId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
