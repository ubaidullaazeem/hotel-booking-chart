/*  (function () {
  'use strict';

  angular
    .module('paymentstatuses')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('paymentstatuses', {
        abstract: true,
        url: '/paymentstatuses',
        template: '<ui-view/>'
      })
      .state('paymentstatuses.list', {
        url: '',
        templateUrl: 'modules/paymentstatuses/client/views/list-paymentstatuses.client.view.html',
        controller: 'PaymentstatusesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Paymentstatuses List'
        }
      })
      .state('paymentstatuses.create', {
        url: '/create',
        templateUrl: 'modules/paymentstatuses/client/views/form-paymentstatus.client.view.html',
        controller: 'PaymentstatusesController',
        controllerAs: 'vm',
        resolve: {
          paymentstatusResolve: newPaymentstatus
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Paymentstatuses Create'
        }
      })
      .state('paymentstatuses.edit', {
        url: '/:paymentstatusId/edit',
        templateUrl: 'modules/paymentstatuses/client/views/form-paymentstatus.client.view.html',
        controller: 'PaymentstatusesController',
        controllerAs: 'vm',
        resolve: {
          paymentstatusResolve: getPaymentstatus
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Paymentstatus {{ paymentstatusResolve.name }}'
        }
      })
      .state('paymentstatuses.view', {
        url: '/:paymentstatusId',
        templateUrl: 'modules/paymentstatuses/client/views/view-paymentstatus.client.view.html',
        controller: 'PaymentstatusesController',
        controllerAs: 'vm',
        resolve: {
          paymentstatusResolve: getPaymentstatus
        },
        data: {
          pageTitle: 'Paymentstatus {{ paymentstatusResolve.name }}'
        }
      });
  }

  getPaymentstatus.$inject = ['$stateParams', 'PaymentstatusesService'];

  function getPaymentstatus($stateParams, PaymentstatusesService) {
    return PaymentstatusesService.get({
      paymentstatusId: $stateParams.paymentstatusId
    }).$promise;
  }

  newPaymentstatus.$inject = ['PaymentstatusesService'];

  function newPaymentstatus(PaymentstatusesService) {
    return new PaymentstatusesService();
  }
}());
*/
