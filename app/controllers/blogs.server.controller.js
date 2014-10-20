'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Blog = mongoose.model('Blog'),
	_ = require('lodash');

/**
 * Create a blog
 */
exports.create = function(req, res) {
	var blog = new Blog(req.body);
	blog.user = req.user;

	blog.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			
			res.jsonp(blog);
		}
	});
};

/**
 * Show the current blog
 */
exports.read = function(req, res) {
	res.jsonp(req.blog);
};

/**
 * Update a blog
 */
exports.update = function(req, res) {
	var blog = req.blog;

	blog = _.extend(blog, req.body);

	blog.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(blog);
		}
	});
};

/**
 * Delete a blog
 */
exports.delete = function(req, res) {
	var blog = req.blog;

	blog.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(blog);
		}
	});
};

/**
 * List of Blogs
 */
exports.list = function(req, res) {
	var limit = req.query.count ? req.query.count : 0;
	Blog.find().sort('-created').populate('user', 'displayName').populate('comments').limit(limit).exec(function(err, blogs) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(blogs);
		}
	});
};

/**
 * Article middleware
 */
exports.blogByID = function(req, res, next, id) {
	Blog.findById(id).populate('user', 'displayName').populate('comments').populate('comments.user').exec(function(err, blog) {
		if (err) return next(err);
		if (!blog) return next(new Error('Failed to load blog ' + id));
		req.blog = blog;
		next();
	});
};

/**
 * Article authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.blog.user.id !== req.user.id) {
		return res.status(403).send({
			message: 'User is not authorized'
		});
	}
	next();
};