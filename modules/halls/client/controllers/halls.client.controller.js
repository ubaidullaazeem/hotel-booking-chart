(function() {
  'use strict';

  // Halls controller
  angular
    .module('halls')
    .controller('HallsController', HallsController);

  HallsController.$inject = ['CGST', 'SGST', 'DATA_BACKGROUND_COLOR', 'CommonService', '$scope', '$state', '$rootScope', '$mdDialog', 'Notification', 'hallResolve', 'HallsService', '$mdpDatePicker', 'TaxesService'];

  function HallsController(CGST, SGST, DATA_BACKGROUND_COLOR, CommonService, $scope, $state, $rootScope, $mdDialog, Notification, hall, HallsService, $mdpDatePicker, TaxesService) {
    $scope.model = {
      hall: {
        name: hall ? hall.name : undefined,
        displayName: hall ? hall.displayName : undefined,
        _id: hall ? hall._id : undefined,        
        effectiveDate: hall ? dateConvertion(hall.effectiveDate) : dateConvertion(new Date()),
        rateSummaries: hall ? hall.rateSummaries : [],
      },
      taxes: TaxesService.query(),
      rate: undefined,
      powerConsumpationCharges: undefined,
      cleaningCharges: undefined,
      CGSTTax: undefined,
      SGSTTax: undefined,
    };

    $scope.ui = {
      mNumberPattern: /^[0-9]+(\.[0-9]{1,2})?$/,
      createMode: true,
    }

    $scope.DATA_BACKGROUND_COLOR = DATA_BACKGROUND_COLOR;

    $scope.$watch('model.hall.displayName', function() {
      $scope.model.hall.name = $scope.model.hall.displayName;
    }, true);

    $scope.loadInitial = function() {  
      if ($scope.model.hall._id) {
        $scope.ui.createMode = false;
        var currentDate = new Date();
        var summaryRate = CommonService.findRateSummariesByDate($scope.model.hall.rateSummaries, currentDate);
        $scope.model.rate = summaryRate[0].rate;
        $scope.model.powerConsumpationCharges = summaryRate[0].powerConsumpationCharges;
        $scope.model.cleaningCharges = summaryRate[0].cleaningCharges;
        $scope.model.CGSTTax = summaryRate[0].CGSTTax;
        $scope.model.SGSTTax = summaryRate[0].SGSTTax;
        $scope.model.hall.effectiveDate = dateConvertion(summaryRate[0].effectiveDate);       
      }
    };

    $scope.model.taxes.$promise.then(function(result) {
      var hasContainsTaxName = CommonService.hasContainsTaxName($scope.model.taxes);
      if (!hasContainsTaxName) {
        Notification.error({
          message: "Please add both CGST and SGST tax rate.",
          title: '<i class="glyphicon glyphicon-remove"></i> Tax Missing Error !!!'
        });
        $mdDialog.cancel();
      }
    });

    $scope.calculateTaxRate = function() {
      var totalCost = Number($scope.model.rate) + Number($scope.model.powerConsumpationCharges) + Number($scope.model.cleaningCharges);
      var cgst = CommonService.findRateSummariesByDate(CommonService.getTaxRateByName($scope.model.taxes, CGST).rateSummaries, new Date());
      var sgst = CommonService.findRateSummariesByDate(CommonService.getTaxRateByName($scope.model.taxes, SGST).rateSummaries, new Date());
      var cgstPercent = cgst[0].percentage / 100;
      var sgstPercent = sgst[0].percentage / 100;
      $scope.model.CGSTTax = Number(Number(Number(totalCost) * cgstPercent).toFixed(2));
      $scope.model.SGSTTax = Number(Number(Number(totalCost) * sgstPercent).toFixed(2));
    };

    $scope.save = function(hallForm) {
      $scope.hallForm = hallForm;
      if (hallForm.$valid) {
        if ($scope.model.hall._id) {
          var requestedEffectiveDate = new Date($scope.model.hall.effectiveDate);
          var summaryRate = CommonService.findRateSummariesByDateBeforeSave($scope.model.hall.rateSummaries, requestedEffectiveDate);
          if (summaryRate.length > 0) {
            var index = _.indexOf($scope.model.hall.rateSummaries, summaryRate[0]);
            $scope.model.hall.rateSummaries[index] = {
              rate: $scope.model.rate,
              powerConsumpationCharges: $scope.model.powerConsumpationCharges,
              cleaningCharges: $scope.model.cleaningCharges,
              CGSTTax: $scope.model.CGSTTax,
              SGSTTax: $scope.model.SGSTTax,
              effectiveDate: $scope.model.hall.effectiveDate
            };
          } else {
            $scope.model.hall.rateSummaries.push({
              rate: $scope.model.rate,
              powerConsumpationCharges: $scope.model.powerConsumpationCharges,
              cleaningCharges: $scope.model.cleaningCharges,
              CGSTTax: $scope.model.CGSTTax,
              SGSTTax: $scope.model.SGSTTax,
              effectiveDate: $scope.model.hall.effectiveDate
            });
          }
          HallsService.update($scope.model.hall, successCallback, errorCallback);
        } else {
          $scope.model.hall.rateSummaries.push({
            rate: $scope.model.rate,
            powerConsumpationCharges: $scope.model.powerConsumpationCharges,
            cleaningCharges: $scope.model.cleaningCharges,
            CGSTTax: $scope.model.CGSTTax,
            SGSTTax: $scope.model.SGSTTax,
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
      $mdpDatePicker($scope.model.hall.effectiveDate, {
          targetEvent: ev,
        })
        .then(function(dateTime) {
          $scope.model.hall.effectiveDate = moment(dateTime).format('DD, MMM YYYY');
        });
    }

    // $scope.showStartDatePicker = function() {
    //   new MaterialDatepicker('#hallEffectiveDatePicker', {
    //     type: "month",
    //     closeAfterClick: true,
    //     onNewDate: function(dateTime) {
    //       var date = new Date(dateTime);
    //       var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    //       $scope.model.hall.effectiveDate = moment(firstDay).format('DD, MMM YYYY');
    //       angular.element("#hallEffectiveDatePicker").val(moment(firstDay).format('DD, MMM YYYY'));
    //     }
    //   });
    // }
    function dateConvertion(date) {
      return moment(date).format('DD, MMM YYYY');
    }
  }
}());