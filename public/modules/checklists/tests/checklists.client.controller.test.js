'use strict';

(function() {
	// Checklists Controller Spec
	describe('Checklists Controller Tests', function() {
		// Initialize global variables
		var ChecklistsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Checklists controller.
			ChecklistsController = $controller('ChecklistsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Checklist object fetched from XHR', inject(function(Checklists) {
			// Create sample Checklist using the Checklists service
			var sampleChecklist = new Checklists({
				name: 'New Checklist'
			});

			// Create a sample Checklists array that includes the new Checklist
			var sampleChecklists = [sampleChecklist];

			// Set GET response
			$httpBackend.expectGET('checklists').respond(sampleChecklists);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.checklists).toEqualData(sampleChecklists);
		}));

		it('$scope.findOne() should create an array with one Checklist object fetched from XHR using a checklistId URL parameter', inject(function(Checklists) {
			// Define a sample Checklist object
			var sampleChecklist = new Checklists({
				name: 'New Checklist'
			});

			// Set the URL parameter
			$stateParams.checklistId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/checklists\/([0-9a-fA-F]{24})$/).respond(sampleChecklist);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.checklist).toEqualData(sampleChecklist);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Checklists) {
			// Create a sample Checklist object
			var sampleChecklistPostData = new Checklists({
				name: 'New Checklist'
			});

			// Create a sample Checklist response
			var sampleChecklistResponse = new Checklists({
				_id: '525cf20451979dea2c000001',
				name: 'New Checklist'
			});

			// Fixture mock form input values
			scope.name = 'New Checklist';

			// Set POST response
			$httpBackend.expectPOST('checklists', sampleChecklistPostData).respond(sampleChecklistResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Checklist was created
			expect($location.path()).toBe('/checklists/' + sampleChecklistResponse._id);
		}));

		it('$scope.update() should update a valid Checklist', inject(function(Checklists) {
			// Define a sample Checklist put data
			var sampleChecklistPutData = new Checklists({
				_id: '525cf20451979dea2c000001',
				name: 'New Checklist'
			});

			// Mock Checklist in scope
			scope.checklist = sampleChecklistPutData;

			// Set PUT response
			$httpBackend.expectPUT(/checklists\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/checklists/' + sampleChecklistPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid checklistId and remove the Checklist from the scope', inject(function(Checklists) {
			// Create new Checklist object
			var sampleChecklist = new Checklists({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Checklists array and include the Checklist
			scope.checklists = [sampleChecklist];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/checklists\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleChecklist);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.checklists.length).toBe(0);
		}));
	});
}());