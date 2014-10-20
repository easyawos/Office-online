'use strict';

angular.module('blogs').factory('Api', ['$resource',
	function($resource) {

		return {
			Blogs: $resource('blogs/:blogId', {
						blogId: '@_id'
			}, 
			{
				update: {
					method: 'PUT'
				}
			}),

			Comments: $resource('/blogs/:blogId/comments', {
						blogId: '@blog'
			}, 
			{
				update: {
					method: 'PUT'
				}
			}),

		};
	}

]);

//Articles service used for communicating with the articles REST endpoints
// angular.module('blogs').factory('Blogs', ['$resource',
// 	function($resource) {
// 		return $resource('blogs/:blogId', {
// 			blogId: '@_id'
// 		}, {
// 			update: {
// 				method: 'PUT'
// 			}
// 		});
// 	}
// ]);