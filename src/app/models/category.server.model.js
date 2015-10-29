'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	//materializedPlugin = require('mongoose-materialized'),
	pathTreePlugin = require('mongoose-path-tree'),
	Schema = mongoose.Schema;

/**
 * Category Schema
 */
var CategorySchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Category name',
		trim: true
	},
	description: {
	        type: String,
	        trim: true
    	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

//CategorySchema.plugin(materializedPlugin);
CategorySchema.plugin(pathTreePlugin);

var Category = mongoose.model('Category', CategorySchema);





