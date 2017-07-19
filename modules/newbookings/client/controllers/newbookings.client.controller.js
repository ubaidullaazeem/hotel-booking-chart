(function() {
  'use strict';

  // Newbookings controller
  angular
    .module('newbookings')
    .controller('NewbookingsController', NewbookingsController);

  NewbookingsController.$inject = ['DATA_BACKGROUND_COLOR', '$scope', '$state', 'newbookingResolve', '$mdDialog', 'selectedDate', 'HallsService', 'EventtypesService', 'TaxesService', 'PaymentstatusesService'];

  function NewbookingsController(DATA_BACKGROUND_COLOR, $scope, $state, newbooking, $mdDialog, selectedDate, HallsService, EventtypesService, TaxesService, PaymentstatusesService) {
    $scope.DATA_BACKGROUND_COLOR = DATA_BACKGROUND_COLOR;

    $scope.ui = {
      mSelectedDateToDisplay: selectedDate.format('DD-MMMM-YYYY'),
    }

    $scope.model = {
      halls: HallsService.query(),
      eventTypes: EventtypesService.query(),
      taxes: TaxesService.query(),
      paymentStatuses: PaymentstatusesService.query(),
      paymentModes: ['None', 'Cheque', 'DD', 'Cash', 'NEFT']
    };

    $scope.eventTime = {
      mStartClock: new Date('1991-05-04T06:00:00'),
      mEndClock: new Date('1991-05-04T13:00:00'),
      mStartToDisplay: getTimeToDisplay(new Date('1991-05-04T06:00:00')),
      mEndToDisplay: getTimeToDisplay(new Date('1991-05-04T13:00:00')),
      mStartToServer: getTimeToServer(new Date('1991-05-04T06:00:00')),
      mEndToServer: getTimeToServer(new Date('1991-05-04T13:00:00'))
    };

    $scope.getOtherEvents = function() {
      var events = _.filter($scope.model.eventTypes, function(eventType) {
        return eventType.name === 'others';
      });
      return events[0];
    };

    $scope.showStartTimePicker = function(ev) 
    {
      $mdpTimePicker($scope.eventTime.mStartClock, 
      {targetEvent: ev
      })
      .then(function(dateTime) 
      {
        $scope.eventTime.mStartClock = dateTime;
        $scope.eventTime.mStartToDisplay = getTimeToDisplay(dateTime);
        $scope.eventTime.mStartToServer = getTimeToServer(dateTime);

        validateStartAndEndTime();
      });
    }  

    $scope.showEndTimePicker = function(ev) 
    {
      $mdpTimePicker($scope.eventTime.mEndClock, 
      {targetEvent: ev
      })
      .then(function(dateTime) 
      {
        $scope.eventTime.mEndClock = dateTime;
        $scope.eventTime.mEndToDisplay = getTimeToDisplay(dateTime);
        $scope.eventTime.mEndToServer = getTimeToServer(dateTime);

        validateStartAndEndTime();
      });
    }  

    function validateStartAndEndTime()
    {
      if ($scope.userForm) 
        {        
          var bool = (Date.parse($scope.eventTime.mEndToServer) > Date.parse($scope.eventTime.mStartToServer));
          $scope.userForm.end.$setValidity("greater", bool);
          $scope.userForm.start.$setValidity("lesser", bool);
        }
    }

    function getTimeToDisplay(date)
    {
      return moment(date).format('hh:mm:a');
    }

    function getTimeToServer(date)
    {
      var dt = (new Date(selectedDate)).setHours(date.getHours(),date.getMinutes(),0,0);
      var dtGMT = new Date((new Date(dt)).toUTCString()).toISOString();

      return dtGMT;
    }

    // Save Newbooking
    function save(isValid) {
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

    $scope.cancel = function() {
      $mdDialog.cancel();
    }
  }
}());