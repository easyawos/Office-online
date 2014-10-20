'use strict';

(function() {
	// Articles Controller Spec
	describe('BlogsController', function() {
		// Initialize global variables
		var BlogsController,
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

			// Initialize the Articles controller.
			BlogsController = $controller('BlogsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one blog object fetched from XHR', inject(function(Blogs) {
			// Create sample article using the Articles service
			var sampleBlog = new Blogs({
				title: 'A Blog about MEAN',
				content: 'MEAN rocks!'
			});

			// Create a sample articles array that includes the new article
			var sampleBlogs = [sampleBlog];

			// Set GET response
			$httpBackend.expectGET('blogs').respond(sampleBlogs);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.blogs).toEqualData(sampleBlogs);
		}));

		it('$scope.findOne() should create an array with one blog object fetched from XHR using a blogId URL parameter', inject(function(Blogs) {
			// Define a sample article object
			var sampleBlog = new Blogs({
				title: 'A Blog about MEAN',
				content: 'MEAN rocks!'
			});

			// Set the URL parameter
			$stateParams.blogId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/blogs\/([0-9a-fA-F]{24})$/).respond(sampleBlog);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.blog).toEqualData(sampleBlog);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Blogs) {
			// Create a sample article object
			var sampleBlogPostData = new Blogs({
				title: 'An Article about MEAN',
				content: 'MEAN rocks!'
			});

			// Create a sample article response
			var sampleBlogResponse = new Blogs({
				_id: '525cf20451979dea2c000001',
				title: 'A Blog about MEAN',
				content: 'MEAN rocks!'
			});

			// Fixture mock form input values
			scope.title = 'A Blog about MEAN';
			scope.content = 'MEAN rocks!';

			// Set POST response
			$httpBackend.expectPOST('blogs', sampleBlogPostData).respond(sampleBlogResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.title).toEqual('');
			expect(scope.content).toEqual('');

			// Test URL redirection after the article was created
			expect($location.path()).toBe('/blogs/' + sampleBlogResponse._id);
		}));

		it('$scope.update() should update a valid blog', inject(function(Blogs) {
			// Define a sample article put data
			var sampleBlogPutData = new Blogs({
				_id: '525cf20451979dea2c000001',
				title: 'A Blog about MEAN',
				content: 'MEAN Rocks!'
			});

			// Mock article in scope
			scope.blog = sampleBlogPutData;

			// Set PUT response
			$httpBackend.expectPUT(/blogs\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/blogs/' + sampleBlogPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid blogId and remove the article from the scope', inject(function(Blogs) {
			// Create new article object
			var sampleBlog = new Blogs({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new articles array and include the article
			scope.blogs = [sampleBlog];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/blogs\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleBlog);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.blogs.length).toBe(0);
		}));
	});
}());