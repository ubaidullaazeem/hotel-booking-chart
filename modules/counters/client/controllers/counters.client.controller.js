(function () {
  'use strict';

  // Counters controller
  angular
    .module('counters')
    .controller('CountersController', CountersController);

  CountersController.$inject = ['$scope', '$state', '$window', 'DATA_BACKGROUND_COLOR', '$mdDialog', 'CountersService', 'RECEIPT', 'INVOICE', 'Notification', '$mdpDatePicker', 'counter', 'countersResolve'];

  function CountersController ($scope, $state, $window, DATA_BACKGROUND_COLOR, $mdDialog, CountersService, RECEIPT, INVOICE, Notification, $mdpDatePicker, counter, countersResolve) {
    
    $scope.DATA_BACKGROUND_COLOR = DATA_BACKGROUND_COLOR;

    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    $scope.ui = {
      mNumberPattern: /^[0-9]*$/,
      isInvoice: counter == null ? (countersResolve.length === 0 ? false : true) : (counter.counterName === INVOICE ? true : false),
      isPastEffectiveDate: true
    };
        
    $scope.model = {
      counter: {
        _id: counter ? counter._id : undefined,
        counterName: $scope.ui.isInvoice ? INVOICE : RECEIPT,
        seq: counter ? counter.seq : null,
        effectiveDate: counter ? dateConvertion(counter.effectiveDate) : dateConvertion(tomorrow.setHours(0, 0, 0, 0))
      }
    };

    $scope.ui.isPastEffectiveDate = (moment($scope.model.counter.effectiveDate) <= moment(new Date().setHours(0, 0, 0, 0))) ? true : false;
        
    $scope.showStartDatePicker = function(ev) {
      var today = new Date();
      today.setDate(today.getDate() - 1);
      $mdpDatePicker(new Date($scope.model.counter.effectiveDate), {
        targetEvent: ev,
        minDate: today
      })
        .then(function(dateTime) {
          $scope.model.counter.effectiveDate = dateConvertion(dateTime);
        });
    };    
    
    // Save counter
    $scope.save = function(isValid) {
      if (!isValid) {
        return;
      }

      if ($scope.model.counter._id) {
        CountersService.update($scope.model.counter, successCallback, errorCallback);
      } else {
        CountersService.save($scope.model.counter, successCallback, errorCallback);
      }

      function successCallback(res) {
        $mdDialog.hide(res);
      }

      function errorCallback(res) {
        Notification.error({
          message: res.data.message,
          title: '<i class="glyphicon glyphicon-remove"></i> Error'
        });
      }
    }

    $scope.cancel = function() {
      $mdDialog.cancel();
    };

    function dateConvertion(date) {
      return moment(date).format('DD, MMM YYYY');
    }
  }
}());
