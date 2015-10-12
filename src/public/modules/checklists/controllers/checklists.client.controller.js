'use strict';

// Checklists controller
angular.module('checklists').controller('ChecklistsController', ['$scope', '$rootScope', '$stateParams', '$location', '$state', 'Authentication', 'Checklists', 'Categories', 'History', '$upload', 'Parser', 'WorkingChecklist', 'Search', '$http',
	function($scope, $rootScope, $stateParams, $location, $state, Authentication, Checklists, Categories, History, $upload, Parser, WorkingChecklist, Search, $http) {
		$scope.authentication = Authentication;
		$scope.user = Authentication.user;

		$scope.categories = [];
		$scope.category = WorkingChecklist.currentCategory();
		$scope.checklist = {};
		$scope.workingOn = WorkingChecklist.currentChecklist();
		$scope.treeOptions = { };
		
		$scope.filteredChecklists = [],
		$scope.currentPage = 1,
		$scope.numPerPage = 10,
		$scope.maxSize = 10;
		
		$scope.initialize = function(){
			//if comes from a new checklist menu
			if($rootScope.workingOn == undefined){
				$scope.clear();
			}
			else
			{
				//it comes from a uploaded file
				$rootScope.workingOn = null;	
			}
		}
		
		var updateControllerChecklist = function(){
			$scope.workingOn = WorkingChecklist.currentChecklist();
		}
		
		WorkingChecklist.registerObserverCallback(updateControllerChecklist);
		
		$scope.loadCategories = function(){
			Categories.crud.query(function(cats){
				for(var i = 0; i < cats.length; i++){
					$scope.categories.push({ id : cats[i]._id, name : cats[i].name, selected : false });
				}
			});
			
			if($rootScope.workingOn != undefined){
				$scope.workingOn = $rootScope.workingOn;
			}
		};
		
		$scope.categorySelected = function($item, $model){
			$scope.workingOn.category = $scope.category.id;
		};
		
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
			});
		};
		
		$scope.clear = function(){
			WorkingChecklist.clear();
		};
		
		// Create new Checklist
		$scope.create = function() {
			
			if($scope.category.id === undefined){
				$scope.error = 'Category is required';
				return;
			}

			$scope.workingOn.category = $scope.category.id;
			
			//Validate, remove empty sections or items
			if(!$scope.workingOn.sections || $scope.workingOn.sections.length > 0){
				var sec = $scope.workingOn.sections[$scope.workingOn.sections.length - 1];
				if(sec.name == ''){
					$scope.workingOn.sections.pop();
				} else {
					if(sec.items){
						var item = sec.items[sec.items.length - 1];
						if(item.content == undefined || item.content == ''){
							sec.items.pop();
						}
					}	
				}
			}
			
			// Redirect after save
			$scope.workingOn.$save(function(response) {
				$location.path('checklists/' + response._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Checklist
		$scope.remove = function(checklist) {
			if ( checklist ) { 
				checklist.$remove();

				for (var i in $scope.checklists) {
					if ($scope.checklists [i] === checklist) {
						$scope.checklists.splice(i, 1);
					}
				}
			} else {
				$scope.checklist.$remove(function() {
					$location.path('checklists');
				});
			}
		};

		// Update existing Checklist
		$scope.update = function() {
			var checklist = $scope.workingOn;

			checklist.$update(function() {
				$location.path('checklists/' + checklist._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
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
		
		$scope.new = function(){
			WorkingChecklist.clear();
			$scope.workingOn = WorkingChecklist.currentChecklist();
		};
		
		$scope.edit = function(){
			var checklist = Checklists.get({ 
				checklistId: $stateParams.checklistId
			});	
			
			WorkingChecklist.setCurrentChecklist(checklist);	
		};
		
		$scope.editNew = function(){
			$rootScope.workingOn = WorkingChecklist.checklist;
			$state.transitionTo('create');
		};
		
		// Upload a checklist
		$scope.$watch('files', function () {
			$scope.upload($scope.files);
		});

		$scope.upload = function (files) {
			if (files && files.length) {
				var file = files[0];
				var reader = new FileReader();
				reader.onload = function(e) {
					$rootScope.workingOn = Parser.parse(reader.result);
					//$window.location.href = "#/checklists/create";
					$scope.$apply(function(){
						$location.path('/checklists/create');
					});
				}
				reader.readAsText(file);
			}
		};
		
		$scope.printDiv = function(divName) {
	  		var printContents = document.getElementById(divName).innerHTML;
	  		var popupWin = window.open('', '_blank', 'width=1024,height=768');
	  		popupWin.document.open();
	  		popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="/modules/checklists/css/mychecklist.css" /></head><body onload="window.print()">' + printContents + '</html>');
	  		popupWin.document.close();
		} 
		
		$scope.$watch('currentPage + numPerPage', function() {
			if($scope.checklists){
				var begin = (($scope.currentPage - 1) * $scope.numPerPage)
			    , end = begin + $scope.numPerPage;
			    
			    $scope.filteredChecklists = $scope.checklists.slice(begin, end);	
			}
	  	});
	  	
	  	$scope.addFavorites = function(checklist){
	  		if($scope.user.favorites === undefined){
	  			$scope.user.favorites = [];
	  		}
	  		
	  		$scope.user.favorites.push(checklist._id);
	  		
	  		$http.put('/users', $scope.user).success(function(response) {
				//OK
			}).error(function(response) {
				//$scope.user.favorites.pop();
				//$scope.error = response.data.message;
			});
	  	};
	  	
	  	$scope.removeFavorites = function(checklist){
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
						//OK
					}).error(function(response) {
						//$scope.user.favorites.pop();
						//$scope.error = response.data.message;
					});	
  				}
	  		}
	  	};
	  	
	  	$scope.isFavorite = function(checklist){
	  		if($scope.user.favorites === undefined)
	  		{
	  			return false;
	  		}
	  		return $scope.user.favorites.indexOf(checklist._id) >= 0;
	  	};
		
		/******* View Options *************/
		$scope.addItemTo = function(checklist, item, secIdx){
			 $scope.workingOn.sections[secIdx].items.push({ content: item.content });
			 
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
			$scope.workingOn.sections.push(section);
			
			//Update history; count visits
			 var hist = new History({userId: $scope.user._id, checklistId: checklist._id, using: true});
			 hist.$update();
		};
		
		$scope.removeItem = function(section, itemIdx){
			WorkingChecklist.removeItem(section, itemIdx);
		};
		
		$scope.removeSection = function(secIdx){
			WorkingChecklist.removeSection(secIdx);
		};
		
		/******* Checklist Edition ********/
		$scope.focusElement = "Title";
		$scope.lastKeyPress = 0;
		
		$scope.onKeyDown = function(event){
			//necesario para que funcione onTitleKeyDown
		};
		
		//Title KeyDown
		$scope.onTitleKeyDown = function(event){
			if(event.keyCode == 13){
				if($scope.workingOn.sections.length == 0)
				{
					$scope.workingOn.sections.push({ name : "", items : [] });
				}
				
				$scope.focusElement = "SectionName";
				$scope.secFocusIndex = 0;
			}
		};
		
		//Section KeyPress
		$scope.onSectionKeyPress = function(event, section){
			if(event.keyCode == 13){
				if(section.name != "")
				{
					$scope.focusElement = "SectionDesc";
					$scope.secFocusIndex = $scope.workingOn.sections.indexOf(section);
				}
			}
		};
		
		//Section KeyDown
		$scope.onSectionKeyDown = function(event, section, idx){
			if(event.keyCode == 8) {
				if((section.name == undefined 
				|| section.name.trim().replace(/(\r\n|\n|\r)/gm,"") == "") 
				&& section.items){
					var idx = $scope.workingOn.sections.indexOf(section);
					$scope.workingOn.sections.splice(idx,1);
					event.preventDefault();
					var jumpTo = idx-1;
					$scope.secFocusIndex = jumpTo;
					if($scope.secFocusIndex == -1){
						$scope.focusElement = "Title";
						$scope.secFocusIndex = 0;
					}else{
						if($scope.workingOn.sections[$scope.secFocusIndex].items){
							jumpTo = $scope.workingOn.sections[$scope.secFocusIndex].items.length - 1;
							$scope.itemFocusIndex = jumpTo;
							if($scope.itemFocusIndex == -1){
								$scope.focusElement = "SectionDesc";
							}else{
								$scope.focusElement = "Item";
							}
						}
					}
				}
			}	
		};
		
		//Section Desc KeyPress
		$scope.onSectionDescKeyPress = function(event, section){
			if(event.keyCode == 13){
				if(section.items == undefined){
					section.items = [];
				}
				if(section.items.length == 0){
					section.items.push({ content : null });
				}
				$scope.focusElement = "Item";
				$scope.itemFocusIndex = section.items.length-1;
			}
		};
		
		//Section Desc KeyDown
		$scope.onSectionDescKeyDown = function(event, section, idx){
			if(event.keyCode == 8) {
				if((section.description == undefined 
				|| section.description.trim().replace(/(\r\n|\n|\r)/gm,"") == "")){
					$scope.focusElement = "SectionName";
					$scope.secFocusIndex = idx;
				}
			}	
		};
		
		//Item KeyDown
		$scope.onItemKeyDown = function(event, section, item, idx){
			var jumpTo = idx;
			if($scope.lastKeyPress == 13 && event.keyCode == 13){
				if(item.content != null && item.content != undefined 
					&& item.content.trim().replace(/(\r\n|\n|\r)/gm,"") != ""){
					if(idx == section.items.length-1){
						//jump to a new item
						section.items.push({ content : '' });	
						jumpTo = section.items.length-1;
					}
					else{
						//jump to next item
						jumpTo = idx + 1;
					}
					event.preventDefault();

					$scope.focusElement = "Item";
					$scope.itemFocusIndex = jumpTo;
				}
				else
				{
					//Jump to a new Section
					section.items.pop();
					$scope.workingOn.sections.push({ name : "", items : [] });
					$scope.focusElement = "SectionName";
					$scope.secFocusIndex = $scope.workingOn.sections.length-1;
				}
			}
			else if(event.keyCode == 8) {
				if(item.content == null || item.content == undefined 
					|| item.content.trim().replace(/(\r\n|\n|\r)/gm,"") == ""){
					section.items.splice(idx,1);
					event.preventDefault();
					jumpTo = idx-1;
				}
				$scope.itemFocusIndex = jumpTo;
				if($scope.itemFocusIndex == -1){
					$scope.focusElement = "SectionDesc";
					$scope.secFocusIndex = $scope.workingOn.sections.indexOf(section);
				}else{
					$scope.focusElement = "Item";
				}
			}
			$scope.lastKeyPress = event.keyCode;
		};
		
	}
]);
