(function() {
  'use strict';

  angular
    .module('core')
    .controller('LoginController', LoginController);

  LoginController.$inject = ['$scope', '$state', '$rootScope', 'AuthenticationService', 'AUTHORISED_EMAIL', 'MESSAGES', '$mdDialog', 'Notification'];

  function LoginController($scope, $state, $rootScope, AuthenticationService, AUTHORISED_EMAIL, MESSAGES, $mdDialog, Notification) {
    //var vm = this;
    var isSigninInProgress = false;

    var loggedIn = $rootScope.globals.currentUser;
    var page = window.location.href.substr(window.location.href.lastIndexOf('/') + 1);
    var currentPage = page ? page : 'login';
    if (loggedIn) {
      var routePage = currentPage === 'login' ? 'bookings' : currentPage;
      
      var allStates = _.map($state.get(), 'name');
      $state.go(_.includes(allStates, routePage) ? routePage : 'bookings');
      $rootScope.isUserLoggedIn = true;
    } else {
      $rootScope.isUserLoggedIn = false;
    }



    /*(function initController() {
         // reset login status
         AuthenticationService.ClearCredentials();
      })();*/

    $scope.handleAuthClick = function(event) {
      isSigninInProgress = false;
      //gapi.auth.authorize({discoveryDocs: GOOGLE_DISCOVERY_DOCS, client_id: GOOGLE_CLIENT_ID, scope: GOOGLE_SCOPES, immediate: true}, handleAuthResult);
      //return false;        

      // Listen for sign-in state changes.
      gapi.auth2.getAuthInstance().isSignedIn.listen($scope.updateSigninStatus);

      // Handle the initial sign-in state.
      $scope.updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());

      gapi.auth2.getAuthInstance().signIn();
    }

    $scope.updateSigninStatus = function(isSignedIn) {
      if (isSigninInProgress) {
        return
      }

      if (isSignedIn) {
        isSigninInProgress = true;
        console.log("signed in");

        //gapi.auth.authorize({discoveryDocs: GOOGLE_DISCOVERY_DOCS, client_id: GOOGLE_CLIENT_ID, scope: GOOGLE_SCOPES, immediate: true}, handleAuthResult);          

        gapi.client.load('plus', 'v1', function() {
          var request = gapi.client.plus.people.get({
            'userId': 'me'
          });
          request.execute(function(userResult) {
            if (userResult && userResult.hasOwnProperty('error')) // error
            {
              Notification.error({
                message: MESSAGES.ERR_MSG_GET_USER_INFO
              });
            } else // success
            {
              var primaryEmail = null;
              for (var i = 0; i < userResult.emails.length; i++) {
                if (userResult.emails[i].type === 'account')
                  primaryEmail = userResult.emails[i].value;
              }

              if (primaryEmail !== null) {
                if (primaryEmail.toLowerCase() == AUTHORISED_EMAIL) {
                  $state.go('bookings');
                  AuthenticationService.SetCredentials("", primaryEmail, userResult.id, userResult.displayName, userResult.image.url);

                  Notification.success({
                    message: MESSAGES.SUCCESS_MSG_AUTH,
                    title: '<i class="glyphicon glyphicon-remove"></i> '+MESSAGES.SUCCESS_TITLE_AUTH
                  });

                  $rootScope.isUserLoggedIn = true;
                  $rootScope.$broadcast('userLoggedIn'); //sending broadcast to update the header name and image                    
                } else {
                  $mdDialog.show($mdDialog.alert().clickOutsideToClose(true).title(MESSAGES.ERR_MSG_UNAUTHORISED_USER).ok('OK'));
                  setTimeout(function() {
                    gapi.auth2.getAuthInstance().disconnect();
                  }, 1000);

                }
              } else {
                console.log("null");
                $mdDialog.show($mdDialog.alert().clickOutsideToClose(true).title(MESSAGES.ERR_MSG_PRIMARY_EMAIL).ok('OK'));
              }
            }
          });
        });
      } else {
        console.log("not signed in");
      }
    }

  }
}());
