'use strict';

// Checklists controller
angular.module('checklists').controller('WorkingChecklistsController', ['$scope', '$rootScope', '$stateParams', '$location', '$state', 'Authentication', 'Checklists', 'Catalogs', 'Users', 'Parser', 'WorkingChecklist', '$http', '$modal', 
	function($scope, $rootScope, $stateParams, $location, $state, Authentication, Checklists, Catalogs, Users, Parser, WorkingChecklist, $http, $modal) {
		$scope.authentication = Authentication;
		$scope.user = Authentication.user;
		
		$scope.categories = [];
		$scope.category = {};
		
		$rootScope.$watch('user', function () {
			$scope.user = $rootScope.user;
		}, true);
		
		
		$scope.init = function(){
            //Loads categories
            $scope.categories = $rootScope.categories;
            //Retreive working checklist from server
            $http.get('/users/me', $scope.user).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.success = true;
                $scope.user = Authentication.user = response;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
		
		/**
		 * Creates a very new checklist (clear id)
		 * Alert the user to save changes or dismiss
		 **/
		$scope.new = function(){
			
		};
		
		/**
		 * If the checklist has an id, updates otherwise create a new checklist
		 **/
		$scope.save = function(){
			
		};
		
		/**
		 * call the text edition page
		 * */
		$scope.edit = function(){
			
		};
		
		$scope.categorySelected = function($item, $model){
			$scope.user.workingOn.category = $scope.category.id;
		};
		
		/**
		 * 
		 * */
		$scope.removeSection = function(secIdx){
			
		};
		
		/**
		 * 
		 * */
		$scope.removeItem = function(sec, itemIdx){
			
		};
	}
]);