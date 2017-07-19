// Newbookings service used to communicate Newbookings REST endpoints
(function () {
  'use strict';

  angular
    .module('newbookings')
    .factory('NewbookingsService', NewbookingsService);

  NewbookingsService.$inject = ['$resource'];

  function NewbookingsService($resource) {
    return $resource('api/newbookings/:newbookingId', {
      newbookingId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
