'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Checklist = mongoose.model('Checklist'),
	User = mongoose.model('User'),
	Category = mongoose.model('Category'),
	History = mongoose.model('History'),
	_ = require('lodash'),
	async = require("async");

/**
 * Create a Checklist
 */
exports.create = function(req, res) {
	var checklist = new Checklist(req.body);
	
	// for (var secIdx = 0; secIdx < req.body.sections.length; ++secIdx) {
	// 	//checklist.sections.push({name: req.body.sections[secIdx].name, description : req.body.sections[secIdx].description, items: [] });
	// 	checklist.sections[secIdx].items = [];
	// 	for (var itemIdx = 0; itemIdx < req.body.sections.length; ++itemIdx) {
	// 		checklist.sections[secIdx].items.push({content : req.body.sections[secIdx].items[itemIdx].content});
	// 	} 
	// }
	
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
	var query = undefined;
	if(req.query.isBrowsing === undefined || req.query.isBrowsing != 'true'){
		query = { 'user' : req.user.id };
	}else{
		query = { 'status' : 'published' }; //browse only published
	}
	Checklist.find(query).sort('-created').populate('user', 'displayName').populate('category').exec(function(err, checklists) {
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
	Checklist.findById(id).populate('user', 'displayName').populate('category').populate('collaborators.user','displayName').exec(function(err, checklist) {
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

/**
 * Perform a full text search over all checklists
 */
exports.search = function(req, res, next, query){
	Checklist.find( { $text: {$search: query}, 'status' : 'published' }, { score: { $meta: "textScore" } })
		.populate('category user').sort({score: {$meta: 'textScore'}}).exec(function (err, checklists) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(checklists);
		}
	});
};

exports.share = function(req, res){
	
	res.set('Content-Type', 'text/html');
	var response = '<html>';
	response += '<head>';
	response += '<meta property="og:title" content="" />';
	response += '<meta property="og:description" content="<?php echo $data->description; ?>" />';
	response += '<meta property="og:image" content="http://checkittool.herokuapp.com/modules/core/img/brand/logo.png />';
	response += '</head>';
	
	res.send(response);     
};

exports.shareChecklist = function(req, res, next, id) { 
	Checklist.findById(id).populate('user', 'displayName').exec(function(err, checklist) {
		if (err) return next(err);
		if (checklist) {
			res.set('Content-Type', 'text/html');
			var response = '<html>';
			response += '<head>';
			response += '<meta property="og:title" content="' + checklist.name + '" />';
			response += '<meta property="og:description" content="' + checklist.description + '" />';
			response += '<meta property="og:image" content="http://checkittool.herokuapp.com/modules/core/img/brand/logo.png />';
			response += '</head>';
	
			res.send(response);
			// req.checklist = checklist ;
			// next();
		}
	});
};

/**
 * Update the hitory information
 * */
exports.updateHistory = function(req, res){
	if(req.body)
	{
		History.findOne({user: req.body.userId, checklist: req.body.checklistId}, function(err, entry) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				if(entry)
				{
					//Update
					entry.visited = Date.now();
					if(req.body.using)
					{
						entry.useCount++;
					}
					else
					{
						entry.visits++;
					}
					
					entry.save(function(err) {
						if (err) {
							return res.status(400).send({
								message: errorHandler.getErrorMessage(err)
							});
						}	
					});	
				}
				else
				{
					//New
					var hist = new History({ user: req.body.userId
											, checklist: req.body.checklistId
											, visited: Date.now()
											, visits: 1
											, useCount: (req.body.using) ? 1 : 0});
					
					hist.save(function(err) {
						if (err) {
							return res.status(400).send({
								message: errorHandler.getErrorMessage(err)
							});
						}
					});
				}
				
				res.sendStatus(200);
			}
		});
	}
};
