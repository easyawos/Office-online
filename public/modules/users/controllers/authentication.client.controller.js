'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication',
	function($scope, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		$scope.signup = function() {
			$http.post('/auth/signup', $scope.credentials).success(function(response) {
				$scope.credentials = '';
				alert('User Successfully Created');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.signin = function() {
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				// If successful assign the response to the global user model
				$scope.authentication.user = response;

				if ($scope.authentication.user.roles[0] === 'user') {
					$location.path('/userhome');
				}
				else  {
				// And redirect to the index page
				$location.path('/adminhome');					
				}

			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);