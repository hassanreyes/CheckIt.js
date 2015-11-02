'use strict';

// Checklists controller
angular.module('checklists').controller('UploadChecklistsController', ['$scope', '$rootScope', '$state', 'Authentication', '$upload', 'Parser', '$http', '$window', 'CheckItModals', 'WorkingOnService',
	function($scope, $rootScope, $state, Authentication, $upload, Parser, $http, $window, CheckItModals, WorkingOnService) {
		$scope.authentication = Authentication;
		$scope.user = Authentication.user;
		$scope.isCollapsed = true;

		// Upload a checklist
        $scope.$watch('files', function () {
            if ($scope.files && $scope.files.length) {
                //Is already have a Working on checklist,ask for dismiss or save
                var checklist = WorkingOnService.getChecklist();
                if(checklist != undefined  && checklist.sections != null && checklist.sections.length > 0){
					CheckItModals.dismissChecklistModal(checklist, function(){
						$scope.upload($scope.files);
					});
                }else{
                    $scope.upload($scope.files);
                }
            }
        });

        $scope.upload = function (files) {
        	if (files && files.length) {
        		var file = files[0];
        		var reader = new FileReader();
        		reader.onload = function(e) {
        			var checklist = Parser.parse(reader.result);
        			
        			WorkingOnService.update(checklist, function(){
        			    $window.location.href = "/#!/workingOn"; 
        			});
        		};
        		reader.readAsText(file);
        	}
        };
    }
]);
