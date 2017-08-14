(function () {
	'use strict';
	angular
	.module('core')
    .factory('AuthenticationService', AuthenticationService);


	AuthenticationService.$inject = ['$http', '$cookieStore', '$rootScope', '$sessionStorage'];
	function AuthenticationService($http, $cookieStore, $rootScope, $sessionStorage) 
    {
		var service = {};
        service.SetCredentials = SetCredentials;
        service.ClearCredentials = ClearCredentials;

        return service;        

        function SetCredentials(access_token, primaryEmail, userId, userName, userImageUrl) 
        {
        	$rootScope.globals = {
        		currentUser: {
        			accessToken: access_token,
                    id: userId,
                    email: primaryEmail,
                    userName: userName,
                    imageUrl: userImageUrl
        		}
        	};

            $http.defaults.headers.common['Authorization'] = 'Bearer ' + access_token; // jshint ignore:line
            //$cookieStore.put('globals', $rootScope.globals);
            sessionStorage.setItem('globals', JSON.stringify($rootScope.globals));
        }

        function ClearCredentials() 
        {
        	$rootScope.globals = {};
        	//$cookieStore.remove('globals');
            sessionStorage.removeItem('globals');
        	$http.defaults.headers.common.Authorization = 'Bearer ';
        }
        
    }

}).call(this);