'use strict';

// Checklists controller
angular.module('checklists').controller('ChecklistsController', ['$scope', '$rootScope', '$stateParams', '$location', '$state', 'Authentication', 'Checklists', 'Categories', 'History', '$upload', 'Parser', 'Search', '$http', 'CheckItModals', 'WorkingOnService', '$window',
	function($scope, $rootScope, $stateParams, $location, $state, Authentication, Checklists, Categories, History, $upload, Parser, Search, $http, CheckItModals, WorkingOnService, $window) {
		$scope.authentication = Authentication;
		$scope.user = Authentication.user;
		$scope.WorkingOnService = WorkingOnService;
		$scope.workingOnChecklist = WorkingOnService.checklist;

		$scope.categories = [];
		
		$scope.checklist = {};
		//Paging
		$scope.filteredChecklists = [],
		$scope.currentPage = 1,
		$scope.numPerPage = 10,
		$scope.maxSize = 10;
		
		// $rootScope.$watch('user', function () {
		// 	$scope.workingOn = $rootScope.user.workingOn.checklist;
		// }, true);
		
		$scope.$watch('WorkingOnService.getChecklist()', function(newVal, oldVal, scope) {
		    $scope.workingOnChecklist = WorkingOnService.getChecklist();
		}, true);
		
		$scope.$watch('currentPage + numPerPage', function() {
			if($scope.checklists){
				var begin = (($scope.currentPage - 1) * $scope.numPerPage)
			    , end = begin + $scope.numPerPage;
			    
			    $scope.filteredChecklists = $scope.checklists.slice(begin, end);	
			}
	  	});
		
		
		$scope.categorySelected = function($item, $model){
			$scope.workingOn.category = $scope.category.id;
		};
		
		$scope.edit = function(checklist){
			WorkingOnService.edit(checklist._id, function(){
				if(WorkingOnService.getChecklist().id == checklist._id)	{
					$window.location.href = "/#!/workingOn";
				}
			});
		};
		
		
		$scope.findFavorites = function() {
			$http.get("dashboard/topFavorite", $scope.user).success(function(result){
				if(result != undefined && result.favorites != undefined)
				{
					$scope.checklists = result.favorites;	
					$scope.filteredChecklists = $scope.checklists.slice(0, $scope.numPerPage);
				}
			});
		};

		// Find a list of Checklists
		$scope.find = function() {
			$scope.checklists = Checklists.query();
			$scope.checklists.$promise.then(function(data){
			    $scope.filteredChecklists = $scope.checklists.slice(0, $scope.numPerPage);	
			});
		};

		// Find existing Checklist
		$scope.findOne = function() {
			
			$scope.workingOn = $rootScope.user.workingOn.checklist;
			
			Checklists.get({ 
				checklistId: $stateParams.checklistId
				}, function(checklist){
					$scope.checklist = checklist;
					
					//Update history; count visits
					var hist = new History({userId: $scope.user._id, checklistId: $scope.checklist._id});
					hist.$update();
					
				}, function(errResp){
					//Nothing to do	
			});
			
		};
		
		/**
		 * Search in the checklsit catalog
		 * */
		$scope.search = function(){
			
			var search = $location.search();
			$scope.searchQuery = search.query;
			
			Search.search({query : search.query}, function(searchResult){
				var checklists = [];
				for(var i = 0; i < searchResult.results.length; i++)
				{
					checklists[i] = searchResult.results[i].obj;
				}
				$scope.checklists = checklists;
				$scope.filteredChecklists = $scope.checklists.slice(0, $scope.numPerPage);
			});
		};
		
		/**
		 * 
		 * */
		$scope.printDiv = function(divName) {
	  		var printContents = document.getElementById(divName).innerHTML;
	  		var popupWin = window.open('', '_blank', 'width=1024,height=768');
	  		popupWin.document.open();
	  		popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="/modules/checklists/css/mychecklist.css" /></head><body onload="window.print()">' + printContents + '</html>');
	  		popupWin.document.close();
		};
	  	
	  	/**
	  	 * Favorite handling code
	  	 * */
	  	$scope.favorite = {
	  		/** Removes the given checklist to user's favorites */
	  		addFavorites : function(checklist){
		  		if($scope.user.favorites === undefined){
		  			$scope.user.favorites = [];
		  		}
		  		
		  		$scope.user.favorites.push(checklist._id);
		  		
		  		$http.put('/users', $scope.user).success(function(response) {
		  			Authentication.user = response;
				}).error(function(response) {
					//$scope.user.favorites.pop();
					//$scope.error = response.data.message;
				});
		  	},
		  	/** Removes the given checklist form user's favorites */
	  		removeFavorites : function(checklist){
	  			if($scope.user.favorites){
	  				var index = $scope.user.favorites.indexOf(checklist._id);
	  				if(index >= 0)
	  				{
		  				$scope.user.favorites.splice(index, 1);
			  			if($scope.user.favorites.length == 0)
			  			{
			  				$scope.user.favorites = undefined;
			  			}
			  			
			  			$http.put('/users', $scope.user).success(function(response) {
			  				Authentication.user = response;
						}).error(function(response) {
							//$scope.user.favorites.pop();
							//$scope.error = response.data.message;
						});	
	  				}
		  		}
		  	},
		  	/** Check if the givem checklist is in the user's favorites */
		  	isFavorite : function(checklist){
		  		if($scope.user.favorites === undefined)
		  		{
		  			return false;
		  		}
		  		return $scope.user.favorites.indexOf(checklist._id) >= 0;
		  	}
		  	
	  	};

		
		/***************************************************************************************************************************/
		/******* View Options *************/
		$scope.addItemTo = function(checklist, item, secIdx){
			 $scope.workingOnChecklist.sections[secIdx].items.push({ content: item.content });
			//propagate update
			WorkingOnService.update($scope.workingOnChecklist); 
			 //Update history; count visits
			 var hist = new History({userId: $scope.user._id, checklistId: checklist._id, using: true});
			 hist.$update();
		};
		
		$scope.addSectionTo = function(checklist, sec){
			var section = { name: sec.name, description: sec.description, items: [] };
			for(var i = 0; i < sec.items.length; i++)
			{
				section.items.push({ content: sec.items[i].content });
			}
			//update local copy
			$scope.workingOnChecklist.sections.push(section);
			//propagate update
			WorkingOnService.update($scope.workingOnChecklist);
			//Update history; count visits
			 var hist = new History({userId: $scope.user._id, checklistId: checklist._id, using: true});
			 hist.$update();
		};
		
	}
]);
