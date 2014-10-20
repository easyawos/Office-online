'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	mongoose = require('mongoose'),
	User = mongoose.model('User');

/**
 * User middleware
 */
exports.userByID = function(req, res, next, id) {
	User.findOne({
		_id: id
	}).exec(function(err, user) {
		if (err) return next(err);
		if (!user) return next(new Error('Failed to load User ' + id));
		req.profile = user;
		next();
	});
};

exports.allUsers = function(req, res, next){
	User.find().exec(function(err, users){
		if (err) return next(err);
		else res.jsonp(users);
	});
};

exports.findOne = function(req, res) {
	res.jsonp(req.profile);
};


exports.update = function(req, res) {
	var user = req.profile;
	user = _.extend(user, req.body);

	user.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: 'You are not allowed to perform this task'
			});
		} else {
			res.jsonp(user);
		}
	});
};

/**
 * Delete an article
 */
exports.delete = function(req, res) {
	var user = req.profile;

	user.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: 'You are not allowed to perform this task'
			});
		} else {
			res.jsonp(user);
		}
	});
};


/**
 * Require login routing middleware
 */
exports.requiresLogin = function(req, res, next) {
	if (!req.isAuthenticated()) {
		return res.status(401).send({
			message: 'User is not logged in'
		});
	}

	next();
};


exports.needsAdminAuthorization = function(req,res,next)
{
	var _this = this;	
	var adminKey = '2398hd2983h2nd8392dgxhn293dhx2937dxhb29dx923d';
	exports.adminKey = adminKey;

	var isAuthorized = (req.body.adminKey && req.body.adminKey === adminKey)||(req.user && req.user.roles.indexOf('admin')===0);
	if(isAuthorized)
	{
		req.isAuthorized = isAuthorized;
		next();
	}
	else 
	{
		req.isAuthorized = false;
		return res.status(400).send({
					message: 'Only Admin is authorized to perform this action.'
			});
	}

};
/**
 * User authorizations routing middleware
 */
exports.hasAuthorization = function(roles) {
	var _this = this;

	return function(req, res, next) {
		_this.requiresLogin(req, res, function() {
			if (_.intersection(req.user.roles, roles).length) {
				return next();
			} else {
				return res.status(403).send({
					message: 'User is not authorized'
				});
			}
		});
	};
};