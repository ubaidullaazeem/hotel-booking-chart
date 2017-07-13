(function () {
  'use strict';

  angular
    .module('halls')
    .controller('HallsListController', HallsListController);

  HallsListController.$inject = ['HallsService'];

  function HallsListController(HallsService) {
    var vm = this;

    vm.halls = HallsService.query();
  }
}());
