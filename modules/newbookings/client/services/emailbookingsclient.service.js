(function () {
  'use strict';

  angular
    .module('newbookings')
    .factory('EmailBookingServices', EmailBookingServices);

  EmailBookingServices.$inject = ['$resource'];

  function EmailBookingServices($resource) {
    var EmailBooking = $resource('api/newbookings/', { newbookingId: '@_id' }, {
      update: {
        method: 'PUT'
      },
      sendMail: {
        method: 'POST',
        url: 'api/newbookings/sendmail'
      }
    });

    angular.extend(EmailBooking, {
      requestSendEmail: function (content) {
        return this.sendMail(content).$promise;
      }
    });

    return EmailBooking;
  }
}());
