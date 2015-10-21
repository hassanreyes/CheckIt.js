'use strict';

// Checklists controller
angular.module('checklists').controller('UploadChecklistsController', ['$scope', '$rootScope', '$location', 'Authentication', '$upload', 'Parser', '$http', '$modal', 
	function($scope, $rootScope, $location, Authentication, $upload, Parser, $http, $modal) {
		$scope.authentication = Authentication;
		$scope.user = Authentication.user;
		
		// Upload a checklist
        $scope.$watch('files', function () {
            if ($scope.files && $scope.files.length) {
                //Is already have a Working on checklist,ask for dismiss or save
                if($scope.user.workingOn.checklist != undefined){
                    $scope.openDismissModal($scope.user.workingOn.checklist, function(){
                        $scope.upload($scope.files);
                    });
                }
            }
        });
        
        $scope.openDismissModal = function(chklst, next){
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
					next();
				}
			});
		};
        
        $scope.upload = function (files) {
        	if (files && files.length) {
        		var file = files[0];
        		var reader = new FileReader();
        		reader.onload = function(e) {
        			$rootScope.user.workingOn.checklist = Parser.parse(reader.result, $rootScope.workingOn);
        			//$window.location.href = "#/checklists/create";
        			$scope.$apply(function(){
        				$location.path('/checklists/edit');
        			});
        		};
        		reader.readAsText(file);
        	}
        };
    }
]);
