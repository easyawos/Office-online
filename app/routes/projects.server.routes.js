'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users'),
	projects = require('../../app/controllers/projects');

module.exports = function(app) {
	// Projects Routes
	app.route('/projects')
		.get(projects.list)
		.post(users.requiresLogin, users.needsAdminAuthorization, projects.create); //users.requiresLogin, 

	app.route('/projects/:projectId')
		.get(projects.read)
		.put(users.requiresLogin, projects.hasAuthorization, projects.update)
		.delete(users.requiresLogin, projects.hasAuthorization, projects.delete);

	// Finish by binding the project middleware
	app.param('projectId', projects.projectByID);
};