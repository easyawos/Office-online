'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Comment Schema
 */
var CommentSchema = new Schema({
	comment: {
		type: String,
		default: '',
		required: 'Please fill Comment here',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},

	blog: {
		type: Schema.ObjectId,
		ref: 'Blog'
	}

});

mongoose.model('Comment', CommentSchema);