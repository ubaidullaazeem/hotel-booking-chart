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
      },
      getGraphicalReports: {
        method: 'POST',
        isArray: true,
        url: 'api/newbookings/searchgraphicalreports'
      },
      getBookingListReports: {
        method: 'POST',
        isArray: true,
        url: 'api/newbookings/searchbookinglistreports'
      }
    });

    angular.extend(SearchBooking, {
      requestsearch: function (halls) {
        return this.search(halls).$promise;
      },
      requestGraphicalSearchReports: function (searchParams) {
        return this.getGraphicalReports(searchParams).$promise;
      },
      requestBookingListSearchReports: function (searchParams) {
        return this.getBookingListReports(searchParams).$promise;
      }
    });

    return SearchBooking;
  }
}());
