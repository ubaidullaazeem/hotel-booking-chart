(function () {
  'use strict';

  // Halls controller
  angular
    .module('halls')
    .controller('HallsController', HallsController);

  HallsController.$inject = ['DATA_BACKGROUND_COLOR', '$scope', '$state', '$rootScope', '$mdDialog', 'Notification', 'hallResolve', 'HallsService'];

  function HallsController (DATA_BACKGROUND_COLOR, $scope, $state, $rootScope, $mdDialog, Notification, hall, HallsService) 
  {   
    $scope.model = {
      hall: {
        name: hall ? hall.name : undefined,
        rate: hall ? hall.rate : undefined,
        _id: hall ? hall._id : undefined
      }
    };

    $scope.ui = {
      mNumberPattern: /^[0-9]*$/
    }

    $scope.DATA_BACKGROUND_COLOR = DATA_BACKGROUND_COLOR;
    
    $scope.save = function(hallForm)
    { 
      $scope.hallForm = hallForm;
      if (hallForm.$valid) 
      {     
        if ($scope.model.hall._id) 
        {
          HallsService.update($scope.model.hall, successCallback, errorCallback);          
        } 
        else 
        {
          HallsService.save($scope.model.hall, successCallback, errorCallback);          
        }        

        function successCallback(res) 
        {          
          $mdDialog.hide(res);
        }

        function errorCallback(res) 
        {          
          Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Create Hall Error !!!' });
        }
      }
    }

    $scope.cancel = function()
    {
      $mdDialog.cancel();
    }    
  }
}());
