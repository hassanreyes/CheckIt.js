/**
 * Created by Hassan on 02/11/2015.
 */
var _ = require('lodash'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Checklist = mongoose.model('Checklist'),
    Chat = mongoose.model('Chat');

/**
 * Handle the Working On synchonization among online users
 *
 **/

var validateChannel = function(channel){
    if (!channel || !channel.user) {
        return "not valid channel";
    }
    if(!channel.user.workingOn || !channel.user.workingOn.checklist || !channel.user.workingOn.checklist.id){
        return "user is not working on a valid checklist";
    }
    return null;
}

/*******************************************************************************
 * Exports
 * ****************************************************************************/

/**
 * Check if the user in the channel has a working On with a valid checklist id.
 * Check if he is the author or a collaborator (no matter access level).
 * @param channel
 */
exports.login = function(channel, callback){
    var  errMsg = validateChannel(channel);
    if(errMsg != null){
        callback(errMsg);
    }else{
        //Check if current user is a collaborator
        Checklist.findOne(
        { $and: [
            { _id: channel.user.workingOn.checklist.id },
            { $or:[ { user: channel.user.id }, { 'collaborators.user': channel.user.id }] }
        ]}).exec(function(error, checklist){
            if (error) {
                callback(error, checklist);
            }else{
                if(!checklist){ callback("The user has no edition rights for this list."); }
                else{ callback(null, checklist._id); }
            }
        });
    }
}

/**
 * Retrieve all messages of the WorkingOn.checklist.id
 * @param channel
 */
exports.getMessages = function(channel, callback){
    var  error = validateChannel(channel);
    if(error != null){ return callback(error); }

    Chat.find({checklist: channel.user.workingOn.checklist.id}).sort({created : 1}).
        exec(function(error, messages){
            callback(error, messages);
    });
};

/**
 * Add a message to the checklist chart
 * @param channel
 */
exports.postMessage = function (channel, message, callback) {
    var  error = validateChannel(channel);
    if(error != null){ return callback(error); }

    var message = new Chat({ checklist: channel.user.workingOn.checklist.id,
                            username: channel.user.username,
                            message: message,
                            created: Date.now()});

    message.save(function(error){
        callback(error, message);
    });
};
