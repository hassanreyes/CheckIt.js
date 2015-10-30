'use strict';

// Configuring the Browse module
angular.module('browse').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		//menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position
		Menus.addMenuItem('topbar', 'Browse', 'browse', 'item', 'browse', true);
	}
]);