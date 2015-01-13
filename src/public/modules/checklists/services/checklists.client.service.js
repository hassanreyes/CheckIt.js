'use strict';

//Checklists service used to communicate Checklists REST endpoints
angular.module('checklists').factory('Checklists', ['$resource',
	function($resource) {
		return $resource('checklists/:checklistId', { checklistId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);