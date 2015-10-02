'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$window', '$location', 'Authentication', 'Menus', 'Checklists',
	function($scope, $window, $location, Authentication, Menus, Checklists) {
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
	}
]);