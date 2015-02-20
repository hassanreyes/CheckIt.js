'use strict';

// Configuring the Articles module
angular.module('checklists').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Checklists', 'checklists', 'dropdown', '/checklists(/create)?');
		Menus.addSubMenuItem('topbar', 'checklists', 'My Checklists', 'checklists');
		Menus.addSubMenuItem('topbar', 'checklists', 'New Checklist', 'checklists/create');
		Menus.addSubMenuItem('topbar', 'checklists', 'Upload', 'checklists/upload');
	}
]);