(function () {
  'use strict';

  angular
    .module('core')
    .controller('LoginController', LoginController);

  LoginController.$inject = ['$scope', '$state', '$rootScope', 'AuthenticationService', 'AUTHORISED_EMAIL', 'MESSAGES', '$mdDialog', '$mdToast'];
  function LoginController($scope, $state, $rootScope, AuthenticationService, AUTHORISED_EMAIL, MESSAGES, $mdDialog, $mdToast) 
  {
    //var vm = this;

    var loggedIn = $rootScope.globals.currentUser;
    if(loggedIn) 
    {
      $state.go('bookings');
      $rootScope.isUserLoggedIn = true;
    }
    else
    {
      $rootScope.isUserLoggedIn = false;
    }

    

    /*(function initController() {
         // reset login status
         AuthenticationService.ClearCredentials();
      })();*/
	
    $scope.handleAuthClick=function (event) 
    {        
        //gapi.auth.authorize({discoveryDocs: GOOGLE_DISCOVERY_DOCS, client_id: GOOGLE_CLIENT_ID, scope: GOOGLE_SCOPES, immediate: true}, handleAuthResult);
        //return false;        

        // Listen for sign-in state changes.
        gapi.auth2.getAuthInstance().isSignedIn.listen($scope.updateSigninStatus);

        // Handle the initial sign-in state.
        $scope.updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());

        gapi.auth2.getAuthInstance().signIn();
    }

    $scope.updateSigninStatus=function(isSignedIn) 
    {      
      if (isSignedIn) 
      {
        console.log("signed in");

        //gapi.auth.authorize({discoveryDocs: GOOGLE_DISCOVERY_DOCS, client_id: GOOGLE_CLIENT_ID, scope: GOOGLE_SCOPES, immediate: true}, handleAuthResult);          

        gapi.client.load('plus','v1', function()
         {
           var request = gapi.client.plus.people.get({'userId': 'me'});
           request.execute(function(userResult) 
           {          
              if(userResult && userResult.hasOwnProperty('error')) // error
              {
                 $mdToast.show($mdToast.simple().textContent(MESSAGES.ERROR_OCCURED).position('top right').hideDelay(3000));
              } 
              else // success
              {
                var primaryEmail=null;
                for (var i=0; i < userResult.emails.length; i++) 
                {
                  if (userResult.emails[i].type === 'account') 
                    primaryEmail = userResult.emails[i].value;
                }

                if (primaryEmail !== null) 
                {
                  if (primaryEmail.toLowerCase() == AUTHORISED_EMAIL) 
                  {  
                    AuthenticationService.SetCredentials("", primaryEmail, userResult.id, userResult.displayName, userResult.image.url);

                    $mdToast.show($mdToast.simple().textContent("Success").position('top right').hideDelay(3000));

                    $rootScope.isUserLoggedIn = true;
                    $rootScope.$broadcast('userLoggedIn');//sending broadcast to update the header name and image
                    $state.go('bookings');
                  }
                  else
                  {
                    $mdDialog.show($mdDialog.alert().clickOutsideToClose(true).title(MESSAGES.UNAUTHORISED_USER).ok('OK'));
                  }                  
                }
                else
                {
                  console.log("null");
                  $mdDialog.show($mdDialog.alert().clickOutsideToClose(true).title(MESSAGES.PRIMARY_EMAIL_ERROR).ok('OK'));
                }  
              }
           });
        });  
      } 
      else 
      {
         console.log("not signed in");
      }           
    }

  }
}());
