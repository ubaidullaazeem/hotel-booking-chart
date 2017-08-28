(function() {
  'use strict';

  // Eventtypes controller
  angular
    .module('eventtypes')
    .controller('EventtypesController', EventtypesController);

  EventtypesController.$inject = ['DATA_BACKGROUND_COLOR', '$scope', '$state', '$rootScope', '$window', '$mdDialog', 'Notification', 'eventtypeResolve', 'otherEventTypesResolve', 'EventtypesService', 'COLOURS', 'colorsResolve', 'HARDCODE_VALUES'];

  function EventtypesController(DATA_BACKGROUND_COLOR, $scope, $state, $rootScope, $window, $mdDialog, Notification, eventtype, otherEventTypesResolve, EventtypesService, COLOURS, colorsResolve, HARDCODE_VALUES) {
    $scope.colours = colorsResolve;
    $scope.model = {
      eventType: {
        name: eventtype ? eventtype.name : undefined,
        displayName: eventtype ? eventtype.displayName : undefined,
        colour: eventtype ? eventtype.colour : undefined,
        _id: eventtype ? eventtype._id : undefined
      }
    };

    $scope.DATA_BACKGROUND_COLOR = DATA_BACKGROUND_COLOR;
    $scope.HARDCODE_VALUES = HARDCODE_VALUES;

    $scope.$watch('model.eventType.displayName', function() {
      $scope.model.eventType.name = $scope.model.eventType.displayName;
    }, true);

    if (eventtype) {
      $scope.model.eventType.colour = $scope.colours[_.findIndex($scope.colours, eventtype.colour)];
    }

    $scope.onEventTypeColourSelected = function() {
      console.log('eventType ' + JSON.stringify($scope.model.eventType));
    };

    // Save Eventtype
    $scope.save = function(eventtypeForm) {
      $scope.eventtypeForm = eventtypeForm;

      if (eventtypeForm.$valid) {
        if (_.includes(otherEventTypesResolve, $scope.model.eventType.name.toLowerCase().trim())) {
          Notification.error({
            message: 'Name already exists',
            title: '<i class="glyphicon glyphicon-remove"></i> Create Event Error'
          });

          return;
        }

        if ($scope.model.eventType._id) {
          EventtypesService.update($scope.model.eventType, successCallback, errorCallback);
        } else {
          EventtypesService.save($scope.model.eventType, successCallback, errorCallback);
        }

        function successCallback(res) {
          $mdDialog.hide(res);
        }

        function errorCallback(res) {
          Notification.error({
            message: res.data.message,
            title: '<i class="glyphicon glyphicon-remove"></i> Create Event Error'
          });
        }
      }
    };

    $scope.cancel = function() {
      $mdDialog.cancel();
    };
  }
}());
