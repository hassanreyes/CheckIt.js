'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	materializedPlugin = require('mongoose-materialized'),
	Schema = mongoose.Schema;

/**
 * Category Schema
 */
var CategorySchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Category name',
		trim: true
	},
	description: {
	        type: String,
	        trim: true
    	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

CategorySchema.plugin(materializedPlugin);

var Category = mongoose.model('Category', CategorySchema);

/**
 * Insert initial values
 * */
// Category.findOne({name:'Construction'}).exec(function(error, cat){
// 	cat.getAncestors(function(err, tree){
// 		for(var item in tree){
// 			console.log(item._doc.name);
// 		}	
// 	});
// });

Category.GetRoots({name:'Java'}).then(function(error, root){
	root.getChildren().then(function (err, children) {
        console.log( Category.toTree(children) );
        // or only shown name
        console.log( Category.toTree(children, { name: 1 }) );
    });	
});


