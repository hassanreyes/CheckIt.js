'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
		$scope.addedChecklists = [];

		$scope.init = function(){
			$scope.getLastAdded();
		};

		$scope.getLastAdded = function(){
			$http.get("dashboard/lastAdded", $scope.user).success(function(result){
				$scope.addedChecklists = result;
			});
		};
	}
]);
