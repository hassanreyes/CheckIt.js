'use strict';

angular.module('checklists').service('CheckItModals', ['$modal',

	function($modal) {
	    
	    this.dismissChecklistModal = function(chklst, next){
			var modal = $modal.open({
				animation: true,
				templateUrl: '/modules/checklists/views/modals/dismiss-modal-checklist.client.view.html',
				controller: 'ChecklistsDismissModalController',
				size: 'sm',
				resolve: {
					item : function(){
						return chklst;
					}
				}
			});
			
			modal.result.then(function(checklist){
				if(checklist != undefined){
					next(checklist);
				}
			});
		};
		
		this.removeChecklistModal = function(chklst, next){
			var modal = $modal.open({
				animation: true,
				templateUrl: '/modules/checklists/views/modals/remove-modal-checklist.client.view.html',
				controller: 'ChecklistsRemoveModalController',
				size: 'sm',
				resolve: {
					item : function(){
						return chklst;
					}
				}
			});
			
			modal.result.then(function(checklist){
				if(checklist != undefined){
					next(checklist);
				}
			});
		};

		this.collaboratorsModal = function (chklst, next) {
			var modal = $modal.open({
				animation: true,
				templateUrl: '/modules/checklists/views/modals/collaborators-modal-checklist.client.view.html',
				controller: 'ChecklistsCollabModalController',
				size: 'md',
				resolve: {
					item : function(){
						return chklst;
					}
				}
			});

			modal.result.then(function(checklist){
				if(checklist != undefined){
					next(checklist);
				}
			});
		}
		
		return {
		    dismissChecklistModal : this.dismissChecklistModal,
		    removeChecklistModal : this.removeChecklistModal,
			collaboratorsModal : this.collaboratorsModal
		};
	    
	}
]);
