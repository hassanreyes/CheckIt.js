'use strict';

angular.module('users').controller('DashboardController', ['$scope', '$http', '$location', 'Users', 'Authentication', 'Checklists', 'Dashboard',
	function($scope, $http, $location, Users, Authentication, Checklists, Dashboard) {
		$scope.user = Authentication.user;
		$scope.favorites = [];
		$scope.myChecklists = [];
		$scope.visitedChecklists = [];
		$scope.addedChecklists = [];
		$scope.recommChecklists = [];
		
		$scope.init = function(){
		    $scope.favorites = 
		    $scope.myChecklists = 
		    $scope.visitedChecklists =
		    $scope.addedChecklists =
		    $scope.recommChecklists = Checklists.query();
		};
		
	}
]);