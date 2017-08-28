(function () {
  'use strict';

  // Counters controller
  angular
    .module('counters')
    .controller('CountersController', CountersController);

  CountersController.$inject = ['$scope', '$state', '$window', 'DATA_BACKGROUND_COLOR', '$mdDialog', 'isInvoice', 'CountersService', 'RECEIPT', 'INVOICE', 'Notification'];

  function CountersController ($scope, $state, $window, DATA_BACKGROUND_COLOR, $mdDialog, isInvoice, CountersService, RECEIPT, INVOICE, Notification) {
    var vm = this;

    $scope.DATA_BACKGROUND_COLOR = DATA_BACKGROUND_COLOR;

    $scope.ui = {
      mNumberPattern: /^[0-9]*$/,
      isInvoice: isInvoice
    };

    console.log(isInvoice);

    $scope.model = {
      counterName : isInvoice ? INVOICE : RECEIPT,
      seq : ''
    };
    
    
    // Save Counter
    $scope.save = function(isValid) {
      if (!isValid) {
        return;
      }

      if ($scope.ui.isInvoice) {
        CountersService.save($scope.model, successCallback, errorCallback);
      } else {
        CountersService.save($scope.model, successCallback, errorCallback);
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
  }
}());
