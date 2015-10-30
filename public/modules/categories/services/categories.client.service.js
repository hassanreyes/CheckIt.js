'use strict';

//Categories service used to communicate Categories REST endpoints
angular.module('categories').factory('Categories', ['$resource',
	function($resource) {
		return {
			crud: $resource('categories/:categoryId', { categoryId: '@_id' }, {
				update: {
					method: 'PUT'
				}
			}),
			tree: $resource('categories-tree', { }, {
				
			})
		};
	}
]);