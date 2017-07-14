// Eventtypes service used to communicate Eventtypes REST endpoints
(function () {
  'use strict';

  angular
    .module('eventtypes')
    .factory('EventtypesService', EventtypesService);

  EventtypesService.$inject = ['$resource'];

  function EventtypesService($resource) {
    return $resource('api/eventtypes/:eventtypeId', {
      eventtypeId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
