(function () {
  'use strict';

  // Eventtypes controller
  angular
    .module('eventtypes')
    .controller('EventtypesController', EventtypesController);

  EventtypesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'eventtypeResolve'];

  function EventtypesController ($scope, $state, $window, Authentication, eventtype) {
    var vm = this;

    vm.authentication = Authentication;
    vm.eventtype = eventtype;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Eventtype
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.eventtype.$remove($state.go('eventtypes.list'));
      }
    }

    // Save Eventtype
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.eventtypeForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.eventtype._id) {
        vm.eventtype.$update(successCallback, errorCallback);
      } else {
        vm.eventtype.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('eventtypes.view', {
          eventtypeId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
