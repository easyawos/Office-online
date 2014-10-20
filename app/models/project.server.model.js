'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Project Schema
 */

var ProjectSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},

	title: {
		type: String,
		default: '',
		trim: true,
		required: 'Title cannot be blank'
	},

	category: {
		type: String,
		default: '',
		trim: true

	},
	content: {
		type: String,
		default: '',
		trim: true
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},


	answers:[{
		type: Schema.ObjectId,
		ref: 'Answer'
	}]

});

mongoose.model('Project', ProjectSchema);