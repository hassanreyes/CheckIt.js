'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    textSearch = require('mongoose-text-search'),
	Schema = mongoose.Schema;

/**
 * Item Schema
 */
var ItemSchema = new Schema( {
    content: {
        type: String,
        default: '',
        trim: true
    },
	description: {
        type: String,
        trim: true
    },
    hints: {
        type: Number,
        default: 0
    },
    status: {
        type: [{
            type: String,
            enum: [ 'draft', 'published', 'vetoed' ]
        }],
        default: 'draft'
    }
});
	
/**
 * Section Schema
 */
var SectionSchema = new Schema( {
	name: {
        type: String,
        default: '',
        required: 'Please fill Checklist name',
        trim: true
    },
	description: {
        type: String,
        trim: true
    },
	hints: {
        type: Number,
        default: 0
    },
	status: {
        type: [{
            type: String,
            enum: [ 'draft', 'published', 'vetoed' ]
        }],
        default: 'draft'
    },
	items : [ItemSchema]
});

/**
 * Checklist Schema
 */
var ChecklistSchema = new Schema( {
    name: {
        type: String,
        default: '',
        required: 'Please fill Checklist name',
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    content: {
        type: String,
        default: '',
        trim: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    reference: {
        type: String,
        trim: true
    },
    hints: {
        type: Number,
        default: 0
    },
    language: {
        type: String,
        default: 'en'
    },
	category: {
        type: Schema.ObjectId,
        ref: 'Category'
    },
    status: {
        type: [{
            type: String,
            enum: [ 'draft', 'published', 'vetoed' ]
        }],
        default: 'draft'
    },
	sections: [SectionSchema],
	collaborators: [
	    {
	        user : {
	          type: Schema.ObjectId,
	          ref: 'User'
	        },
	        access: {
                type: [{
                    type: String,
                    enum: [ 'view', 'comment', 'edit' ]
                }],
                default: 'view'
            }
	    }
    ]
});

// give our schema text search capabilities
ChecklistSchema.plugin(textSearch);

ChecklistSchema.index({ 'name': 'text', 'description': 'text', 'sections.name': 'text', 'sections.description' : 'text', 'sections.items.content': 'text'});

mongoose.model('Checklist', ChecklistSchema);
mongoose.model('Section', SectionSchema);
mongoose.model('Item', ItemSchema);