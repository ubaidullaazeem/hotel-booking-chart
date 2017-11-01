(function () {
  'use strict';

  // Taxes controller
  angular
    .module('taxes')
    .controller('TaxesController', TaxesController);

  TaxesController.$inject = ['CommonService', 'DATA_BACKGROUND_COLOR', '$scope', '$state', '$rootScope', '$window', 'Authentication', '$mdDialog', 'Notification', 'taxResolve', 'TaxesService', '$mdpDatePicker'];

  function TaxesController (CommonService, DATA_BACKGROUND_COLOR, $scope, $state, $rootScope, $window, Authentication, $mdDialog, Notification, tax, TaxesService, $mdpDatePicker) 
  {   
    $scope.model = {
      tax: {
        name: tax ? tax.name : undefined,
        _id: tax ? tax._id : undefined,
        effectiveDate: tax ? dateConvertion(tax.effectiveDate) : dateConvertion(new Date()),
        rateSummaries: tax ? tax.rateSummaries : [],
      },
      percentage: undefined,
    };

    $scope.ui = {
      mNumberPattern: /^[0-9]*$/,
      createMode: true,
    };

    $scope.DATA_BACKGROUND_COLOR = DATA_BACKGROUND_COLOR;

     $scope.loadInitial = function() {
      if ($scope.model.tax._id) {
        $scope.ui.createMode = false;
        var currentDate = new Date();
        var summaryRate = CommonService.findRateSummariesByDate($scope.model.tax.rateSummaries, currentDate);
        $scope.model.percentage = summaryRate[0].percentage;
        $scope.model.tax.effectiveDate = dateConvertion(summaryRate[0].effectiveDate);
      }
    };
    
    $scope.save = function(createTaxForm)
    {       
      $scope.createTaxForm = createTaxForm;
      if (createTaxForm.$valid) 
      {     
        if ($scope.model.tax._id) 
        {
          var requestedEffectiveDate = new Date($scope.model.tax.effectiveDate);
          var summaryRate = CommonService.findRateSummariesByDateBeforeSave($scope.model.tax.rateSummaries, requestedEffectiveDate);
          if (summaryRate.length > 0) {
            var index = _.indexOf($scope.model.tax.rateSummaries, summaryRate[0]);
            $scope.model.tax.rateSummaries[index] = {
              percentage: $scope.model.percentage,
              effectiveDate: $scope.model.tax.effectiveDate
            };
          } else {
            $scope.model.tax.rateSummaries.push({
              percentage: $scope.model.percentage,
              effectiveDate: $scope.model.tax.effectiveDate
            });
          }
          TaxesService.update($scope.model.tax, successCallback, errorCallback);
        } 
        else 
        {
          $scope.model.tax.rateSummaries.push({
            percentage: $scope.model.percentage,
            effectiveDate: $scope.model.tax.effectiveDate
          });
          TaxesService.save($scope.model.tax, successCallback, errorCallback);
        }        

        function successCallback(res) 
        {          
          $mdDialog.hide(res);
        }

        function errorCallback(res) 
        {
          Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Create Tax Error !!!' });
        }
      }
    }

    $scope.cancel = function()
    {
      $mdDialog.cancel();
    }

    $scope.showStartDatePicker = function(ev) {
      $mdpDatePicker($scope.model.tax.effectiveDate, {
          targetEvent: ev,
        })
        .then(function(dateTime) {
          $scope.model.tax.effectiveDate = moment(dateTime).format('DD, MMM YYYY');
        });
    }

    function dateConvertion(date) {
      return moment(date).format('DD, MMM YYYY');
    }
  }
}());
