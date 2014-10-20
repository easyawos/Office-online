'use strict';

//Articles service used for communicating with the articles REST endpoints
angular.module('projects').factory('Projects', ['$resource',
	function($resource) {
		return $resource('projects/:projectId', {
			projectId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
])
.factory('Answers', ['$resource',
	function($resource) {
		return $resource('projects/:projectId/answers', {
			projectId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);



