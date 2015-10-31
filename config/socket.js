'use strict';

var socket = require('../app/socket.io/socket.server.js');

module.exports = function(server){
    
    // // Attach socket
    var io = require("socket.io")(server);

    io.set("transports", ["xhr-polling"]);
    io.set("polling duration", 20);
    
    //The '/workingOn' namespace handle with all collaborative working over a checklist
    var workingOn = io.of('/workingOn');
    //The '/chat' namespace handle with all chatting communcations
    var chat = io.of('/chat');
    
    //Hook Socket.io into Express
    workingOn.on('connection', socket.onWorkingOnConnect);
    
    return io;
};
