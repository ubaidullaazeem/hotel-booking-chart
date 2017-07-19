(function() {
  'use strict';

  angular
    .module('core')
    .controller('SettingsController', SettingsController);

  SettingsController.$inject = ['COLOURS', 'DATA_BACKGROUND_COLOR', '$scope', '$state', '$rootScope', '$mdDialog', 'HallsService', 'Notification', 'EventtypesService', 'TaxesService', 'PaymentstatusesService'];

  function SettingsController(COLOURS, DATA_BACKGROUND_COLOR, $scope, $state, $rootScope, $mdDialog, HallsService, Notification, EventtypesService, TaxesService, PaymentstatusesService) 
  {
    
    $scope.DATA_BACKGROUND_COLOR = DATA_BACKGROUND_COLOR;
    
    $scope.loadInitial = function() {
      $scope.halls = HallsService.query();
      $scope.taxes = TaxesService.query();
      $scope.eventTypes = EventtypesService.query();
      $scope.paymentStatuses = PaymentstatusesService.query();
    };

    /** CRUD Functionality for Hall **/

    $scope.mShowHallPopup = function(ev, index = null, hall = null) {
      $mdDialog.show({
          controller: 'HallsController',
          templateUrl: 'modules/halls/client/views/form-hall.client.view.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: false,
          fullscreen: true,
          resolve: {
            hallResolve: function() {
              return hall;
            }
          },
        })
        .then(function(updatedItem) {
          if (hall) {
            $scope.halls[index] = updatedItem
          } else {
            $scope.halls.push(updatedItem);
          }
        }, function() {
          console.log('You cancelled the dialog.');          
        });
    }

    $scope.mDeleteHall = function(ev, index, hall) {
      var confirm = $mdDialog.confirm()
        .title('Do you want to delete the ' + hall.name + ' hall?')
        .textContent('Hall will be deleted permanently.')
        .targetEvent(ev)
        .ok('Yes')
        .cancel('No');

      $mdDialog.show(confirm).then(function() {
          hall.$remove(successCallback, errorCallback);

          function successCallback(res) {
           $scope.halls.splice(index, 1);
          }

          function errorCallback(res) {
            Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Delete Hall Error !!!' });
          }
        },
        function() {
          console.log("no");
        });
    }

     /** CRUD Functionality for Tax **/

    $scope.mShowTaxPopup = function(ev, index = null, tax = null) {
      $mdDialog.show({
          controller: 'TaxesController',
          templateUrl: 'modules/taxes/client/views/form-tax.client.view.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: false,
          fullscreen: true,
          resolve: {
            taxResolve: function() {
              return tax;
            }
          },
        })
        .then(function(updatedItem) {
          if(tax) {
            $scope.taxes[index] = updatedItem
          } else {
            $scope.taxes.push(updatedItem);
          }          
        }, function() {
          console.log('You cancelled the dialog.');          
        });

    }

     /** CRUD Functionality for EventType **/

    $scope.mShowEventTypePopup = function(ev, index = null, eventType = null) {
      var savedColors = _.map($scope.eventTypes, 'colour');
      var colours = [];
      var colors = _.map(COLOURS, function(o) {
        return _.pick(o, ['name', 'code']);
      });
      if (eventType) {
        var eventColors = _.reject(savedColors, function(savedColor) {
          return savedColor.name === eventType.colour.name;
        });
        colours = _.pullAllBy(colors, eventColors, 'name');
      } else {
        colours = _.pullAllBy(colors, savedColors, 'name');
      }

      $mdDialog.show({
          controller: 'EventtypesController',
          templateUrl: 'modules/eventtypes/client/views/form-eventtype.client.view.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: false,
          fullscreen: true,
          resolve: {
            eventtypeResolve: function() {
              return eventType;
            },
            colorsResolve: function() {
              return colours
            }
          },
        })
        .then(function(updatedItem) {
          if (eventType) {
            $scope.eventTypes[index] = updatedItem
          } else {
            $scope.eventTypes.push(updatedItem);
          }
        }, function() {
          console.log('You cancelled the dialog.');
        });

    }

    $scope.mDeleteEventType = function(ev, index, eventType) {
      var confirm = $mdDialog.confirm()
        .title('Do you want to delete "' + eventType.name + '"?')
        .textContent('Event type will be deleted permanently.')
        .targetEvent(ev)
        .ok('Yes')
        .cancel('No');

      $mdDialog.show(confirm).then(function() {
          eventType.$remove(successCallback, errorCallback);

          function successCallback(res) {
            $scope.eventTypes.splice(index, 1);
          }

          function errorCallback(res) {
            Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Delete Event Error !!!' });
          }
        },
        function() {
          console.log("no");
        });
    }

     /** CRUD Functionality for Payment status **/

    $scope.mShowPaymentStatusPopup = function(ev, index = null, paymentStatus = null) {

      var savedColors = _.map($scope.paymentStatuses, 'colour');
      var colours = [];
      var colors = _.map(COLOURS, function(o) {
        return _.pick(o, ['name', 'code']);
      });
      if (paymentStatus) {
        var paymentColors = _.reject(savedColors, function(savedColor) {
          return savedColor.name === paymentStatus.colour.name;
        });
        colours = _.pullAllBy(colors, paymentColors, 'name');
      } else {
        colours = _.pullAllBy(colors, savedColors, 'name');
      }

      $mdDialog.show({
          controller: 'PaymentstatusesController',
          templateUrl: 'modules/paymentstatuses/client/views/form-paymentstatus.client.view.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: false,
          fullscreen: true,
          resolve: {
            paymentstatusResolve: function() {
              return paymentStatus;
            },
            colorsResolve: function() {
              return colours
            }
          },
        })
        .then(function(updatedItem) {
          if (paymentStatus) {
            $scope.paymentStatuses[index] = updatedItem
          } else {
            $scope.paymentStatuses.push(updatedItem);
          }
        }, function() {
          console.log('You cancelled the dialog.');
        });
    }

    $scope.$on('$stateChangeSuccess', stateChangeSuccess);

    function stateChangeSuccess() {
      $scope.cancel();
    }

    $scope.cancel = function() {
      $mdDialog.cancel();
    };

  }


}());