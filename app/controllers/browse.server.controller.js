'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Checklist = mongoose.model('Checklist'),
	_ = require('lodash');

/**
 * List of Checklists
 */
exports.list = function(req, res) { 
	Checklist.find().sort('-created').populate('user', 'displayName').populate('category').exec(function(err, checklists) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(checklists);
		}
	});

};
