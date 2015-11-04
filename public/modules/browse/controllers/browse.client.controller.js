'use strict';

// Categories controller
angular.module('browse').controller('BrowseController', ['$scope', '$stateParams', '$location', 'Authentication', 'Checklists', 'Categories', 'lodash',
	function($scope, $stateParams, $location, Authentication, Checklists, Categories, lodash) {
		
		$scope.authentication = Authentication,
			$scope.catChecklists = [],
			$scope.filteredChecklists = [],
			$scope.currentPage = 0,
			$scope.numPerPage = 10,
			$scope.maxSize = 10;
			$scope.totalItems = 0;

		var updatePaging = function(){
			var begin = (($scope.currentPage - 1) * $scope.numPerPage)
				, end = begin + $scope.numPerPage;
			$scope.filteredChecklists = $scope.catChecklists.slice(begin, end);
		};

		var searchInTree = function searchTree(element, id){
			if(element._id == id){
				return element;
			}else if (element.children != null){
				var result = null;
				for(var i=0; result == null && i < element.children.length; i++){
					result = searchTree(element.children[i], id);
				}
				return result;
			}
			return null;
		}
		
		// Find a list of Categories
		$scope.find = function() {
			$scope.categories = Categories.tree.query();

			$scope.checklists = Checklists.browse();
			$scope.checklists.$promise.then(function(data){
				$scope.catChecklists = $scope.checklists;
				if($stateParams.categoryId){
					$scope.selectCategory($stateParams.categoryId);
				}else{
					$scope.currentPage = 1;
				}
			});
		};

	    $scope.selectCategory = function(id){

			$scope.catChecklists = lodash.filter( $scope.checklists, function(checklist){
				if(!checklist.category) return false;
				if(checklist.category._id == id){
					return true;
				}else{
					var cat = searchInTree($scope.categories[0], id);
					var cat = searchInTree(cat, checklist.category._id);
					if(cat) return true;
				}
				return false;
			});
			$scope.currentPage = 1;

			updatePaging();
	    }
	    
	    $scope.$watch('currentPage + numPerPage', function() {
			updatePaging();
		});

		$scope.$watch('filteredChecklists', function() {
			$scope.totalItems = $scope.catChecklists.length;
		});

		$scope.toggle = function(scope) {
			scope.toggle();
		};
	}
]);
