'use strict';

// Configuring the Core module
angular.module('core').run(['Menus', '$rootScope', 'Categories', 'Authentication',
	function(Menus, $rootScope, Categories, Authentication) {
		// Set top bar menu items
		//menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position
		Menus.addMenuItem('topbar', 'Learn', 'learn', 'item', 'learn', true);
		
		//Setup user as a global variable
		$rootScope.user = Authentication.user;
		
		var updateUser = function(user){
			Authentication.user = user;
		};
		
		var updateCatalogs = function(){
			//Initialize catalogs on $rootScope
			Categories.crud.query(function(cats){
				$rootScope.categories = cats;
			});	
		};
		
		//Watch for a change of the global user
		$rootScope.$watch('user', function () {
			updateUser($rootScope.user);
		}, true);
		
		updateCatalogs();
		
	}
]);