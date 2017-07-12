(function () {
  'use strict';

  angular
    .module('core')
    .controller('HeaderController', HeaderController);

  HeaderController.$inject = ['$scope', '$state', '$rootScope', 'Authentication', 'menuService', 'AuthenticationService'];

  function HeaderController($scope, $state, $rootScope, Authentication, menuService, AuthenticationService) 
  {
    var vm = this;

    vm.accountMenu = menuService.getMenu('account').items[0];
    vm.authentication = Authentication;
    vm.isCollapsed = false;
    vm.menu = menuService.getMenu('topbar');

    $scope.$on('$stateChangeSuccess', stateChangeSuccess);

    function stateChangeSuccess() {
      // Collapsing the menu after navigation
      vm.isCollapsed = false;
    }

    var loggedIn = $rootScope.globals.currentUser;
    if(loggedIn) 
    {
      $state.go('bookings');
      $scope.imageUrl = loggedIn.imageUrl;
      $scope.name = loggedIn.userName;
    }
    else
    {
      $state.go('login');
    }

    $rootScope.$on('userLoggedIn', function () 
    {//Receiving broadcast from login
       var loggedIn = $rootScope.globals.currentUser;
        if(loggedIn) 
        {
          $scope.imageUrl = loggedIn.imageUrl;
          $scope.name = loggedIn.userName;

        }
    });

    $scope.logout = function() 
    {       
       AuthenticationService.ClearCredentials();
       $rootScope.isUserLoggedIn = false;
       $state.go('login');
    };

  }
}());
