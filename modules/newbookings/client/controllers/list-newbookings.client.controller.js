(function () {
  'use strict';

  angular
    .module('newbookings')
    .controller('NewbookingsListController', NewbookingsListController);

  NewbookingsListController.$inject = ['NewbookingsService'];

  function NewbookingsListController(NewbookingsService) {
    var vm = this;

    vm.newbookings = NewbookingsService.query();
  }
}());
