(function (app) {
  'use strict';

  // Start by defining the main module and adding the module dependencies
  angular
    .module(app.applicationModuleName, app.applicationModuleVendorDependencies);

  // Setting HTML5 Location Mode
  angular
    .module(app.applicationModuleName)
    .config(bootstrapConfig)
    .run(run);

  bootstrapConfig.$inject = ['$compileProvider', '$locationProvider', '$httpProvider', '$logProvider'];

  function bootstrapConfig($compileProvider, $locationProvider, $httpProvider, $logProvider) {
    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    }).hashPrefix('!');

    $httpProvider.interceptors.push('authInterceptor');

    // Disable debug data for production environment
    // @link https://docs.angularjs.org/guide/production
    $compileProvider.debugInfoEnabled(app.applicationEnvironment !== 'production');
    $logProvider.debugEnabled(app.applicationEnvironment !== 'production');
  }

  run.$inject = ['AuthenticationService', '$rootScope', '$cookieStore', '$http', '$q', 'GOOGLE_DISCOVERY_DOCS', 'GOOGLE_CLIENT_ID'];
  function run(AuthenticationService, $rootScope, $cookieStore, $http, $q, GOOGLE_DISCOVERY_DOCS, GOOGLE_CLIENT_ID) 
  {
    $rootScope.ajaxCall = $q.defer();

    // keep user logged in after page refresh
    $rootScope.globals = $cookieStore.get('globals') || {};
    if($rootScope.globals.currentUser) 
    {
      $http.defaults.headers.common['Authorization'] = 'Bearer ' + $rootScope.globals.currentUser.accessToken; // jshint ignore:line
    }


    var validNavigation = false;
    window.onbeforeunload = function() {
      if (!validNavigation) {
        AuthenticationService.ClearCredentials();
        $rootScope.isUserLoggedIn = false; //Webkit, Safari, Chrome
      }
    }

    $(document).keydown(function(e) {
      if ((e.keyCode == 65 && e.ctrlKey)  || (e.keyCode == 116)) {
        validNavigation = true;
      }
    });

    // Attach the event click for all links in the page
    angular.element("a").bind("click", function() {
      validNavigation = true;
    });

    // Attach the event submit for all forms in the page
    angular.element("form").bind("submit", function() {
      validNavigation = true;
    });

    // Attach the event click for all inputs in the page
    angular.element("input[type=submit]").bind("click", function() {
      validNavigation = true;
    });
    
    gapi.load('client:auth2', function()
    {
      console.log("appjs client load "+gapi.client); 

      gapi.client.init({
        discoveryDocs: GOOGLE_DISCOVERY_DOCS,
        clientId: GOOGLE_CLIENT_ID,
        scope: 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar'
        })
      .then(function () 
      {
        console.log("appjs client init ");          

        $rootScope.ajaxCall.resolve();

      });
    });     
  }

  // Then define the init function for starting up the application
  angular.element(document).ready(init);

  function init() {
    // Fixing facebook bug with redirect
    if (window.location.hash && window.location.hash === '#_=_') {
      if (window.history && history.pushState) {
        window.history.pushState('', document.title, window.location.pathname);
      } else {
        // Prevent scrolling by storing the page's current scroll offset
        var scroll = {
          top: document.body.scrollTop,
          left: document.body.scrollLeft
        };
        window.location.hash = '';
        // Restore the scroll offset, should be flicker free
        document.body.scrollTop = scroll.top;
        document.body.scrollLeft = scroll.left;
      }
    }

    // Then init the app
    angular.bootstrap(document, [app.applicationModuleName]);
  }
}(ApplicationConfiguration));
