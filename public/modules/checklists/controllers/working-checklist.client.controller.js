'use strict';

// Checklists controller
angular.module('checklists').controller('WorkingChecklistsController', ['$scope', '$rootScope', '$stateParams', '$location', '$state', 'Authentication', 'Checklists', 'Catalogs', 'Users', 'Parser', '$http', '$modal', 'WorkingOnService', '$window', 'CheckItModals', 
	function($scope, $rootScope, $stateParams, $location, $state, Authentication, Checklists, Catalogs, Users, Parser, $http, $modal, WorkingOnService, $window, CheckItModals) {
		$scope.WorkingOnService = WorkingOnService;
		$scope.authentication = Authentication;
		$scope.user = Authentication.user;
		
		$scope.errors = [];
		$scope.categories = [];
		$scope.category = {};
		
		$scope.checklist = WorkingOnService.getChecklist();
		
		$scope.$on('$destroy', function(){
			WorkingOnService.unRegisterObserver(updateChecklist);
		});
		
		$scope.$watch('WorkingOnService.isReady()', function(newVal, oldVal, scope){
			var idx = $scope.errors.indexOf('notReady');
			if(WorkingOnService.isReady()){
				if(idx !== -1){
					$scope.errors['notReady'] = "Sync error, server not ready or user not logged-in";
				}
			}else{
				if(idx === -1){
					$scope.errors.splice(idx, 1);
				}
			}
		});
		
		//Update the local copy of the working on checklist
		var updateChecklist = function(checklist){
			//$scope.$apply(function(){
				$scope.checklist = checklist;
				if($scope.checklist.category){
	            	if($scope.checklist.category.id){
	            		$scope.category = $scope.checklist.category;
	            	}else{
	            		$scope.categories.forEach(function(item){
	            			if(item._id == $scope.checklist.category){
	            				$scope.category = item;
	            			}
	            		});
	            	}
	            }
			//});
		};
		
		$scope.init = function(){
			
			var continueInit = function(){
				//Loads categories
	            $scope.categories = $rootScope.categories;
	            if($scope.categories.length > 0){
	            	$scope.category = $scope.categories[0];
	            }
	            //Register to WorkingOnChecklist service as observer in order to sync
	            WorkingOnService.registerObserver(updateChecklist);
	            $scope.checklist = WorkingOnService.getChecklist();
	            if($scope.checklist.category){
	            	if($scope.checklist.category.id){
	            		$scope.category = $scope.checklist.category;
	            	}else{
	            		$scope.categories.forEach(function(item){
	            			if(item._id == $scope.checklist.category){
	            				$scope.category = item;
	            			}
	            		});
	            	}
	            }
			};
			
			//check if comes from Create New menu
			var createPath = '/create';
			var path = $location.path();
			var fromIdx = path.length - createPath.length;
			if(fromIdx > 0){
				if(path.indexOf(createPath, fromIdx) !== -1){
					//if working on is not empty
					if($scope.checklist.sections && $scope.checklist.sections.length > 0){
						CheckItModals.dismissChecklistModal($scope.checklist, function(){
							//barnd new checklist on screen
							continueInit();
		                	$scope.new();
		                	return;
	                    });	
					}
				}
			}
			
			continueInit();
		};
		
		/**
		 * Creates a very new checklist (clear id)
		 * Alert the user to save changes or dismiss
		 **/
		$scope.new = function(){
			WorkingOnService.create(function(){
				if($window.location.href != '/#!/workingOn'){
					$window.location.href = '/#!/workingOn';
				}
			});
		};
		
		/**
		 * If the checklist has an id, updates otherwise create a new checklist
		 **/
		$scope.save = function(){
			if(!WorkingOnService.getChecklist().category){
				$scope.errors.push("Category requierd. Please select a category");
				return;
			}
			
			WorkingOnService.save(function(error, checklist){
				if(error){
					$scope.errors.push(error);
				}else{
					$window.location.href = "/#!/checklists/" + checklist._id;
				}
			});
		};
		
		/**
		 * call the text edition page
		 * */
		$scope.edit = function(){
			
			//$state.transitionTo('newEditChecklist');//$state.go('newEditChecklist');
			$window.location.href = "/#!/workingOn";
			
		};
		
		$scope.categorySelected = function($item, $model){
			$scope.checklist.category = $item._id;
			$scope.category = $item;
			//Update global checklist
			WorkingOnService.update($scope.checklist);
		};
		
		/**
		 * 
		 * */
		$scope.removeSection = function(checklist, secIdx){
			if($scope.checklist.sections && $scope.checklist.sections.length >= secIdx){
				$scope.checklist.sections.splice(secIdx, 1);
				//Update global checklist
				WorkingOnService.update($scope.checklist);
			}
		};
		
		/**
		 * 
		 * */
		$scope.removeItem = function(checklist, section, itemIdx){
			if(section.items.length >= itemIdx){
				section.items.splice(itemIdx, 1);
				//Update global checklist
				WorkingOnService.update($scope.checklist);
			}
		};
		
		
		
		/******* Checklist Edition ********/
		$scope.focusElement = "Title";
		$scope.lastKeyPress = 0;
		
		$scope.onKeyDown = function(event){
			//necesario para que funcione onTitleKeyDown
		};
		
		//Title KeyDown
		$scope.onTitleKeyDown = function(event, checklist){
			if(event.keyCode == 13){
				if(!checklist){
					checklist = { name: angular.element('#name').html };
				}
				
				if(!checklist.sections){
					checklist.sections = [];
				}
				
				if(checklist.sections.length == 0){
					checklist.sections.push({ name : "", items : [] });
					//Update global checklist
					WorkingOnService.update(checklist);
				}
				
				$scope.focusElement = "SectionName";
				$scope.secFocusIndex = 0;
			}
		};
		
		//Section KeyPress
		$scope.onSectionKeyPress = function(event, checklist, section){
			if(event.keyCode == 13){
				if(section.name != "")
				{
					$scope.focusElement = "SectionDesc";
					$scope.secFocusIndex = checklist.sections.indexOf(section);
				}
			}
		};
		
		//Section KeyDown
		$scope.onSectionKeyDown = function(event, checklist, section, idx){
			if($scope.lastKeyPress == 13 && event.keyCode == 13){
				if(section.name && section.name.trim().replace(/(\r\n|\n|\r)/gm,"") != "")
				{
					//Update global checklist
					WorkingOnService.update(checklist);
					
					$scope.focusElement = "SectionDesc";
					$scope.secFocusIndex = checklist.sections.indexOf(section);
				}
			} else if(event.keyCode == 8) {
				if((section.name == undefined 
				|| section.name.trim().replace(/(\r\n|\n|\r)/gm,"") == "") 
				&& section.items){
					//Update local checklist
					var i = checklist.sections.indexOf(section);
					checklist.sections.splice(i,1);
					
					//Update global checklist
					WorkingOnService.update(checklist);
					
					event.preventDefault();
					//Focus to next element
					var jumpTo = i-1;
					$scope.secFocusIndex = jumpTo;
					if($scope.secFocusIndex == -1){
						$scope.focusElement = "Title";
						$scope.secFocusIndex = 0;
					}else{
						if(checklist.sections[$scope.secFocusIndex].items){
							jumpTo = checklist.sections[$scope.secFocusIndex].items.length - 1;
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
		$scope.onSectionDescKeyPress = function(event, checklist, section){
			if(event.keyCode == 13){
				
				if(!section.items){
					section.items = [];
				}
				
				if(section.items.length == 0){
					//Update local checklist
					section.items.push({ content : null });
				}
				
				//Update global checklist
				WorkingOnService.update(checklist);
					
				$scope.focusElement = "Item";
				$scope.itemFocusIndex = section.items.length-1;
			}
		};
		
		//Section Desc KeyDown
		$scope.onSectionDescKeyDown = function(event, section, idx){
			if(event.keyCode == 8) {
				if((section.description == undefined 
				|| section.description.trim().replace(/(\r\n|\n|\r)/gm,"") == "")){
					//Update global checklist
					WorkingOnService.update($scope.checklist);
					
					$scope.focusElement = "SectionName";
					$scope.secFocusIndex = idx;
				}
			}	
		};
		
		//Item KeyDown
		$scope.onItemKeyDown = function(event, checklist, section, item, idx){
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
					
					//Update global checklist
					WorkingOnService.update(checklist);

					$scope.focusElement = "Item";
					$scope.itemFocusIndex = jumpTo;
				}
				else
				{
					//Jump to a new Section
					section.items.pop();
					checklist.sections.push({ name : "", items : [] });
					
					//Update global checklist
					WorkingOnService.update(checklist);
			
					$scope.focusElement = "SectionName";
					$scope.secFocusIndex = checklist.sections.length-1;
				}
			}
			else if(event.keyCode == 8) {
				if(item.content == null || item.content == undefined 
					|| item.content.trim().replace(/(\r\n|\n|\r)/gm,"") == ""){
					//remove idx item
					section.items.splice(idx,1);
					
					//Update global checklist
					WorkingOnService.update(checklist);
			
					event.preventDefault();
					jumpTo = idx-1;
				}
				$scope.itemFocusIndex = jumpTo;
				if($scope.itemFocusIndex == -1){
					$scope.focusElement = "SectionDesc";
					$scope.secFocusIndex = checklist.sections.indexOf(section);
				}else{
					$scope.focusElement = "Item";
				}
			}
			
			$scope.lastKeyPress = event.keyCode;
		};
		
	}
]);
