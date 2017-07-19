/*(function () {
  'use strict';

  angular
    .module('newbookings')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('newbookings', {
        abstract: true,
        url: '/newbookings',
        template: '<ui-view/>'
      })
      .state('newbookings.list', {
        url: '',
        templateUrl: 'modules/newbookings/client/views/list-newbookings.client.view.html',
        controller: 'NewbookingsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Newbookings List'
        }
      })
      .state('newbookings.create', {
        url: '/create',
        templateUrl: 'modules/newbookings/client/views/form-newbooking.client.view.html',
        controller: 'NewbookingsController',
        controllerAs: 'vm',
        resolve: {
          newbookingResolve: newNewbooking
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Newbookings Create'
        }
      })
      .state('newbookings.edit', {
        url: '/:newbookingId/edit',
        templateUrl: 'modules/newbookings/client/views/form-newbooking.client.view.html',
        controller: 'NewbookingsController',
        controllerAs: 'vm',
        resolve: {
          newbookingResolve: getNewbooking
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Newbooking {{ newbookingResolve.name }}'
        }
      })
      .state('newbookings.view', {
        url: '/:newbookingId',
        templateUrl: 'modules/newbookings/client/views/view-newbooking.client.view.html',
        controller: 'NewbookingsController',
        controllerAs: 'vm',
        resolve: {
          newbookingResolve: getNewbooking
        },
        data: {
          pageTitle: 'Newbooking {{ newbookingResolve.name }}'
        }
      });
  }

  getNewbooking.$inject = ['$stateParams', 'NewbookingsService'];

  function getNewbooking($stateParams, NewbookingsService) {
    return NewbookingsService.get({
      newbookingId: $stateParams.newbookingId
    }).$promise;
  }

  newNewbooking.$inject = ['NewbookingsService'];

  function newNewbooking(NewbookingsService) {
    return new NewbookingsService();
  }
}());
*/