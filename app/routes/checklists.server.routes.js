'use strict';

module.exports = function(app) {
	var users = require('../controllers/users.server.controller.js');
	var checklists = require('../controllers/checklists.server.controller.js');

	// Checklists Routes
	app.route('/checklists')
		.get(checklists.list)
		.post(users.requiresLogin, checklists.create);

	app.route('/checklists/:checklistId')
		.get(checklists.read)
		.put(users.requiresLogin, checklists.hasAuthorization, checklists.update)
		.delete(users.requiresLogin, checklists.hasAuthorization, checklists.delete);

	app.route('/search/:query')
		.get(checklists.search);
		
	// Sharing
	app.route('/share/:shareId')
		.get(checklists.share);
		
	app.route('/history').put(checklists.updateHistory);
		
	// Finish by binding the Checklist middleware
	app.param('checklistId', checklists.checklistByID);
	app.param('shareId', checklists.shareChecklist);
	app.param('query', checklists.search);
	
	
};
