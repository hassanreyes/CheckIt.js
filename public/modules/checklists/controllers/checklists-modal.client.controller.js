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


angular.module('checklists').controller('ChecklistsDismissModalController', function($scope, $modalInstance, $modal, item) {

    $scope.checklist = item;
    
    //Remove Modal - Ok option
	$scope.ok = function(){
		$modalInstance.close($scope.checklist);
	};
	
	$scope.cancel = function(){
	    $modalInstance.dismiss('Cancel');
	};
	
});


angular.module('checklists').controller('ChecklistsCollabModalController', ['$scope', '$modalInstance', 'Users', 'lodash', '$modal', 'item',
	function($scope, $modalInstance, Users, lodash, $modal, item) {

	$scope.checklist = item;
	$scope.collaborators = [];
	$scope.collab = null;
	$scope.userNames = [''];
	$scope.users = [];

	$scope.init = function(){
		//Populate user info
		$scope.users = Users.get();
		$scope.users.$promise.then(function(result){
			result.forEach(function (item) {
				$scope.userNames.push(item.username);
			})

			if($scope.checklist.collaborators){
				$scope.checklist.collaborators.forEach(function (item) {
					var user = lodash.find(result, { _id: (item.user._id ? item.user._id : item.user) });
					if(user){
						$scope.collaborators.push({ user: user._id, username: user.username, displayName: user.displayName, access: item.access});
					}
				});
			}else{
				$scope.checklist.collaborators = [];
			}
		});

	};

	$scope.add = function(){
		if(!lodash.find($scope.collaborators, {'username': $scope.collab})){
			var user = lodash.find($scope.users, { username: $scope.collab});
			if(user){
				$scope.collaborators.push({ user: user._id, username: user.username, displayName: user.displayName, access: 'view'});
			}
		}
	};

	$scope.remove = function (collab) {
		var idx = $scope.collaborators.indexOf(collab);
		$scope.collaborators.splice(idx, 1);
	};

	//Remove Modal - Ok option
	$scope.ok = function(){
		//Clear current list
		$scope.checklist.collaborators = [];
		$scope.collaborators.forEach(function(item){
			$scope.checklist.collaborators.push({ user: item.user, access: item.access });
		});

		$modalInstance.close($scope.checklist);
	};

	$scope.cancel = function(){
		$modalInstance.dismiss('Cancel');
	};

}]);
