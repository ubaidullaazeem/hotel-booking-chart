// Counters service used to communicate Counters REST endpoints
(function () {
  'use strict';

  angular
    .module('counters')
    .factory('CountersService', CountersService);

  CountersService.$inject = ['$resource'];

  function CountersService($resource) {
    return $resource('api/counters/:counterId', {
      counterId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
