(function () {
  'use strict';

  angular
    .module('halls')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('halls', {
        abstract: true,
        url: '/halls',
        template: '<ui-view/>'
      })
      .state('halls.list', {
        url: '',
        templateUrl: 'modules/halls/client/views/list-halls.client.view.html',
        controller: 'HallsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Halls List'
        }
      })
      .state('halls.create', {
        url: '/create',
        templateUrl: 'modules/halls/client/views/form-hall.client.view.html',
        controller: 'HallsController',
        controllerAs: 'vm',
        resolve: {
          hallResolve: newHall
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Halls Create'
        }
      })
      .state('halls.edit', {
        url: '/:hallId/edit',
        templateUrl: 'modules/halls/client/views/form-hall.client.view.html',
        controller: 'HallsController',
        controllerAs: 'vm',
        resolve: {
          hallResolve: getHall
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Hall {{ hallResolve.name }}'
        }
      })
      .state('halls.view', {
        url: '/:hallId',
        templateUrl: 'modules/halls/client/views/view-hall.client.view.html',
        controller: 'HallsController',
        controllerAs: 'vm',
        resolve: {
          hallResolve: getHall
        },
        data: {
          pageTitle: 'Hall {{ hallResolve.name }}'
        }
      });
  }

  getHall.$inject = ['$stateParams', 'HallsService'];

  function getHall($stateParams, HallsService) {
    return HallsService.get({
      hallId: $stateParams.hallId
    }).$promise;
  }

  newHall.$inject = ['HallsService'];

  function newHall(HallsService) {
    return new HallsService();
  }
}());
