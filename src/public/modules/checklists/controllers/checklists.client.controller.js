'use strict';

// Checklists controller
angular.module('checklists').controller('ChecklistsController', ['$scope', '$rootScope', '$stateParams', '$location', 'Authentication', 'Checklists', '$upload', 'Parser', '$window',
	function($scope, $rootScope, $stateParams, $location, Authentication, Checklists, $upload, Parser, $window) {
		$scope.authentication = Authentication;

		$scope.initialize = function() {
			if(!$rootScope.checklist){
				var checklist = new Checklists ({
					name: this.name,
					sections : []
				});
				$scope.checklist = checklist;
			}
		};
		
		// Create new Checklist
		$scope.create = function() {
			// Redirect after save
			$scope.checklist.$save(function(response) {
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
			var checklist = $scope.checklist;

			checklist.$update(function() {
				$location.path('checklists/' + checklist._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Checklists
		$scope.find = function() {
			$scope.checklists = Checklists.query();
		};

		// Find existing Checklist
		$scope.findOne = function() {
			$scope.checklist = Checklists.get({ 
				checklistId: $stateParams.checklistId
			});
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
					$rootScope.checklist = Parser.parse(reader.result);
					//$window.location.href = "#/checklists/create";
					$scope.$apply(function(){
						$location.path('/checklists/create');
					});
				}
				reader.readAsText(file);
			}
		};
		
		$scope.focusElement = "Title";
		
		// Checklist Edition
		$scope.onKeyDown = function(event){
			//necesario para que funcione onTitleKeyDown
		};
		
		//Title KeyDown
		$scope.onTitleKeyDown = function(event){
			if(event.keyCode == 13){
				if($scope.checklist.sections.length == 0)
				{
					$scope.checklist.sections.push({ name : "", items : [] });
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
					$scope.secFocusIndex = $scope.checklist.sections.indexOf(section);
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
		
		//Item KeyDown
		$scope.lastKeyPress = 0;
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
					$scope.checklist.sections.push({ name : "", items : [] });
					$scope.focusElement = "SectionName";
					$scope.secFocusIndex = $scope.checklist.sections.length-1;
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
					$scope.secFocusIndex = $scope.checklist.sections.indexOf(section);
				}else{
					$scope.focusElement = "Item";
				}
			}
			$scope.lastKeyPress = event.keyCode;
		};
		
		$scope.createSection = function()
		{
			$scope.checklist.sections.push({ name : "", items : [] });
		}
		
		$scope.createItem = function(section)
		{
			section.items.push({ name : "" });
		}
	}
]);
