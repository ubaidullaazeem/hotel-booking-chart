(function () {
  'use strict';

  // Eventtypes controller
  angular
    .module('eventtypes')
    .controller('EventtypesController', EventtypesController);

  EventtypesController.$inject = ['DATA_BACKGROUND_COLOR', '$scope', '$state', '$rootScope', '$window', '$mdDialog', 'Notification', 'eventtypeResolve', 'EventtypesService', 'COLOURS', 'colorsResolve'];

  function EventtypesController (DATA_BACKGROUND_COLOR, $scope, $state, $rootScope, $window, $mdDialog, Notification, eventtype, EventtypesService, COLOURS, colorsResolve) 
  {
    $scope.colours = colorsResolve;
    $scope.model = {
      eventType: {
        name: eventtype ? eventtype.name : undefined,
        colour: eventtype ? eventtype.colour : undefined,
        _id: eventtype ? eventtype._id : undefined
      }
    }

    $scope.DATA_BACKGROUND_COLOR = DATA_BACKGROUND_COLOR;

    if (eventtype) 
    { 
      $scope.model.eventType.colour = $scope.colours[_.findIndex($scope.colours, eventtype.colour)];
    }
    
    $scope.onEventTypeColourSelected = function()
    {
      console.log("eventType "+JSON.stringify($scope.model.eventType));
    }
    
    // Save Eventtype
    $scope.save = function(eventtypeForm) 
    {
      $scope.eventtypeForm = eventtypeForm;

      if (eventtypeForm.$valid) 
      { 
        if ($scope.model.eventType._id) 
        {
          EventtypesService.update($scope.model.eventType, successCallback, errorCallback);
        } 
        else 
        {
          EventtypesService.save($scope.model.eventType, successCallback, errorCallback);
        }

        function successCallback(res) 
        {
          $mdDialog.hide(res);
        }

        function errorCallback(res) 
        {
          Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Create Event Error !!!' });
        }
      }
    }

    $scope.cancel = function()
    {
      $mdDialog.cancel();
    }  
  }
}());
