/*(function () {
  'use strict';

  angular
    .module('eventtypes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('eventtypes', {
        abstract: true,
        url: '/eventtypes',
        template: '<ui-view/>'
      })
      .state('eventtypes.list', {
        url: '',
        templateUrl: 'modules/eventtypes/client/views/list-eventtypes.client.view.html',
        controller: 'EventtypesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Eventtypes List'
        }
      })
      .state('eventtypes.create', {
        url: '/create',
        templateUrl: 'modules/eventtypes/client/views/form-eventtype.client.view.html',
        controller: 'EventtypesController',
        controllerAs: 'vm',
        resolve: {
          eventtypeResolve: newEventtype
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Eventtypes Create'
        }
      })
      .state('eventtypes.edit', {
        url: '/:eventtypeId/edit',
        templateUrl: 'modules/eventtypes/client/views/form-eventtype.client.view.html',
        controller: 'EventtypesController',
        controllerAs: 'vm',
        resolve: {
          eventtypeResolve: getEventtype
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Eventtype {{ eventtypeResolve.name }}'
        }
      })
      .state('eventtypes.view', {
        url: '/:eventtypeId',
        templateUrl: 'modules/eventtypes/client/views/view-eventtype.client.view.html',
        controller: 'EventtypesController',
        controllerAs: 'vm',
        resolve: {
          eventtypeResolve: getEventtype
        },
        data: {
          pageTitle: 'Eventtype {{ eventtypeResolve.name }}'
        }
      });
  }

  getEventtype.$inject = ['$stateParams', 'EventtypesService'];

  function getEventtype($stateParams, EventtypesService) {
    return EventtypesService.get({
      eventtypeId: $stateParams.eventtypeId
    }).$promise;
  }

  newEventtype.$inject = ['EventtypesService'];

  function newEventtype(EventtypesService) {
    return new EventtypesService();
  }
}());
*/