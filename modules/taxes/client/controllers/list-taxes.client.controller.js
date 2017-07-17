(function () {
  'use strict';

  angular
    .module('taxes')
    .controller('TaxesListController', TaxesListController);

  TaxesListController.$inject = ['TaxesService'];

  function TaxesListController(TaxesService) {
    var vm = this;

    vm.taxes = TaxesService.query();
  }
}());
