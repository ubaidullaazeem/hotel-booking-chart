(function () {
  'use strict';

  // Eventtypes controller
  angular
    .module('eventtypes')
    .controller('EventtypesController', EventtypesController);

  EventtypesController.$inject = ['$scope', '$state', '$rootScope', '$window', '$mdDialog', '$mdToast', 'eventtypeResolve', 'EventtypesService', 'COLOURS'];

  function EventtypesController ($scope, $state, $rootScope, $window, $mdDialog, $mdToast, eventtype, EventtypesService, COLOURS) 
  {
    $scope.colours = COLOURS;
    $scope.eventType = eventtype;

    if (eventtype.colour) 
    { 
      $scope.eventType.colour = $scope.colours[_.findIndex($scope.colours, eventtype.colour)];
    }
    
    $scope.onEventTypeColourSelected = function()
    {
      console.log("eventType "+JSON.stringify($scope.eventType));
    }
    
    // Save Eventtype
    $scope.save = function(eventtypeForm) 
    {
      $scope.eventtypeForm = eventtypeForm;
      $scope.submitted = true;

      if (eventtypeForm.$valid) 
      { 
        if ($scope.eventType._id) 
        {
          $scope.eventType.$update(successCallback, errorCallback);
        } 
        else 
        {
          //$scope.eventType.$save(successCallback, errorCallback);

          EventtypesService.save($scope.eventType, successCallback, errorCallback);
        }

        function successCallback(res) 
        {
          $scope.cancel();
          $rootScope.$broadcast('refreshEventsTypes');
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
