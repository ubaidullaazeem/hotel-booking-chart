(function () {
  'use strict';

  // Halls controller
  angular
    .module('halls')
    .controller('HallsController', HallsController);

  HallsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'hallResolve'];

  function HallsController ($scope, $state, $window, Authentication, hall) {
    var vm = this;

    vm.authentication = Authentication;
    vm.hall = hall;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Hall
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.hall.$remove($state.go('halls.list'));
      }
    }

    // Save Hall
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.hallForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.hall._id) {
        vm.hall.$update(successCallback, errorCallback);
      } else {
        vm.hall.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('halls.view', {
          hallId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
