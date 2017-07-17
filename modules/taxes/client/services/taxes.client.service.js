// Taxes service used to communicate Taxes REST endpoints
(function () {
  'use strict';

  angular
    .module('taxes')
    .factory('TaxesService', TaxesService);

  TaxesService.$inject = ['$resource'];

  function TaxesService($resource) {
    return $resource('api/taxes/:taxId', {
      taxId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
