(function() {
  'use strict';

  // Halls controller
  angular
    .module('core')
    .controller('RateSummariesController', RateSummariesController);

  RateSummariesController.$inject = ['DATA_BACKGROUND_COLOR', 'CommonService', '$scope', '$state', '$rootScope', '$mdDialog', 'Notification', 'summariesResolve', 'isHallRate', 'HallsService', '$mdpDatePicker', 'TaxesService'];

  function RateSummariesController(DATA_BACKGROUND_COLOR, CommonService, $scope, $state, $rootScope, $mdDialog, Notification, summariesResolve, isHallRate, HallsService, $mdpDatePicker, TaxesService) {
    $scope.model = {
      rate: summariesResolve
    };

    $scope.ui = {
      mNumberPattern: /^[0-9]*$/,
      isHallRate: isHallRate
    };

    $scope.unconfirmed = {};

    $scope.DATA_BACKGROUND_COLOR = DATA_BACKGROUND_COLOR;

    $scope.loadInitial = function() {  
      if(isHallRate) {
        $scope.unconfirmed = {
          effectiveDate: moment(new Date()).format('YYYY-MM-DD'),
          rate: null,
          powerConsumpationCharges: null,
          cleaningCharges: null
        };
      } else {
        $scope.unconfirmed = {
          effectiveDate: moment(new Date()).format('YYYY-MM-DD'),
          percentage: null
        }
      }
    };

    $scope.cancel = function() {
      $mdDialog.cancel();
    }

    $scope.isEdit = function(rate) {
      rate.isEdit = true;
    }

    $scope.addIsEdit = function(rate) {
      rate.isEdit = false;
    };

    function dateConvertion(date) {
      return moment(date).format('DD, MMM YYYY');
    }

    $scope.showEffectiveDatePicker = function(ev, rate) {
      $mdpDatePicker(rate.effectiveDate, {
          targetEvent: ev,
        })
        .then(function(dateTime) {
          rate.effectiveDate = moment(dateTime).format('DD, MMM YYYY');
        });
    };

    $scope.showUnconfirmedEffectiveDatePicker = function(ev) {
      $mdpDatePicker($scope.unconfirmed.effectiveDate, {
          targetEvent: ev,
        })
        .then(function(dateTime) {
          $scope.unconfirmed.effectiveDate = moment(dateTime).format('YYYY-MM-DD');
        });
    };

    $scope.addRateSummary = function() {
      $scope.model.rate.rateSummaries.push($scope.unconfirmed);
      $scope.loadInitial();
    };

    $scope.removeRateSummary = function(rate) {
      var index = _.findIndex($scope.model.rate.rateSummaries, function(o) { return o._id == rate._id; });
      $scope.model.rate.rateSummaries.splice(index, 1);
    };

    $scope.save = function() {
      $scope.addRateSummary();
      if(isHallRate) {
        HallsService.update($scope.model.rate, successCallback, errorCallback);  
      } else {
        TaxesService.update($scope.model.rate, successCallback, errorCallback);
      }      

      function successCallback(res) {
        $mdDialog.hide(res);
      }

      function errorCallback(res) {
        Notification.error({
          message: res.data.message,
          title: '<i class="glyphicon glyphicon-remove"></i> Update Rate Summary Error !!!'
        });
      }
    }
  }
}());