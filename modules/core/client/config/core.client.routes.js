(function() {
  'use strict';

  angular
    .module('core.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider', '$urlRouterProvider'];

  function routeConfig($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.rule(function($injector, $location) {
      var path = $location.path();
      var hasTrailingSlash = path.length > 1 && path[path.length - 1] === '/';

      if (hasTrailingSlash) {
        // if last character is a slash, return the same url without the slash
        var newPath = path.substr(0, path.length - 1);
        $location.replace().path(newPath);
      }
    });

    // Redirect to 404 when route not found
    $urlRouterProvider.otherwise(function($injector, $location) {
      $injector.get('$state').transitionTo('not-found', null, {
        location: false
      });
    });

    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: '/modules/core/client/views/login.client.view.html',
        controller: 'LoginController',
        controllerAs: 'vm'
      })
      .state('bookings', {
        url: '/bookings',
        templateUrl: '/modules/core/client/views/bookings.client.view.html',
        controller: 'BookingsController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Bookings'
        },
        resolve: {
          bookedHallsResolve: bookedHallData,
          eventTypesResolve: eventTypesData,
          paymentStatusesResolve: paymentStatusesData,
          taxesResolve: taxesData,
          hallsResolve: hallsData,
          counterResolve: counterData
        }
      })
      .state('reports', {
        url: '/reports',
        templateUrl: '/modules/core/client/views/reports.new.client.view.html',
        controller: 'ReportsControllerNew',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Reports'
        },
        resolve: {
          hallsResolve: hallsData
        }
      })
      .state('graphreports', {
        url: '/graphreports',
        templateUrl: '/modules/core/client/views/reports.client.view.html',
        controller: 'ReportsController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Reports'
        },
        resolve: {
          hallsResolve: hallsData
        }
      })
      .state('tax', {
        url: '/tax',
        templateUrl: '/modules/core/client/views/settings/tax.client.view.html',
        controller: 'SettingsController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'CGST/SGST Tax'
        }
      })
      .state('hall', {
        url: '/hall',
        templateUrl: '/modules/core/client/views/settings/hall.client.view.html',
        controller: 'SettingsController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Hall Management'
        }
      })
      .state('payment', {
        url: '/payment',
        templateUrl: '/modules/core/client/views/settings/payment.client.view.html',
        controller: 'SettingsController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Payment Colors'
        }
      })
      .state('event', {
        url: '/event',
        templateUrl: '/modules/core/client/views/settings/event.client.view.html',
        controller: 'SettingsController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Event Name'
        }
      })
      .state('receiptInvoice', {
        url: '/receiptInvoice',
        templateUrl: '/modules/core/client/views/settings/receipt.invoice.number.client.view.html',
        controller: 'SettingsController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Receipt/Invoice Number'
        }
      });


    bookedHallData.$inject = ['NewbookingsService'];

    function bookedHallData(NewbookingsService) {
      return NewbookingsService.query();
    }

    eventTypesData.$inject = ['EventtypesService'];

    function eventTypesData(EventtypesService) {
      return EventtypesService.query();
    }

    paymentStatusesData.$inject = ['PaymentstatusesService'];

    function paymentStatusesData(PaymentstatusesService) {
      return PaymentstatusesService.query();
    }

    taxesData.$inject = ['TaxesService'];

    function taxesData(TaxesService) {
      return TaxesService.query();
    }

    hallsData.$inject = ['HallsService'];

    function hallsData(HallsService) {
      return HallsService.query();
    }

    counterData.$inject = ['CountersService'];

    function counterData(CountersService) {
      return CountersService.query();
    }
  }
}());
