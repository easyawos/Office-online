'use strict';

angular.module('blogs').controller('BlogsController', ['$scope', '$http', '$stateParams', '$location', 'Authentication', 'Api', 
	function($scope, $http, $stateParams, $location, Authentication, Api) {
		$scope.authentication = Authentication;


		$scope.addComments = function(){
		$scope.commentForm = true;
		};

		$scope.create = function() {

			var blog = new Api.Blogs({
				title: this.title,
				content: this.content
			});

			blog.$save(function(response) {
				$location.path('blogs/' + response._id);

				$scope.title = '';
				$scope.content = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// create comment
		$scope.createComment=function() {
			$scope.commentForm = false;
			// Create new Comment object
			var comment = new Api.Comments ({
				comment: this.comment,
				blog: $stateParams.blogId
			});

			// Redirect after save
			comment.$save(function(response) {
			var	blogId = $stateParams.blogId;
				$location.path('blogs/'+blogId);

				// Clear form fields
				$scope.comment = '';
				$scope.findOne();
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.remove = function(blog) {
			if (blog) {
				blog.$remove();

				for (var i in $scope.blogs) {
					if ($scope.blogs[i] === blog) {
						$scope.blogs.splice(i, 1);
					}
				}
			} else {
				$scope.blog.$remove(function() {
					$location.path('blogs');
				});
			}
		};

		$scope.update = function() {
			var blog = $scope.blog;

			blog.$update(function() {
				$location.path('blogs/' + blog._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.find = function() {
			$scope.blogs = Api.Blogs.query();
		};
		$scope.findRecent = function() {
			$scope.blogs = Api.Blogs.query({
				count: 5
			});
		};
		$scope.findOne = function() {
			$scope.commentForm = false;
			$scope.blog = Api.Blogs.get({
				blogId: $stateParams.blogId
			});

			$scope.blogComments = Api.Comments.query({
				blogId:  $stateParams.blogId
			});
		};
	}
]);