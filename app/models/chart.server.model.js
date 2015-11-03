'use strict';
/**
 * Created by Hassan on 02/11/2015.
 */

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Chat Schema
 */
var ChatSchema = new Schema({
    checklist: {
        type: Schema.ObjectId,
        ref: 'Checklist'
    },
    username: {
        type: String
    },
    message: {
        type: String,
        trim: true
    },
    created: {
        type: Date,
        default: Date.now
    }
});

ChatSchema.index({ checklist: 1});

mongoose.model('Chat', ChatSchema);





