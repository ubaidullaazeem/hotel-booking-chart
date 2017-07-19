(function () {
  'use strict';

  // Newbookings controller
  angular
    .module('newbookings')
    .controller('NewbookingsController', NewbookingsController);

  NewbookingsController.$inject = ['DATA_BACKGROUND_COLOR', '$scope', '$state', 'newbookingResolve', '$mdDialog', 'selectedDate', 'HallsService', 'EventtypesService', 'TaxesService', 'PaymentstatusesService'];

  function NewbookingsController (DATA_BACKGROUND_COLOR, $scope, $state, newbooking, $mdDialog, selectedDate, HallsService, EventtypesService, TaxesService, PaymentstatusesService) 
  {
    $scope.DATA_BACKGROUND_COLOR = DATA_BACKGROUND_COLOR;    

    $scope.ui = {
      mSelectedDateToDisplay : selectedDate.format('DD-MMMM-YYYY')
    }

    $scope.model = {
                    halls : HallsService.query(),
                    eventTypes : EventtypesService.query(),
                    taxes : TaxesService.query(),
                    paymentStatuses : PaymentstatusesService.query()
                  };

    $scope.getOtherEvents = function() {
      var events = _.filter($scope.model.eventTypes, function(eventType) {
        return eventType.name === 'others';
      });
      return events[0];
    };


    //$scope.mSelectedDate = selectedDate;

    // Save Newbooking
    function save(isValid) 
    {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.newbookingForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.newbooking._id) {
        vm.newbooking.$update(successCallback, errorCallback);
      } else {
        vm.newbooking.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('newbookings.view', {
          newbookingId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }

    $scope.cancel = function()
    {
      $mdDialog.cancel();
    }  
  }
}());
