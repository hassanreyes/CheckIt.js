'use strict';

module.exports = function(app) {
	var users = require('../controllers/users.server.controller.js');
	var categories = require('../controllers/categories.server.controller.js');

	// Categories Routes
	app.route('/categories')
		.get(categories.list)
		.post(users.requiresLogin, categories.create);

	app.route('/categories/:categoryId')
		.get(categories.read)
		.put(users.requiresLogin, categories.hasAuthorization, categories.update)
		.delete(users.requiresLogin, categories.hasAuthorization, categories.delete);
		
	app.route('/categories-tree')
		.get(categories.tree);

	// Finish by binding the Category middleware
	app.param('categoryId', categories.categoryByID);
};
