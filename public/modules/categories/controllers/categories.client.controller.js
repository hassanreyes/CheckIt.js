'use strict';

// Categories controller
angular.module('categories').controller('CategoriesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Categories',
	function($scope, $stateParams, $location, Authentication, Categories) {
		$scope.authentication = Authentication;
		
		$scope.parentCats = [];
		$scope.selectedParentCat = {};
		
		$scope.initialize = function(){
			Categories.crud.query(function(cats){
				$scope.parentCats = [{id : 'none', name : 'None', selected : true }];
				for(var i = 0; i < cats.length; i++){
					$scope.parentCats.push({ id : cats[i]._id, name : cats[i].name, selected : false });
				}
			});
		};

		// Create new Category
		$scope.create = function() {
			
			var category = new Categories({
				name : $scope.name,
				parent :  $scope.selectedParentCat.selected === undefined ? undefined : $scope.selectedParentCat.selected.id,
			});
			
			// Redirect after save
			category.$save(function(response) {
				$location.path('categories/' + response._id);
				
				// Clear form fields
				$scope.name = '';
				}, function(errorResponse) {
					$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Category
		$scope.remove = function(category) {
			if ( category ) { 
				category.$remove();

				for (var i in $scope.categories) {
					if ($scope.categories [i] === category) {
						$scope.categories.splice(i, 1);
					}
				}
			} else {
				$scope.category.$remove(function() {
					$location.path('categories');
				});
			}
		};

		// Update existing Category
		$scope.update = function() {
			var category = $scope.category;

			category.$update(function() {
				$location.path('categories/' + category._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Categories
		$scope.find = function() {
			$scope.categories = Categories.crud.query();
		};

		// Find existing Category
		$scope.findOne = function() {
			$scope.category = Categories.crud.get({ 
				categoryId: $stateParams.categoryId
			});
		};
	}
]);