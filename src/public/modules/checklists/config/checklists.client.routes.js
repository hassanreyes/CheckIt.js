'use strict';

//Setting up route
angular.module('checklists').config(['$stateProvider',
	function($stateProvider) {
		// Checklists state routing
		$stateProvider.
		state('listChecklists', {
			url: '/checklists',
			templateUrl: 'modules/checklists/views/list-checklists.client.view.html'
		}).
		state('createChecklist', {
			url: '/checklists/create',
			templateUrl: 'modules/checklists/views/create-checklist.client.view.html'
		}).
		state('uploadChecklist', {
			url: '/checklists/upload',
			templateUrl: 'modules/checklists/views/upload-checklist.client.view.html'
		}).
		state('viewChecklist', {
			url: '/checklists/:checklistId',
			templateUrl: 'modules/checklists/views/view-checklist.client.view.html'
		}).
		state('editChecklist', {
			url: '/checklists/:checklistId/edit',
			templateUrl: 'modules/checklists/views/edit-checklist.client.view.html'
		}).
		state('search', {
			url: '/search?query',
			templateUrl: 'modules/checklists/views/result-search.client.view.html',
			realoadOnSearch: true
		});
	}
]);