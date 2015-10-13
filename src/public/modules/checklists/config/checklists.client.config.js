'use strict';

// Configuring the Articles module
angular.module('checklists').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		//menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position
		Menus.addMenuItem('topbar', 'Checklists', 'checklists', 'dropdown', '/checklists(/create)?', false);
		Menus.addSubMenuItem('topbar', 'checklists', 'My Checklists', 'checklists');
		Menus.addSubMenuItem('topbar', 'checklists', 'New Checklist', 'checklists/create');
		Menus.addSubMenuItem('topbar', 'checklists', 'Upload', 'checklists/upload');
	}
]);