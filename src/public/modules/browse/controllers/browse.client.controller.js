'use strict';

// Categories controller
angular.module('browse').controller('BrowseController', ['$scope', '$stateParams', '$location', 'Authentication', 'Checklists',
	function($scope, $stateParams, $location, Authentication, Checklists) {
		$scope.authentication = Authentication;
		
		// Find a list of Categories
		$scope.find = function() {
			$scope.checklists = Checklists.browse();
		};

	}
]);