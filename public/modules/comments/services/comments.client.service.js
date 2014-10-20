'use strict';

//Comments service used to communicate Comments REST endpoints
angular.module('comments').factory('Comments', ['$resource',
	function($resource) {
		return $resource('blogs/:blogId/comments/:commentId', { commentId: '@_id', blogId: '@blog'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);