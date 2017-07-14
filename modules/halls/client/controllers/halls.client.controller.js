(function () {
  'use strict';

  // Halls controller
  angular
    .module('halls')
    .controller('HallsController', HallsController);

  HallsController.$inject = ['$scope', '$state', '$rootScope', '$window', 'Authentication', '$mdDialog', '$mdToast', 'hallResolve'];

  function HallsController ($scope, $state, $rootScope, $window, Authentication, $mdDialog, $mdToast, hall) 
  {   
    $scope.hall = hall;
    $scope.mNumberPattern = /^[0-9]*$/;//only numbers    
    
    $scope.save = function(createHallForm)
    { 
      $scope.createHallForm = createHallForm;
      if (createHallForm.$valid) 
      {     
        if ($scope.hall._id) 
        {
          $scope.hall.$update(successCallback, errorCallback);
        } 
        else 
        {
          $scope.hall.$save(successCallback, errorCallback);
        }        

        function successCallback(res) 
        {          
          $scope.cancel();
          $rootScope.$broadcast('refreshHalls');//sending broadcast to update the settings page.
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
