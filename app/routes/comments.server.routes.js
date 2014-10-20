'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var comments = require('../../app/controllers/comments');
	var blog = require('../../app/controllers/blogs');

	// Comments Routes
	app.route('/blogs/:blogId/comments')
		.get(comments.list)
		.post(users.requiresLogin, comments.create);

	app.route('/blogs/:blogId/comments/:commentId')
		.get(comments.read)
		.put(users.requiresLogin, comments.hasAuthorization, comments.update)
		.delete(users.requiresLogin, comments.hasAuthorization, comments.delete);

	// Finish by binding the Comment middleware
	app.param('commentId', comments.commentByID);
};