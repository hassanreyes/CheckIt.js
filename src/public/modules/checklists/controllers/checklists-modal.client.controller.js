'use strict';

// Checklists controller
angular.module('checklists').controller('ChecklistsRemoveModalController', function($scope, $modalInstance, $modal, item) {

    $scope.checklist = item;
    
    //Remove Modal - Ok option
	$scope.ok = function(){
		$modalInstance.close($scope.checklist);
	};
	
	$scope.cancel = function(){
	    $modalInstance.dismiss('Cancel');
	};
	
});
