'use strict';

var _ = require('lodash'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Checklist = mongoose.model('Checklist');

/**
 * Handle the Working On synchonization among online users
 * 
 **/

// Dictionary of rooms (indexed by {"checklist:_a_checklist._id" | "user:a_user._id") and its channels 
var _roomChannels = {};

//generate the room identifier
var getRoomId = function(user) {
    var id = null;
    if (user) {
        if (user.workingOn && user.workingOn.checklist && user.workingOn.checklist.id) {
            id = 'checklist_' + user.workingOn.checklist.id.toString();
        }
        else {
            id = 'user_' + user.id.toString();
        }
    }
    return id;
};

var addSocketRef = function(to, id, channel) {
    if (!(id in to)) {
        to[id] = {};
    }
    var skt = to[id];
    if (!(channel.id in skt)) {
        to[id][channel.id] = channel;
    }
};

var removeSocketRef = function(from, id, channel) {
    if (id in from) {
        var skt = from[id];
        if (channel.id in skt) {
            delete from[id][channel.id];
        }

        var skts = _.keys(from[id]);
        if (skts.length == 0) {
            delete from[id];
        }
    }
};

var update = function(property, id, checklist, callback) {
    if (!checklist) {
        return callback("the given checklist is not valid");
    }
    var cklst = JSON.parse(JSON.stringify(checklist));
    objectMetadataDel(cklst);
    var workingOn = {
        updated: Date.now(),
        checklist: cklst
    };
    //Add reference to the original checklist if given
    if (checklist._id) {
        workingOn.checklist.id = checklist._id;
    }

    var conditions = {},
        options = {},
        update = {
            workingOn: workingOn
        };

    switch (property) {
        case 'user':
            conditions = {
                _id: id
            };
            options = {
                multi: false
            };
            break;
        case 'checklist':
            conditions = {
                'workingOn.checklist.id': id
            };
            options = {
                multi: true
            };
            break;
        default:
            console.error("WorkingOnController: " + property + " is not a valid propery.");
            break;
    }

    User.update(conditions, update, options, function(err, n) {
        if(n == 0){ callback("Checklist could not be loaded on working on"); }
        else{ callback(err, workingOn); }
    });
};

var objectMetadataDel = function(copiedObjectWithId) {
    if (copiedObjectWithId != null && typeof(copiedObjectWithId) != 'string' &&
        typeof(copiedObjectWithId) != 'number' && typeof(copiedObjectWithId) != 'boolean') {
        //for array length is defined however for objects length is undefined
        if (typeof(copiedObjectWithId.length) == 'undefined') {
            delete copiedObjectWithId._id;
            delete copiedObjectWithId.__v;
            for (var key in copiedObjectWithId) {
                objectMetadataDel(copiedObjectWithId[key]); //recursive del calls on object elements
            }
        }
        else {
            for (var i = 0; i < copiedObjectWithId.length; i++) {
                objectMetadataDel(copiedObjectWithId[i]); //recursive del calls on array elements
            }
        }
    }
};

/*******************************************************************************
 * Exports
 * ****************************************************************************/

exports.getRoomId = getRoomId;

/**
 * 
 * */
exports.addSocket = function(channel, callback) {
    if (channel && channel.user) {
        var id = getRoomId(channel.user);
        if (id) {
            addSocketRef(_roomChannels, id, channel);
            callback(null, id);
        }
        else {
            return callback('could not create room id');
        }
    }
    else {
        return callback('not valid user');
    }
};

/**
 * 
 * */
exports.removeSocket = function(channel) {
    if (channel && channel.user) {
        var id = getRoomId(channel.user);
        if (id) {
            removeSocketRef(_roomChannels, id, channel);
            //the channel is removed from room automatically
        }
    }
};

/**
 * 
 * */
exports.isInARoom = function(channel) {
    if (!channel || !channel.user) {
        return false;
    }
    var id = getRoomId(channel.user);
    return (id in _roomChannels);
};

/**
 * 
 * */
exports.update = function(channel, checklist, callback) {
    if (!channel || !channel.user) {
        callback("not valid channel");
    }
    var id = getRoomId(channel.user);
    if (id in _roomChannels) {
        var split = id.split('_');
        var prop = split[0];
        var value = split[1];

        update(prop, value, checklist, function(error, workingon) {
            if(error){
                callback(error);
            }else{
                callback(error, workingon, id); //id returned for broadcasting to other collaborator
            }
        });
    }
    else {
        callback('User not logged in');
    }
};

/**
 * 
 * */
exports.edit = function(channel, id, callback) {
    if (!channel || !channel.user) {
        callback("not valid channel");
    }
    Checklist.findOne({
        _id: id,
        user: channel.user.id
    }).exec(function(error, checklist) {
        if (error) {
            callback(error, null);
        }
        else {
            if (checklist) {
                update('user', channel.user.id, checklist, callback);
            }
            else {
                //Check if current user is a collaborator
                Checklist.findOne({ _id: id, 'collaborators.user': channel.user.id, 'collaborators.access': 'edit' }).
                    exec(function(error, checklist){
                        if (checklist) {
                            update('user', channel.user.id, checklist, callback);
                        }else{
                            callback("The user has no edition rights for this list.");
                        }
                });
            }
        }
    });
};

/**
 * @channel tipicaly a socket
 * @checklist the working on checklist to be save
 * @callback as func(err, workingon)
 * */
exports.save = function(channel, checklist, callback) {
    if (!channel || !channel.user) {
        callback("not valid channel");
    }
    
    //Sanity check
    //Fix category and user to an _id value
    if(checklist.category._id){
        checklist.category = checklist.category._id;
    }
    if(!checklist.user){
        checklist.user = channel.user.id;
    }
    if(checklist.user._id){
        checklist.user = checklist.user._id;
    }
    
    //Is it a create or an update
    if (checklist.id) {
        var conditions = { 
            _id         : checklist.id,
            user        : channel.user.id
        },
        update = {
            name        : (checklist.name ? checklist.name : 'Untitled'),
            description : (checklist.description ? checklist.description : ''),
            content     : (checklist.content ? checklist.content : ''),
            reference   : (checklist.reference ?  checklist.reference : ''),
            language    : (checklist.language ? checklist.language : 'en'),
            category    : checklist.category,
            status      : 'draft',
            sections    : (checklist.sections ? checklist.sections : [] )
        },
        options = {
            multi: false
        };

        //Update as author
        Checklist.update(conditions, update, options, function(err, n) {
            if(err) { callback(err); }
            else{
                if(n == 0){
                    //Update as collaborator
                    conditions = {
                        _id: checklist.id,
                        'collaborators.user': channel.user.id,
                        'collaborators.access': 'edit'
                    };

                    Checklist.update(conditions, update, options, function(err, n){
                        if(n == 0){
                            callback("checklist not saved, target checklist not found for the given user");
                            return;
                        }
                    });
                }

                Checklist.findOne({ _id : checklist.id}).exec(function(error, result) {
                    callback(err, result);
                });
            }
        });
    }
    else {
        //create
        var cklst = JSON.parse(JSON.stringify(checklist));
        objectMetadataDel(cklst);
        Checklist.create(cklst, function(err, result){
            if(err) { callback(err); }
            else {
                callback(err, result);
            }
        });
    }
};
