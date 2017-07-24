(function () {
  'use strict';

  angular
    .module('newbookings')
    .factory('SearchBookingServices', SearchBookingServices);

  SearchBookingServices.$inject = ['$resource'];

  function SearchBookingServices($resource) {
    var SearchBooking = $resource('api/newbookings/', { newbookingId: '@_id' }, {
      update: {
        method: 'PUT'
      },
      search: {
        method: 'POST',
        isArray: true,
        url: 'api/newbookings/search'
      }
    });

    angular.extend(SearchBooking, {
      requestsearch: function (halls) {
        return this.search(halls).$promise;
      }
    });

    return SearchBooking;
  }
}());
