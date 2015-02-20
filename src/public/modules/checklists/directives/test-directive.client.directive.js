'use strict';

angular.module('checklists').directive('testDirective', [
	function() {
		return {
			template: '<div></div>',
			restrict: 'E',
			link: function postLink(scope, element, attrs) {
				// Test directive directive logic
				// ...

				element.text('this is the testDirective directive');
			}
		};
	}
]);