(function () {
  'use strict';

  angular
    .module('core')
    .controller('SettingsController', SettingsController);

  SettingsController.$inject = ['$scope', '$state', '$rootScope', '$mdDialog', '$mdToast', 'HallsService'];

  function SettingsController($scope, $state, $rootScope,  $mdDialog, $mdToast, HallsService) {
    var vm = this;

    console.log("SettingsController");

     $scope.mShowAddHallPopup = function(ev) 
    {      
      $mdDialog.show({
                      controller: 'HallsController',
                      templateUrl: 'modules/halls/client/views/form-hall.client.view.html',
                      parent: angular.element(document.body),
                      targetEvent: ev,
                      clickOutsideToClose:false,
                      fullscreen: true,
                      resolve: {
                          hallResolve: newHall
                        },
                    })
                    .then(function(answer) 
                    {
                      console.log('You said the information was "' + answer + '".');
                    }, function() 
                    {
                     console.log('You cancelled the dialog.');
                    });
      
    }  

    $scope.mShowEditHallPopup = function(ev, hall) 
    {      
      $mdDialog.show({
                      controller: 'HallsController',
                      templateUrl: 'modules/halls/client/views/form-hall.client.view.html',
                      parent: angular.element(document.body),
                      targetEvent: ev,
                      clickOutsideToClose:false,
                      fullscreen: true,
                      resolve: {
                          hallResolve: function() 
                                        {
                                          return hall;
                                        }
                        },
                    })
                    .then(function(answer) 
                    {
                      console.log('You said the information was "' + answer + '".');
                    }, function() 
                    {
                     console.log('You cancelled the dialog.');
                     refreshHalls();
                    });
      
    }  

    $scope.mDeleteHall = function(ev, hall) 
    {      
      var confirm = $mdDialog.confirm()
                            .title('Do you want to delete the '+hall.name+' hall?')
                            .textContent('Hall will be deleted permanently.')
                            .targetEvent(ev)
                            .ok('Yes')
                            .cancel('No');

      $mdDialog.show(confirm).then(function() 
      {
        hall.$remove(successCallback, errorCallback);

        function successCallback(res) 
        {          
          refreshHalls();
        }

        function errorCallback(res) 
        {
          $mdToast.show($mdToast.simple().textContent(res.data.message).position('bottom right').hideDelay(3000));
        }
      }, 
      function() 
      {
        console.log("no");
      });  
    }


    $scope.halls = HallsService.query();


    $rootScope.$on('refreshHalls', function () 
    {//Receiving broadcast from hallscontroller       
       refreshHalls();
    });

    function refreshHalls()
    {
      $scope.halls = HallsService.query();
    }


    $scope.$on('$stateChangeSuccess', stateChangeSuccess);
    function stateChangeSuccess() 
    {
      $scope.cancel();     
    }

    $scope.cancel = function() 
    {
        $mdDialog.cancel();
    };
    
  }
  
  newHall.$inject = ['HallsService'];

  function newHall(HallsService) 
  {
    return new HallsService();
  }

}());
