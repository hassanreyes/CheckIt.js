'use strict';

module.exports = function(app) {
	var users = require('../controllers/users.server.controller.js');
	var browse = require('../controllers/browse.server.controller.js');
	
	// Checklists Routes
	app.route('/browse')
		.get(browse.list);

};
