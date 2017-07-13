(function () {
  'use strict';

  angular
    .module('core')
    .controller('ReportsController', ReportsController);

  ReportsController.$inject = ['$scope', '$state', 'UsersService', '$location', '$window', 'Authentication', 'PasswordValidator', 'Notification'];

  function ReportsController($scope, $state, UsersService, $location, $window, Authentication, PasswordValidator, Notification) {
    var vm = this;

    
    console.log("ReportsController");
    


  }
}());
