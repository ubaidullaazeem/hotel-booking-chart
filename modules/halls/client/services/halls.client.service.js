// Halls service used to communicate Halls REST endpoints
(function () {
  'use strict';

  angular
    .module('halls')
    .factory('HallsService', HallsService);

  HallsService.$inject = ['$resource'];

  function HallsService($resource) {
    return $resource('api/halls/:hallId', {
      hallId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
