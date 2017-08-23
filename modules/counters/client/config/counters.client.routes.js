/*  (function () {
  'use strict';

  angular
    .module('counters')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('counters', {
        abstract: true,
        url: '/counters',
        template: '<ui-view/>'
      })
      .state('counters.list', {
        url: '',
        templateUrl: 'modules/counters/client/views/list-counters.client.view.html',
        controller: 'CountersListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Counters List'
        }
      })
      .state('counters.create', {
        url: '/create',
        templateUrl: 'modules/counters/client/views/form-counter.client.view.html',
        controller: 'CountersController',
        controllerAs: 'vm',
        resolve: {
          counterResolve: newCounter
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Counters Create'
        }
      })
      .state('counters.edit', {
        url: '/:counterId/edit',
        templateUrl: 'modules/counters/client/views/form-counter.client.view.html',
        controller: 'CountersController',
        controllerAs: 'vm',
        resolve: {
          counterResolve: getCounter
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Counter {{ counterResolve.name }}'
        }
      })
      .state('counters.view', {
        url: '/:counterId',
        templateUrl: 'modules/counters/client/views/view-counter.client.view.html',
        controller: 'CountersController',
        controllerAs: 'vm',
        resolve: {
          counterResolve: getCounter
        },
        data: {
          pageTitle: 'Counter {{ counterResolve.name }}'
        }
      });
  }

  getCounter.$inject = ['$stateParams', 'CountersService'];

  function getCounter($stateParams, CountersService) {
    return CountersService.get({
      counterId: $stateParams.counterId
    }).$promise;
  }

  newCounter.$inject = ['CountersService'];

  function newCounter(CountersService) {
    return new CountersService();
  }
}());
*/
