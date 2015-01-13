'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Checklist = mongoose.model('Checklist'),
	_ = require('lodash');

/**
 * Create a Checklist
 */
exports.create = function(req, res) {
	var checklist = new Checklist(req.body);
	checklist.user = req.user;

	checklist.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(checklist);
		}
	});
};

/**
 * Show the current Checklist
 */
exports.read = function(req, res) {
	res.jsonp(req.checklist);
};

/**
 * Update a Checklist
 */
exports.update = function(req, res) {
	var checklist = req.checklist ;

	checklist = _.extend(checklist , req.body);

	checklist.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(checklist);
		}
	});
};

/**
 * Delete an Checklist
 */
exports.delete = function(req, res) {
	var checklist = req.checklist ;

	checklist.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(checklist);
		}
	});
};

/**
 * List of Checklists
 */
exports.list = function(req, res) { 
	Checklist.find().sort('-created').populate('user', 'displayName').exec(function(err, checklists) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(checklists);
		}
	});
};

/**
 * Checklist middleware
 */
exports.checklistByID = function(req, res, next, id) { 
	Checklist.findById(id).populate('user', 'displayName').exec(function(err, checklist) {
		if (err) return next(err);
		if (! checklist) return next(new Error('Failed to load Checklist ' + id));
		req.checklist = checklist ;
		next();
	});
};

/**
 * Checklist authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.checklist.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
