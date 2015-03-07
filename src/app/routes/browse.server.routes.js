'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var browse = require('../../app/controllers/browse.server.controller');

	// Checklists Routes
	app.route('/browse')
		.get(browse.list);

};
