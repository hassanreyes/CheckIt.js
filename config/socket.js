'use strict';

var socket = require('../app/socket.io/socket.server.js');

module.exports = function(server){
    
    // // Attach socket
    var io = require("socket.io").listen(server);

    //The '/workingOn' namespace handle with all collaborative working over a checklist
    var workingOn = io.of('/workingOn');
    //The '/chat' namespace handle with all chatting communcations
    var chat = io.of('/chat');
    
    //Hook Socket.io into Express
    workingOn.on('connection', socket.onWorkingOnConnect);
    chat.on('connection', socket.onChatConnect);

    console.log('Socket attached and listening');
    
    return io;
};
