(function () {
  'use strict';

  // Paymentstatuses controller
  angular
    .module('paymentstatuses')
    .controller('PaymentstatusesController', PaymentstatusesController);

  PaymentstatusesController.$inject = ['DATA_BACKGROUND_COLOR', '$scope', '$state', 'paymentstatusResolve', '$mdDialog', '$mdToast', 'PaymentstatusesService', 'colorsResolve'];

  function PaymentstatusesController (DATA_BACKGROUND_COLOR, $scope, $state, paymentstatus, $mdDialog, $mdToast, PaymentstatusesService, colorsResolve) 
  {
    $scope.colours = colorsResolve;
    $scope.model = {
      paymentStatus: {
        name: paymentstatus ? paymentstatus.name : undefined,
        colour: paymentstatus ? paymentstatus.colour : undefined,
        _id: paymentstatus ? paymentstatus._id : undefined
      }
    }

    $scope.DATA_BACKGROUND_COLOR = DATA_BACKGROUND_COLOR;

    if (paymentstatus) 
    { 
      $scope.model.paymentStatus.colour = $scope.colours[_.findIndex($scope.colours, paymentstatus.colour)];
    }
        
    // Save Paymentstatus
    $scope.save =  function(paymentStatusForm) 
    {      
      $scope.submitted = true;

      if (paymentStatusForm.$valid) 
      { 
        if ($scope.model.paymentStatus._id) 
        {
          PaymentstatusesService.update($scope.model.paymentStatus, successCallback, errorCallback);
        }
        else 
        {
          PaymentstatusesService.save($scope.model.paymentStatus, successCallback, errorCallback);
        }

        function successCallback(res) 
        {
          $mdDialog.hide(res);
        }

        function errorCallback(res) 
        {
          $mdToast.show($mdToast.simple().textContent(res.data.message).position('bottom right').hideDelay(3000));
        }
      }      
    }

    $scope.cancel = function()
    {
      $mdDialog.cancel();
    }   
  }
}());
