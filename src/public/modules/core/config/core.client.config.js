'use strict';

// Configuring the Core module
angular.module('core').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		//menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position
		Menus.addMenuItem('topbar', 'Learn', 'learn', 'item', 'learn', true);
	}
]);