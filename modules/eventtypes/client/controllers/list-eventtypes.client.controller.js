(function () {
  'use strict';

  angular
    .module('eventtypes')
    .controller('EventtypesListController', EventtypesListController);

  EventtypesListController.$inject = ['EventtypesService'];

  function EventtypesListController(EventtypesService) {
    var vm = this;

    vm.eventtypes = EventtypesService.query();
  }
}());
