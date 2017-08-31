(function() {
  'use strict';

  angular
    .module('core')
    .controller('SettingsController', SettingsController);

  SettingsController.$inject = ['COLOURS', 'CommonService', 'DATA_BACKGROUND_COLOR', '$scope', '$state', '$rootScope', '$mdDialog', 'HallsService', 'Notification', 'EventtypesService', 'TaxesService', 'PaymentstatusesService', 'CountersService', 'PAYMENT_STATUS', 'TAX_TYPES', 'INVOICE'];

  function SettingsController(COLOURS, CommonService, DATA_BACKGROUND_COLOR, $scope, $state, $rootScope, $mdDialog, HallsService, Notification, EventtypesService, TaxesService, PaymentstatusesService, CountersService, PAYMENT_STATUS, TAX_TYPES, INVOICE) {

    $scope.DATA_BACKGROUND_COLOR = DATA_BACKGROUND_COLOR;

    $scope.loadInitial = function() {
      $scope.halls = HallsService.query();
      $scope.taxes = TaxesService.query();
      $scope.eventTypes = EventtypesService.query();
      $scope.paymentStatuses = PaymentstatusesService.query();
      $scope.counters = CountersService.query();
    };

    /** CRUD Functionality for Hall **/

    $scope.mShowHallPopup = function(ev, index = null, hall = null) {
      var oldShow = $mdDialog.show;
      $mdDialog.show = function(options) {
        if (options.hasOwnProperty("skipHide")) {
          options.multiple = options.skipHide;
        }
        return oldShow(options);
      };
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
            },
            otherHallsResolve: function() {
              var allHallnames = _.map($scope.halls, 'name');
              var otherHalls;
              if (hall) {
                otherHalls = _.filter(allHallnames, function(obj) {
                  return obj !== hall.name;
                });
              } else {
                otherHalls = allHallnames;
              }
              return otherHalls;
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
        .title('Do you want to delete the "' + hall.displayName + '" hall?')
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
            Notification.error({
              message: res.data.message,
              title: '<i class="glyphicon glyphicon-remove"></i> Delete Hall Error'
            });
          }
        },
        function() {
          console.log("no");
        });
    }

    /** CRUD Functionality for Tax **/

    $scope.mShowTaxPopup = function(ev, index = null, tax = null) {
      var taxTypes = TAX_TYPES;
      var savedTaxTypes = _.map($scope.taxes, 'name');
      if (!tax) {
        taxTypes = _.pullAll(TAX_TYPES, savedTaxTypes);
      }
      var oldShow = $mdDialog.show;
      $mdDialog.show = function(options) {
        if (options.hasOwnProperty("skipHide")) {
          options.multiple = options.skipHide;
        }
        return oldShow(options);
      };
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
            },
            taxTypeResolve: function() {
              return taxTypes;
            }
          },
        })
        .then(function(updatedItem) {
          if (tax) {
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
            },
            otherEventTypesResolve: function() {
              var allEventTypeNames = _.map($scope.eventTypes, 'name');
              var otherEventTypes;
              if (eventType) {
                otherEventTypes = _.filter(allEventTypeNames, function(obj) {
                  return obj !== eventType.name;
                });
              } else {
                otherEventTypes = allEventTypeNames;
              }
              return otherEventTypes;
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
        .title('Do you want to delete "' + eventType.displayName + '"?')
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
            Notification.error({
              message: res.data.message,
              title: '<i class="glyphicon glyphicon-remove"></i> Delete Event Error'
            });
          }
        },
        function() {
          console.log("no");
        });
    }

    /** CRUD Functionality for Payment status **/

    $scope.mShowPaymentStatusPopup = function(ev, index = null, paymentStatus = null) {

      var savedColors = _.map($scope.paymentStatuses, 'colour');
      var savedPaymentTypes = _.map($scope.paymentStatuses, 'name');
      var colours = [];
      var paymentTypes = PAYMENT_STATUS;
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
        paymentTypes = _.pullAll(PAYMENT_STATUS, savedPaymentTypes);
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
            },
            paymentTypesResolve: function() {
              return paymentTypes;
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

    $scope.viewHallSummaries = function(ev, index, hall, isHallRate) {
      HallsService.get({
        hallId: hall._id
      }, function(data) {
        commonViewSummariesDialog(ev, index, data, isHallRate);
      });
    };

    $scope.viewTaxSummaries = function(ev, index, tax, isHallRate) {
      TaxesService.get({
        taxId: tax._id
      }, function(data) {
        commonViewSummariesDialog(ev, index, data, isHallRate);
      });
    };

    $scope.findRateSummariesByDate = function(hall) {
      var date = new Date();
      var summaries = CommonService.findRateSummariesByDate(hall.rateSummaries, date);
      hall.rate = summaries[0].rate;
      hall.powerConsumpationCharges = summaries[0].powerConsumpationCharges;
      hall.cleaningCharges = summaries[0].cleaningCharges;
      hall.CGSTTax = summaries[0].CGSTTax;
      hall.SGSTTax = summaries[0].SGSTTax;
      hall.effectiveDate = summaries[0].effectiveDate;
    };

    $scope.findTaxRateSummariesByDate = function(tax) {
      var date = new Date();
      var summaries = CommonService.findRateSummariesByDate(tax.rateSummaries, date);
      tax.percentage = summaries[0].percentage;
      tax.effectiveDate = summaries[0].effectiveDate;
    };

    function commonViewSummariesDialog(ev, index, data, isHallRate) {
      var oldShow = $mdDialog.show;
      $mdDialog.show = function(options) {
        if (options.hasOwnProperty("skipHide")) {
          options.multiple = options.skipHide;
        }
        return oldShow(options);
      };
      $mdDialog.show({
          controller: 'RateSummariesController',
          templateUrl: 'modules/core/client/views/settings/form-rate-summaries.client.view.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: false,
          fullscreen: true,
          resolve: {
            summariesResolve: function() {
              return data;
            },
            isHallRate: function() {
              return isHallRate;
            }
          },
        })
        .then(function(updatedItem) {
          if (isHallRate) {
            $scope.halls[index] = updatedItem;
          } else {
            $scope.taxes[index] = updatedItem;
          }

        }, function() {
          console.log('You cancelled the dialog.');
        });
    }

    /** CRUD Functionality for Receipt/Invoice Number **/

    $scope.mShowReceiptInvoicePopup = function(ev, index, counter) {
      var oldShow = $mdDialog.show;
      $mdDialog.show = function(options) {
        if (options.hasOwnProperty("skipHide")) {
          options.multiple = options.skipHide;
        }
        return oldShow(options);
      };
      
      $mdDialog.show({
          controller: 'CountersController',
          templateUrl: 'modules/counters/client/views/form-counter.client.view.html',
          parent: angular.element(document.body),
          clickOutsideToClose: true,
          targetEvent: ev,
          fullscreen: true,
          resolve: {
            counter: function() {
              return counter;
            },
            countersResolve: function() {
              return $scope.counters;
            }
          }
        })
        .then(function(updatedItem) {
          if (counter) {
            $scope.counters[index] = updatedItem;
          }
          else {
            $scope.counters.push(updatedItem);
          }          
        }, function() {
          console.log('You cancelled the dialog.');
        });
    }

  }


}());
