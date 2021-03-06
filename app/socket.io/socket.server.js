'use strict';

var _ = require('lodash'),
	mongoose = require('mongoose'),
	workingOnController = require("../controllers/workingOn.server.controller"),
    chatController = require("../controllers/chat.server.controller"),
	User = mongoose.model('User');

exports.onChatConnect = function(socket){
	console.log("Chat - New Socket connection open in socket: " + socket.id);

	// send the new user their name and a list of users
	socket.emit('user:login request', {
		timestamp: Date.now()
	});

	socket.on('user:login', function(data, callback) {
		if(data && data._id){
			console.log('Chat - user logging in...');

			User.findOne({_id : data._id}).exec(function(error, user){
				if(error){
					callback(error);
				}else{
					socket.user = user;

					chatController.login(socket, function(error, id){
						if(error){
							callback(error);
						}else{
							socket.join(id);
                            chatController.getMessages(socket, function(error, messages){
                                callback(error, messages);
                            });
						}
					});
				}
			});
		}else{
			callback('Not valid user');
		}
	});

	socket.on('send:message', function(message, callback) {
        chatController.postMessage(socket, message, function(error, message){
            if(!error){
                socket.broadcast.to(socket.user.workingOn.checklist.id).emit('send:message', message);
            }
            callback(error, message);
        });
	});

	// clean up when a user leaves, and broadcast it to other users
	socket.on('disconnect', function() {
		workingOnController.removeSocket(socket);
        if(socket.user && socket.user.workingOn && socket.user.workingOn.checklist && socket.user.workingOn.checklist.id){
            socket.broadcast.to(socket.user.workingOn.checklist.id).emit('user:left', {username : socket.user.username});
        }
	});
};

exports.onWorkingOnConnect = function(socket) {
	//var name = userNames.getGuestName();

	console.log("WorkingOn - New Socket connection open in socket: " + socket.id);

	// send the new user their name and a list of users
	socket.emit('user:login request', {
		timestamp: Date.now()
	});

	// notify other clients that a new user has joined
	// socket.broadcast.emit('user:join', {

	// });

	socket.on('user:login', function(data, callback) {
		if(data && data._id){
			console.log('user loging in...');
			
			User.findOne({_id : data._id}).exec(function(error, user){
				if(error){
					callback(error);
				}else{
					socket.user = user;
					if(!user.workingOn.updated) { user.workingOn.updated = Date.now(); }
					workingOnController.addSocket(socket, function(error, id){
						if(error){
							callback(error);
						}else{
							socket.join(id);
							callback(error, user.workingOn);
						}
					});
				}
			});
		}else{
			callback('Not valid user');
		}
	});

	/**
	 * 
	 * */
	socket.on('workingOn:push', function(data, callback) {
		console.log('user pushing...');
		workingOnController.update(socket, data, function(error, workingOn, id){
			//broadcast to all users with the same room's id
			socket.broadcast.to(id).emit('workingOn:updated', { error : error, workingOn : workingOn });
			callback(error, workingOn);
		});
	});

	/**
	 * @data is the checklist id that will be loaded as working on for edition
	 * @callback callback function to report an error and/or the working on document
	 * */
	socket.on('workingOn:edit', function(data, callback) {
		console.log('user editting...');
		var id = data;
		workingOnController.edit(socket, id, function(error, workingOn){
			callback(error, workingOn);
		});
	});
	
	/**
	 * 
	 * */
	socket.on('workingOn:save', function(data, callback) {
		console.log('user saving...');
		var checklist = data;
		workingOnController.save(socket, checklist, function(error, saved_checklist){
			callback(error, saved_checklist);
		});
	});

	// clean up when a user leaves, and broadcast it to other users
	socket.on('disconnect', function() {
		workingOnController.removeSocket(socket);
		socket.broadcast.emit('user:left', {});
	});
};
