(function() {
  'use strict';

  // Halls controller
  angular
    .module('halls')
    .controller('HallsController', HallsController);

  HallsController.$inject = ['DATA_BACKGROUND_COLOR', '$scope', '$state', '$rootScope', '$mdDialog', 'Notification', 'hallResolve', 'HallsService', '$mdpDatePicker', 'TaxesService'];

  function HallsController(DATA_BACKGROUND_COLOR, $scope, $state, $rootScope, $mdDialog, Notification, hall, HallsService, $mdpDatePicker, TaxesService) {
    $scope.model = {
      hall: {
        name: hall ? hall.name : undefined,
        rate: hall ? hall.rate : undefined,
        _id: hall ? hall._id : undefined,
        powerConsumpationCharges: hall ? hall.powerConsumpationCharges : undefined,
        cleaningCharges: hall ? hall.cleaningCharges : undefined,
        CGSTTax: hall ? hall.CGSTTax : undefined,
        SGSTTax: hall ? hall.SGSTTax : undefined,
        effectiveDate: hall ? dateConvertion(hall.effectiveDate) : dateConvertion(new Date()),
        rateSummaries: hall ? hall.rateSummaries : [],
      },
      taxes: TaxesService.query(),
    };

    $scope.ui = {
      mNumberPattern: /^[0-9]*$/
    }

    $scope.DATA_BACKGROUND_COLOR = DATA_BACKGROUND_COLOR;

    $scope.loadInitial = function() {
      var currentDate = new Date();
      var summaryRate = findRateSummariesByDate($scope.model.hall.rateSummaries, currentDate);
      if (summaryRate.length > 0) {
        $scope.model.hall.rate = summaryRate[0].rate;
        $scope.model.hall.effectiveDate = dateConvertion(summaryRate[0].effectiveDate);
      } else {
        var getLastSummary = _.last($scope.model.hall.rateSummaries);
        $scope.model.hall.rate = getLastSummary.rate;
        $scope.model.hall.effectiveDate = dateConvertion(getLastSummary.effectiveDate);
      }
    };

    $scope.calculateTaxRate = function() {
      var totalCost = Number($scope.model.hall.rate) + Number($scope.model.hall.powerConsumpationCharges) + Number($scope.model.hall.cleaningCharges);
      var cgstPercent = Number(getTaxRateByName('cgst')) / 100;
      var sgstPercent = Number(getTaxRateByName('sgst')) / 100;
      $scope.model.hall.CGSTTax = Number(Number(Number(totalCost) * cgstPercent).toFixed(2));
      $scope.model.hall.SGSTTax = Number(Number(Number(totalCost) * sgstPercent).toFixed(2));
    };

    $scope.save = function(hallForm) {
      $scope.hallForm = hallForm;
      if (hallForm.$valid) {
        if ($scope.model.hall._id) {
          var requestedEffectiveDate = new Date($scope.model.hall.effectiveDate);
          var summaryRate = findRateSummariesByDate($scope.model.hall.rateSummaries, requestedEffectiveDate);
          if (summaryRate.length > 0) {
            var index = _.indexOf($scope.model.hall.rateSummaries, summaryRate[0]);
            $scope.model.hall.rateSummaries[index] = {
              rate: $scope.model.hall.rate,
              effectiveDate: $scope.model.hall.effectiveDate
            };
          } else {
            $scope.model.hall.rateSummaries.push({
              rate: $scope.model.hall.rate,
              effectiveDate: $scope.model.hall.effectiveDate
            });
          }
          HallsService.update($scope.model.hall, successCallback, errorCallback);
        } else {
          $scope.model.hall.rateSummaries.push({
            rate: $scope.model.hall.rate,
            effectiveDate: $scope.model.hall.effectiveDate
          });
          HallsService.save($scope.model.hall, successCallback, errorCallback);
        }

        function successCallback(res) {
          $mdDialog.hide(res);
        }

        function errorCallback(res) {
          Notification.error({
            message: res.data.message,
            title: '<i class="glyphicon glyphicon-remove"></i> Create Hall Error !!!'
          });
        }
      }
    }

    $scope.cancel = function() {
      $mdDialog.cancel();
    }

    $scope.showStartDatePicker = function(ev) {
      $mdpDatePicker($scope.model.effectiveDate, {
          targetEvent: ev,
        })
        .then(function(dateTime) {
          $scope.model.hall.effectiveDate = moment(dateTime).format('DD, MMM YYYY');
        });
    }

    function dateConvertion(date) {
      return moment(date).format('DD, MMM YYYY');
    }

    function findRateSummariesByDate(rateSummaries, date) {
      var summaries = _.filter(rateSummaries, function(summary) {
        var createdHallEffectiveDate = new Date(summary.effectiveDate);
        return ((createdHallEffectiveDate.getFullYear() === date.getFullYear()) && (createdHallEffectiveDate.getMonth() === date.getMonth()));
      });

      return summaries;
    }

    function getTaxRateByName(name) {
      var taxArray = _.filter($scope.model.taxes, function(tax) {
        return tax.name === name;
      });
      return taxArray[0].percentage;
    };
  }
}());