'use strict';

angular.module('projects').controller('ProjectsController', ['$scope', '$stateParams', '$location', '$upload', '$timeout', 'Authentication', 'Projects', 'Answers',
	function($scope, $stateParams, $location, $upload, $timeout, Authentication, Projects, Answers) {
		$scope.authentication = Authentication;


	 	// onFileSelect directive
	    $scope.onFileSelect = function($files) {
	        $scope.uploadedFile = [];
	        $scope.answerUrl = [];
	        $scope.selectedFiles = $files;
	        for (var i = 0; i < $files.length; i++) {
	            var $file = $files[i];
	            $scope.start(i);
	        }
	    };

	    $scope.start = function(indexOftheFile) {
	    	alert('Uploading file, please wait');
	        var formData = {
	            key: $scope.selectedFiles[indexOftheFile].name,
	            AWSAccessKeyId: 'AKIAJQYBMDUWZVLR6ZGA',
	            acl: 'private',
	            policy: 'ewogICJleHBpcmF0aW9uIjogIjIwMjAtMDEtMDFUMDA6MDA6MDBaIiwKICAiY29uZGl0aW9ucyI6IFsKICAgIHsiYnVja2V0IjogImtvbWljYnVja2V0In0sCiAgICBbInN0YXJ0cy13aXRoIiwgIiRrZXkiLCAiIl0sCiAgICB7ImFjbCI6ICJwcml2YXRlIn0sCiAgICBbInN0YXJ0cy13aXRoIiwgIiRDb250ZW50LVR5cGUiLCAiIl0sCiAgICBbInN0YXJ0cy13aXRoIiwgIiRmaWxlbmFtZSIsICIiXSwKICAgIFsiY29udGVudC1sZW5ndGgtcmFuZ2UiLCAwLCA1MjQyODgwMDBdCiAgXQp9',
	            signature: 'CNs+4S/Ms5sCgbITIksXcyHBgas=',
	     		filename: $scope.selectedFiles[indexOftheFile].name,
				'Content-Type':$scope.selectedFiles[indexOftheFile].type
	        };


	        $scope.uploadedFile[indexOftheFile] = $upload.upload({
	            url: 'https://komicbucket.s3-us-west-2.amazonaws.com/',
	            method: 'POST',
	            headers: {
	                'Content-Type': $scope.selectedFiles[indexOftheFile].type
	            },
	            data: formData,
	            file: $scope.selectedFiles[indexOftheFile]
	        });
	        $scope.uploadedFile[indexOftheFile].then(function(response) {
	            $timeout(function() {
	                var ansUrl = 'https://komicbucket.s3-us-west-2.amazonaws.com/' + $scope.selectedFiles[indexOftheFile].name;
	                $scope.answerUrl.push(ansUrl);
	          		$scope.createAnswer($scope.answerUrl);

	            });
	        }, function(response) {
	        }, function(evt) {
	            // Math.min is to fix IE which reports 200% sometimes
	            //$scope.progress[index] = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
	        });
	        $scope.uploadedFile[indexOftheFile].xhr(function(xhr) {
	        });
	    };


		// create answer
		$scope.createAnswer=function(ANS) {
			// Create new Answer object
			var answer = new Answers ({
				answer: ANS
			});

			// Redirect after save
			answer.$save({projectId: $stateParams.projectId}, function(response) {
			var	projectId = $stateParams.projectId;
				$location.path('projects/'+projectId);

				// Clear form fields
				$scope.findOne();
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};



		$scope.create = function() {

			var project = new Projects({
				title: this.title,
				content: this.content
			});
			project.answer = $scope.files;
			project.$save(function(response) {
				$location.path('projects/' + response._id);

				$scope.title = '';
				$scope.content = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.remove = function(project) {
			if (project) {
				project.$remove();

				for (var i in $scope.projects) {
					if ($scope.projects[i] === project) {
						$scope.projects.splice(i, 1);
					}
				}
			} else {
				$scope.project.$remove(function() {
					$location.path('projects');
				});
			}
		};

		$scope.update = function() {
			var project = $scope.project;

			project.$update(function() {
				$location.path('projects/' + project._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.find = function() {
			$scope.projects = Projects.query();
		};

		$scope.findOne = function() {
			$scope.project = Projects.get({
				projectId: $stateParams.projectId
			});

			$scope.projectAnswers = Answers.query({
				projectId: $stateParams.projectId
			});
		};
	}
]);