'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	errorHandler = require('../errors.server.controller.js'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Checklist = mongoose.model('Checklist'),
	History = mongoose.model('History');

/**
 * Get top N favorite checklists (sort by visited desc)
 */
exports.db_topFavorite = function(req, res) {
    
    var query = { '_id' : req.user.id };
	
	User.find(query).populate('favorites').limit(10).sort('-created').exec(function(err, favorites) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			
			var options = {
				path: 'favorites.user',
				model: 'User'
			};
			
			User.populate(favorites, options, function(err, users){
				if (err) {
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				} else {
					
					options = {
						path: 'favorites.checklist',
						model: 'Checklist'
					};
					
					User.populate(users, options, function(err, checklists){
						if (err) {
							return res.status(400).send({
								message: errorHandler.getErrorMessage(err)
							});
						} else {
							res.jsonp(checklists);	
						}
					});
				}
			});
		}
	});
	
};


exports.db_myChecklists = function(req, res){
	
	var query = { 'user' : req.user.id };
	
	Checklist.find(query).populate('user', 'displayName').populate('category').limit(10).sort('-created').exec(function(err, checklists) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(checklists);
		}
	});
	
};

exports.db_lastVisited = function(req, res){
	
	var query = { 'user' : req.user.id };
	
	History.find(query).populate('user', 'displayName').limit(10).sort('-visited').exec(function(err, history) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			
			var options = {
				path: 'checklist',
				model: 'Checklist'
			};
			
			User.populate(history, options, function(err, checklists){
				if (err) {
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				} else {
					res.jsonp(checklists);
				}
			});
		}
	});
};

exports.db_lastAdded = function(req, res){

	Checklist.find().populate('user', 'displayName').populate('checklist').populate('category').limit(20).sort('-created').exec(function(err, checklists) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(checklists);
		}
	});
	
};

exports.db_recommended = function(req, res){
	
};
