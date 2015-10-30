'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
	function($httpProvider) {
		// Set the httpProvider "not authorized" interceptor
		$httpProvider.interceptors.push(['$q', '$location', 'Authentication',
			function($q, $location, Authentication) {
				return {
					responseError: function(rejection) {
						switch (rejection.status) {
							case 401:
								// Deauthenticate the global user
								Authentication.user = null;

								// Redirect to signin page
								$location.path('signin');
								break;
							case 403:
								// Add unauthorized behaviour 
								break;
						}

						return $q.reject(rejection);
					}
				};
			}
		]);
	}
]);

angular.module('users').run(function($rootScope, $state, Authentication){
	$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
		// If user is loged-in, then show user´s dashboard
		if(toState.name === "home" && Authentication.user)
		{
			event.preventDefault();
			$state.transitionTo('dashboard');
		}
	})
});