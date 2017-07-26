(function () {
  'use strict';

  angular
    .module('newbookings')
    .factory('ValidateOverlapBookingServices', ValidateOverlapBookingServices);

  ValidateOverlapBookingServices.$inject = ['$resource'];

  function ValidateOverlapBookingServices($resource) {
    var ValidateOverlapBooking = $resource('api/newbookings/', { newbookingId: '@_id' }, {
      update: {
        method: 'PUT'
      },
      search: {
        method: 'POST',
        isArray: true,
        url: 'api/newbookings/validateoverlap'
      }
    });

    angular.extend(ValidateOverlapBooking, {
      requestvalidateoverlap: function (bookings) {
        return this.search(bookings).$promise;
      }
    });

    return ValidateOverlapBooking;
  }
}());
