'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$window', '$location', '$state', 'Authentication', 'Menus', 'Checklists',
	function($scope, $window, $location, $state, Authentication, Menus, Checklists) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');
		
		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});
		
		$scope.search = function(txt){
			$location.path('search').search('query', txt);
		};
		
		$scope.goto = function(to){
			$state.go('home');	
		};
		
		
		
		
		$scope.getWidth = function() {
	        //return angular.element("#sidebar").width();
	    };
	    $scope.$watch($scope.getWidth, function(newValue, oldValue) {
	        //$scope.boxWidth = newValue / 10;
	        //$scope.activeWindow2 = true;
	    });
	    window.onresize = function(){
	        //$scope.$apply();
	    };
	}
]);