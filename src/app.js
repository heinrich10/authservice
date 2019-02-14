
const express = require('express');
const responseTime = require('response-time');
const errorHandler = require('api-error-handler');
const wrap = require('amk-wrap');

// models
const Users = require('./models/users');

// validators
const usersValidator = require('./validators/users_validator');

//controllers
const UsersController = require('./controllers/users_controller');

module.exports = () => {
	const app = express();

	//instantiate models
	const users = new Users();

	// instantiate controllers
	const usersController = new UsersController(users);

	app.use(responseTime());
	app.post('/login', express.json(), usersValidator.register, wrap(usersController.login));
	app.post('/register', express.json(), usersValidator.register, wrap(usersController.register));
	app.use(errorHandler());

	return app;
};
