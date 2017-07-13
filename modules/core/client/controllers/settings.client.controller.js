(function () {
  'use strict';

  angular
    .module('core')
    .controller('SettingsController', SettingsController);

  SettingsController.$inject = ['$scope', '$state'];

  function SettingsController($scope, $state) {
    var vm = this;

    console.log("SettingsController");

    $scope.mShowAddHallPopup = function() 
    {
      console.log("mShowAddHallPopup");

    	alert(1);
    }  
    
  }
}());
