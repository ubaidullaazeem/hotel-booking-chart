(function() {
  'use strict';

  // Taxes controller
  angular
    .module('taxes')
    .controller('TaxesController', TaxesController);

  TaxesController.$inject = ['CommonService', 'DATA_BACKGROUND_COLOR', '$scope', '$state', '$rootScope', '$window', 'Authentication', '$mdDialog', 'Notification', 'taxResolve', 'TaxesService', '$mdpDatePicker', 'taxTypeResolve'];

  function TaxesController(CommonService, DATA_BACKGROUND_COLOR, $scope, $state, $rootScope, $window, Authentication, $mdDialog, Notification, tax, TaxesService, $mdpDatePicker, taxTypeResolve) {
    $scope.model = {
      tax: {
        name: tax ? tax.name : undefined,
        _id: tax ? tax._id : undefined,
        effectiveDate: tax ? dateConvertion(tax.effectiveDate) : dateConvertion(new Date().setHours(0, 0, 0, 0)),
        rateSummaries: tax ? tax.rateSummaries : []
      },
      percentage: undefined,
      taxTypes: taxTypeResolve
    };
    
    $scope.ui = {
      mNumberPattern: /^[0-9]+(\.[0-9]{1,2})?$/,
      createMode: true
    };

    $scope.DATA_BACKGROUND_COLOR = DATA_BACKGROUND_COLOR;
    var currentRateSummaryId;

    $scope.loadInitial = function() {
      if ($scope.model.tax._id) {
        $scope.ui.createMode = false;
        var currentDate = new Date();
        var summaryRate = CommonService.findRateSummariesByDate($scope.model.tax.rateSummaries, currentDate);
        $scope.model.percentage = summaryRate[0].percentage;
        $scope.model.tax.effectiveDate = dateConvertion(summaryRate[0].effectiveDate);
        currentRateSummaryId = summaryRate[0]._id;
      }
    };

    $scope.save = function(createTaxForm) {
      $scope.createTaxForm = createTaxForm;
      if (createTaxForm.$valid) {
        if ($scope.model.tax._id) {
          var requestedEffectiveDate = new Date($scope.model.tax.effectiveDate);
          var summaryRate = CommonService.findRateSummariesByDateBeforeSave($scope.model.tax.rateSummaries, requestedEffectiveDate);
          if (summaryRate.length > 0) {
            if (summaryRate[0]._id === currentRateSummaryId) {
              var index = _.findIndex($scope.model.tax.rateSummaries, function(o) {
                return o._id == currentRateSummaryId;
              });
              $scope.model.tax.rateSummaries[index] = {
                percentage: $scope.model.percentage,
                effectiveDate: $scope.model.tax.effectiveDate
              };
            } else {
              var indexToRemove = _.indexOf($scope.model.tax.rateSummaries, summaryRate[0]);

              var index = _.findIndex($scope.model.tax.rateSummaries, function(o) {
                return o._id == currentRateSummaryId;
              });
              $scope.model.tax.rateSummaries[index] = {
                percentage: $scope.model.percentage,
                effectiveDate: $scope.model.tax.effectiveDate
              };

              $scope.model.tax.rateSummaries.splice(indexToRemove, 1);
            }

          } else {
            /*$scope.model.tax.rateSummaries.push({
              percentage: $scope.model.percentage,
              effectiveDate: $scope.model.tax.effectiveDate
            });*/
            var index = _.findIndex($scope.model.tax.rateSummaries, function(o) {
              return o._id == currentRateSummaryId;
            });
            $scope.model.tax.rateSummaries[index] = {
              percentage: $scope.model.percentage,
              effectiveDate: $scope.model.tax.effectiveDate
            };
          }
          TaxesService.update($scope.model.tax, successCallback, errorCallback);
        } else {
          $scope.model.tax.rateSummaries.push({
            percentage: $scope.model.percentage,
            effectiveDate: $scope.model.tax.effectiveDate
          });
          TaxesService.save($scope.model.tax, successCallback, errorCallback);
        }

        function successCallback(res) {
          $mdDialog.hide(res);
        }

        function errorCallback(res) {
          Notification.error({
            message: res.data.message,
            title: '<i class="glyphicon glyphicon-remove"></i> Create Tax Error'
          });
        }
      }
    };

    $scope.cancel = function() {
      $mdDialog.cancel();
    };

    $scope.showStartDatePicker = function(ev) {
      var today = new Date();
      $mdpDatePicker(new Date($scope.model.tax.effectiveDate), {
        targetEvent: ev,
        minDate: (moment(new Date($scope.model.tax.effectiveDate).setHours(0, 0, 0, 0)) < moment(today.setHours(0, 0, 0, 0))) ? new Date($scope.model.tax.effectiveDate) : today
      })
        .then(function(dateTime) {
          $scope.model.tax.effectiveDate = dateConvertion(dateTime);
        });
    };

    // $scope.showStartDatePicker = function() {
    //   new MaterialDatepicker('#taxEffectiveDatePicker', {
    //     type: "month",
    //     closeAfterClick: true,
    //     onNewDate: function(dateTime) {
    //       var date = new Date(dateTime);
    //       var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    //       $scope.model.tax.effectiveDate = moment(dateTime).format('DD, MMM YYYY');
    //       angular.element("#taxEffectiveDatePicker").val(moment(firstDay).format('DD, MMM YYYY'));
    //     }
    //   });
    // }

    function dateConvertion(date) {
      console.log('date'+date);
      return moment(date).format('YYYY-MM-DD');
    }
  }
}());
