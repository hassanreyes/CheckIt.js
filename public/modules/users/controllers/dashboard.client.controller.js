'use strict';

angular.module('users').controller('DashboardController', ['$scope', '$http', '$location', 'Users', 'Authentication', 'Checklists', 'Dashboard',
	function($scope, $http, $location, Users, Authentication, Checklists, Dashboard) {
		$scope.user = Authentication.user;
		
		$scope.favorites = [];
		$scope.myChecklists = [];
		$scope.visitedChecklists = [];
		$scope.addedChecklists = [];
		$scope.recommChecklists = [];
		$scope.collaboratingOn = [];
		
		$scope.init = function(){
		    $scope.getFavorite();
		    $scope.getMyChecklist();
		    $scope.getLastVisited();
		    $scope.getLastAdded();
			$scope.getCollaboratingOn();
		};
		
		$scope.getFavorite = function(){
			$http.get("dashboard/topFavorite", $scope.user).success(function(result){
				if(result != undefined && result.favorites != undefined)
				{
					$scope.favorites = result.favorites;	
				}
			});
		};
		
		$scope.getMyChecklist = function(){
			$http.get("dashboard/myChecklists", $scope.user).success(function(result){
				$scope.myChecklists = result;
			});
		};
		
		$scope.getLastVisited = function(){
			$http.get("dashboard/lastVisited", $scope.user).success(function(result){
				$scope.visitedChecklists = result;
			});
		};
		
		$scope.getLastAdded = function(){
			$http.get("dashboard/lastAdded", $scope.user).success(function(result){
				$scope.addedChecklists = result;
			});
		};

		$scope.getCollaboratingOn = function () {
			$http.get("dashboard/collaboratingOn", $scope.user).success(function(result){
				$scope.collaboratingOn = result;
			});
		}
	}
]);
