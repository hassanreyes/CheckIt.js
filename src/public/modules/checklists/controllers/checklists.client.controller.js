'use strict';

// Checklists controller
angular.module('checklists').controller('ChecklistsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Checklists',
	function($scope, $stateParams, $location, Authentication, Checklists) {
		$scope.authentication = Authentication;

		// Create new Checklist
		$scope.create = function() {
			// Create new Checklist object
			var checklist = new Checklists ({
				name: this.name
			});

			// Redirect after save
			checklist.$save(function(response) {
				$location.path('checklists/' + response._id);

				// Clear form fields
				$scope.name = '';
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
	}
]);