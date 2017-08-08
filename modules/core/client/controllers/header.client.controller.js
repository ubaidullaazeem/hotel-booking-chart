(function () {
  'use strict';

  angular
    .module('core')
    .controller('HeaderController', HeaderController);

  HeaderController.$inject = ['DATA_BACKGROUND_COLOR', '$scope', '$state', '$rootScope', 'Authentication', 'menuService', 'AuthenticationService'];

  function HeaderController(DATA_BACKGROUND_COLOR, $scope, $state, $rootScope, Authentication, menuService, AuthenticationService) 
  {
    var vm = this;

    vm.accountMenu = menuService.getMenu('account').items[0];
    vm.authentication = Authentication;
    vm.isCollapsed = false;
    vm.menu = menuService.getMenu('topbar');
    vm.DATA_BACKGROUND_COLOR = DATA_BACKGROUND_COLOR;

    $scope.$on('$stateChangeSuccess', stateChangeSuccess);

    function stateChangeSuccess() {
      // Collapsing the menu after navigation
      vm.isCollapsed = false;
    }

    var loggedIn = $rootScope.globals.currentUser;
    var page = window.location.href.substr(window.location.href.lastIndexOf('/') + 1);
    var currentPage = page ? page : 'login';
    if(loggedIn) 
    {
      var routePage = currentPage === 'login' ? 'bookings' : currentPage;
      $state.go(routePage);
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
