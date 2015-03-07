'use strict';

//Setting up route
angular.module('browse').config(['$stateProvider',
	function($stateProvider) {
		// Categories state routing
		$stateProvider.
		state('browse', {
			url: '/browse',
			templateUrl: 'modules/browse/views/browse.client.view.html'
		});
	}
]);