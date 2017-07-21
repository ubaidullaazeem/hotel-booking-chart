(function () {
  'use strict';

  angular
    .module('core.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider', '$urlRouterProvider'];

  function routeConfig($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.rule(function ($injector, $location) {
      var path = $location.path();
      var hasTrailingSlash = path.length > 1 && path[path.length - 1] === '/';

      if (hasTrailingSlash) {
        // if last character is a slash, return the same url without the slash
        var newPath = path.substr(0, path.length - 1);
        $location.replace().path(newPath);
      }
    });

    // Redirect to 404 when route not found
    $urlRouterProvider.otherwise(function ($injector, $location) {
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
        }
      })
      .state('reports', {
        url: '/reports',
        templateUrl: '/modules/core/client/views/reports.client.view.html',
        controller: 'ReportsController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Reports'
        }
      })
      .state('tax', {
        url: '/tax',
        templateUrl: '/modules/core/client/views/settings/tax.client.view.html',
        controller: 'SettingsController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Taxes'
        }
      })
      .state('hall', {
        url: '/hall',
        templateUrl: '/modules/core/client/views/settings/hall.client.view.html',
        controller: 'SettingsController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Halls'
        }
      })
      .state('payment', {
        url: '/payment',
        templateUrl: '/modules/core/client/views/settings/payment.client.view.html',
        controller: 'SettingsController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Payments'
        }
      })
      .state('event', {
        url: '/event',
        templateUrl: '/modules/core/client/views/settings/event.client.view.html',
        controller: 'SettingsController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Events'
        }
      })
      /*.state('not-found', {
        url: '/not-found',
        templateUrl: '/modules/core/client/views/404.client.view.html',
        controller: 'ErrorController',
        controllerAs: 'vm',
        params: {
          message: function($stateParams) {
            return $stateParams.message;
          }
        },
        data: {
          ignoreState: true,
          pageTitle: 'Not Found'
        }
      })*/
      /*.state('bad-request', {
        url: '/bad-request',
        templateUrl: '/modules/core/client/views/400.client.view.html',
        controller: 'ErrorController',
        controllerAs: 'vm',
        params: {
          message: function($stateParams) {
            return $stateParams.message;
          }
        },
        data: {
          ignoreState: true,
          pageTitle: 'Bad Request'
        }
      })*/
      /*.state('forbidden', {
        url: '/forbidden',
        templateUrl: '/modules/core/client/views/403.client.view.html',
        data: {
          ignoreState: true,
          pageTitle: 'Forbidden'
        }
      })*/;
  }
}());