'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Answer = mongoose.model('Answer'),
	_ = require('lodash');

/**
 * Create a Answer
 */
exports.create = function(req, res) {
	var answer = new Answer(req.body);
	answer.project = req.project;
	answer.user = req.user;

	req.project.answers.push(answer);

	answer.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			req.project.save();
			res.jsonp(answer);
		}
	});
};

/**
 * Show the current Answer
 */
exports.read = function(req, res) {
	res.jsonp(req.answer);
};

/**
 * Update a Answer
 */
exports.update = function(req, res) {
	var answer = req.answer ;

	answer = _.extend(answer , req.body);

	answer.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(answer);
		}
	});
};

/**
 * Delete an Answer
 */
exports.delete = function(req, res) {
	var answer = req.answer ;

	answer.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(answer);
		}
	});
};

/**
 * List of Answers
 */
exports.list = function(req, res) { Answer.find({project: req.project._id}).sort('-created').populate('user', 'displayName').exec(function(err, answers) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(answers);
		}
	});
};

/**
 * Answer middleware
 */
exports.answerByID = function(req, res, next, id) { Answer.findById(id).populate('user', 'displayName').exec(function(err, answer) {
		if (err) return next(err);
		if (! answer) return next(new Error('Failed to load Answer ' + id));
		req.answer = answer ;
		next();
	});
};

/**
 * Answer authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.answer.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};