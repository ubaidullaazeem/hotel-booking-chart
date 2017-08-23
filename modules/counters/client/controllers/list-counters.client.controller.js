(function () {
  'use strict';

  angular
    .module('counters')
    .controller('CountersListController', CountersListController);

  CountersListController.$inject = ['CountersService'];

  function CountersListController(CountersService) {
    var vm = this;

    vm.counters = CountersService.query();
  }
}());
