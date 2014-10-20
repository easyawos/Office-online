'use strict';

//Answers service used to communicate Answers REST endpoints
angular.module('answers').factory('Answers', ['$resource',
	function($resource) {
		return $resource('projects/:projectId/answers/:answerId', { projectId: '@project',answerId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);