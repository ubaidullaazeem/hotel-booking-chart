(function() {
  'use strict';

  // Halls controller
  angular
    .module('core')
    .controller('RateSummariesController', RateSummariesController);

  RateSummariesController.$inject = ['DATA_BACKGROUND_COLOR', 'CommonService', '$scope', '$state', '$rootScope', '$mdDialog', 'Notification', 'hallResolve', 'HallsService', '$mdpDatePicker'];

  function RateSummariesController(DATA_BACKGROUND_COLOR, CommonService, $scope, $state, $rootScope, $mdDialog, Notification, rateSummaries, HallsService, $mdpDatePicker) {
    $scope.model = {
      rate: rateSummaries
    };

    $scope.ui = {
      mNumberPattern: /^[0-9]*$/      
    }

    $scope.DATA_BACKGROUND_COLOR = DATA_BACKGROUND_COLOR;

    $scope.loadInitial = function() {  
      
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

    $scope.save = function() {
      HallsService.update($scope.model.rate, successCallback, errorCallback);

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