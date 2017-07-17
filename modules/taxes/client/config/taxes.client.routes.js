(function () {
  'use strict';

  angular
    .module('taxes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('taxes', {
        abstract: true,
        url: '/taxes',
        template: '<ui-view/>'
      })
      .state('taxes.list', {
        url: '',
        templateUrl: 'modules/taxes/client/views/list-taxes.client.view.html',
        controller: 'TaxesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Taxes List'
        }
      })
      .state('taxes.create', {
        url: '/create',
        templateUrl: 'modules/taxes/client/views/form-tax.client.view.html',
        controller: 'TaxesController',
        controllerAs: 'vm',
        resolve: {
          taxResolve: newTax
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Taxes Create'
        }
      })
      .state('taxes.edit', {
        url: '/:taxId/edit',
        templateUrl: 'modules/taxes/client/views/form-tax.client.view.html',
        controller: 'TaxesController',
        controllerAs: 'vm',
        resolve: {
          taxResolve: getTax
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Tax {{ taxResolve.name }}'
        }
      })
      .state('taxes.view', {
        url: '/:taxId',
        templateUrl: 'modules/taxes/client/views/view-tax.client.view.html',
        controller: 'TaxesController',
        controllerAs: 'vm',
        resolve: {
          taxResolve: getTax
        },
        data: {
          pageTitle: 'Tax {{ taxResolve.name }}'
        }
      });
  }

  getTax.$inject = ['$stateParams', 'TaxesService'];

  function getTax($stateParams, TaxesService) {
    return TaxesService.get({
      taxId: $stateParams.taxId
    }).$promise;
  }

  newTax.$inject = ['TaxesService'];

  function newTax(TaxesService) {
    return new TaxesService();
  }
}());
