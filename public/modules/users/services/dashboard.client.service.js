'use strict';

/** Dashboard services  **/
angular.module('users').factory('Dashboard', ['$resource',
	function($resource) {
		return $resource('history', {}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
