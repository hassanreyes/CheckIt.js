'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Checklist = mongoose.model('Checklist'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, checklist;

/**
 * Checklist routes tests
 */
describe('Checklist CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Checklist
		user.save(function() {
			checklist = {
				name: 'Checklist Name'
			};

			done();
		});
	});

	it('should be able to save Checklist instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Checklist
				agent.post('/checklists')
					.send(checklist)
					.expect(200)
					.end(function(checklistSaveErr, checklistSaveRes) {
						// Handle Checklist save error
						if (checklistSaveErr) done(checklistSaveErr);

						// Get a list of Checklists
						agent.get('/checklists')
							.end(function(checklistsGetErr, checklistsGetRes) {
								// Handle Checklist save error
								if (checklistsGetErr) done(checklistsGetErr);

								// Get Checklists list
								var checklists = checklistsGetRes.body;

								// Set assertions
								(checklists[0].user._id).should.equal(userId);
								(checklists[0].name).should.match('Checklist Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Checklist instance if not logged in', function(done) {
		agent.post('/checklists')
			.send(checklist)
			.expect(401)
			.end(function(checklistSaveErr, checklistSaveRes) {
				// Call the assertion callback
				done(checklistSaveErr);
			});
	});

	it('should not be able to save Checklist instance if no name is provided', function(done) {
		// Invalidate name field
		checklist.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Checklist
				agent.post('/checklists')
					.send(checklist)
					.expect(400)
					.end(function(checklistSaveErr, checklistSaveRes) {
						// Set message assertion
						(checklistSaveRes.body.message).should.match('Please fill Checklist name');
						
						// Handle Checklist save error
						done(checklistSaveErr);
					});
			});
	});

	it('should be able to update Checklist instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Checklist
				agent.post('/checklists')
					.send(checklist)
					.expect(200)
					.end(function(checklistSaveErr, checklistSaveRes) {
						// Handle Checklist save error
						if (checklistSaveErr) done(checklistSaveErr);

						// Update Checklist name
						checklist.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Checklist
						agent.put('/checklists/' + checklistSaveRes.body._id)
							.send(checklist)
							.expect(200)
							.end(function(checklistUpdateErr, checklistUpdateRes) {
								// Handle Checklist update error
								if (checklistUpdateErr) done(checklistUpdateErr);

								// Set assertions
								(checklistUpdateRes.body._id).should.equal(checklistSaveRes.body._id);
								(checklistUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Checklists if not signed in', function(done) {
		// Create new Checklist model instance
		var checklistObj = new Checklist(checklist);

		// Save the Checklist
		checklistObj.save(function() {
			// Request Checklists
			request(app).get('/checklists')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Checklist if not signed in', function(done) {
		// Create new Checklist model instance
		var checklistObj = new Checklist(checklist);

		// Save the Checklist
		checklistObj.save(function() {
			request(app).get('/checklists/' + checklistObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', checklist.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Checklist instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Checklist
				agent.post('/checklists')
					.send(checklist)
					.expect(200)
					.end(function(checklistSaveErr, checklistSaveRes) {
						// Handle Checklist save error
						if (checklistSaveErr) done(checklistSaveErr);

						// Delete existing Checklist
						agent.delete('/checklists/' + checklistSaveRes.body._id)
							.send(checklist)
							.expect(200)
							.end(function(checklistDeleteErr, checklistDeleteRes) {
								// Handle Checklist error error
								if (checklistDeleteErr) done(checklistDeleteErr);

								// Set assertions
								(checklistDeleteRes.body._id).should.equal(checklistSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Checklist instance if not signed in', function(done) {
		// Set Checklist user 
		checklist.user = user;

		// Create new Checklist model instance
		var checklistObj = new Checklist(checklist);

		// Save the Checklist
		checklistObj.save(function() {
			// Try deleting Checklist
			request(app).delete('/checklists/' + checklistObj._id)
			.expect(401)
			.end(function(checklistDeleteErr, checklistDeleteRes) {
				// Set message assertion
				(checklistDeleteRes.body.message).should.match('User is not logged in');

				// Handle Checklist error error
				done(checklistDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Checklist.remove().exec();
		done();
	});
});