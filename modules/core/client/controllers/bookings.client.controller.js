(function () {
  'use strict';

  angular
    .module('users')
    .controller('BookingsController', BookingsController);

  BookingsController.$inject = ['$scope', '$state', '$rootScope', 'UsersService', '$location', '$window', 'Authentication', 'PasswordValidator', 'Notification'];

  function BookingsController($scope, $state, $rootScope, UsersService, $location, $window, Authentication, PasswordValidator, Notification) {
    var vm = this;

    
    $rootScope.isUserLoggedIn = true;
    console.log("BookingsController");
    

  }
}());
