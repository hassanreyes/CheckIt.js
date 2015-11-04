'use strict';

// Categories controller
angular.module('browse').controller('BrowseController', ['$scope', '$stateParams', '$location', 'Authentication', 'Checklists', 'Categories', '$timeout',
	function($scope, $stateParams, $location, Authentication, Checklists, Categories, $timeout) {
		
		$scope.authentication = Authentication,
		$scope.filteredChecklists = [],
		$scope.currentPage = 1,
		$scope.numPerPage = 10,
		$scope.maxSize = 10;
		$scope.totalItems = 0;

		//$scope.selectedCategory = undefined;
		//$scope.search = $scope.selectedCategory;

		var updatePaging = function(){
			var begin = (($scope.currentPage - 1) * $scope.numPerPage)
				, end = begin + $scope.numPerPage;
			$scope.filteredChecklists = $scope.checklists.slice(begin, end);
		};
		
		// Find a list of Categories
		$scope.find = function() {
			$scope.categories = Categories.tree.query();
			$scope.checklists = Checklists.browse();
			$scope.checklists.$promise.then(function(data){
			    $scope.filteredChecklists = $scope.checklists.slice(0, $scope.numPerPage);
			});
		};
		
		$scope.findCategory = function() {
			$scope.find();
			$scope.selectedCategory = $stateParams.categoryId;
		};
		
		$scope.toggle = function(scope) {
	      scope.toggle();
	    };
	    
	    $scope.selectCategory = function(id){
	    	$scope.selectedCategory = id;
			updatePaging();
	    	//$scope.search = id;
	    }
	    
	    $scope.$watch('currentPage + numPerPage', function() {
			updatePaging();
		});

		$scope.$watch('filteredChecklists', function() {
			$scope.totalItems = $scope.filteredChecklists.length;
		});
	
		//$timeout(function() {
		//  // https://github.com/JimLiu/angular-ui-tree/issues/292
		//  var treeElement = angular.element(document.querySelector('#CategoriesTree'));
		//  if (treeElement) {
		//    var treeScope = (typeof treeElement.scope === 'function') ? treeElement.scope() : undefined;
		//    if (treeScope && typeof treeScope.$$childHead.collapseAll === 'function') {
		//      treeScope.$$childHead.collapseAll();
		//    }
		//    //treeElement.show();
		//  }
		//}, 200);
	}
]);
