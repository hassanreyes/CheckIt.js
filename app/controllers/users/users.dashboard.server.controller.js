'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	errorHandler = require('../errors.server.controller.js'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Checklist = mongoose.model('Checklist'),
	Category = mongoose.model('Category'),
	History = mongoose.model('History');

/**
 * Get top N favorite checklists (sort by visited desc)
 */

exports.listFavorites = function(req, res) {
    
    var query = { '_id' : req.user.id };
	
	User.findOne(query).select('favorites').populate('favorites').sort('-created').exec(function(err, favorites) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			
			var options = [{
				path: 'favorites.user',
				model: 'User',
				select: '_id displayName'
			},{
				path: 'favorites.category',
				model: 'Category',
				select: '_id name'
			}];
			
			Checklist.populate(favorites, options, function(err, checklists){
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


exports.myChecklists = function(req, res){
	
	var query = { 'user' : req.user.id };
	
	Checklist.find(query).populate('user', 'displayName').populate('category').limit(11).sort('-created').exec(function(err, checklists) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(checklists);
		}
	});
	
};

exports.lastVisited = function(req, res){
	
	var query = { 'user' : req.user._id };
	
	History.find(query).populate('checklist').limit(10).sort('-visited').exec(function(err, history){
	
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			
			var options = [{
				path: 'checklist.user',
				model: 'User',
				select: '_id displayName status'
			},{
				path: 'checklist.category',
				model: 'Category',
				select: '_id name'
			}];
			
			Checklist.populate(history, options, function(err, checklists){
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

exports.lastAdded = function(req, res){

	Checklist.find({'status' : 'published'}).populate('user', 'displayName').populate('checklist').populate('category').limit(21).sort('-created').exec(function(err, checklists) {
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
 * Retrun a list of top 5 checklist where the given user is collaborating
 *  ordered by updated -1
 * @param req
 * @param res
 */
exports.collaboratingOn = function(req, res){
	var user = req.user;
	if(user){
		Checklist.find({ collaborators: { $elemMatch : { user: user._id } } }).
			populate('user', 'displayName').populate('checklist').populate('category').
			limit(6).sort('-created').exec(function(err, checklists) {
				if (err) {
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				} else {
					res.jsonp(checklists);
				}
			});
	}else{
		return res.status(401).send({
			message: errorHandler.getErrorMessage("Not user found.")
		});
	}
}

exports.recommended = function(req, res){
	
};
