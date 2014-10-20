'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users'),
	blogs = require('../../app/controllers/blogs');

module.exports = function(app) {
	// Blogs Routes
	app.route('/blogs')
		.get(blogs.list)
		.post(blogs.create); //users.requiresLogin, 

	app.route('/blogs/:blogId')
		.get(blogs.read)
		.put(users.requiresLogin, blogs.hasAuthorization, blogs.update)
		.delete(users.requiresLogin, blogs.hasAuthorization, blogs.delete);

	// Finish by binding the blog middleware
	app.param('blogId', blogs.blogByID);
};