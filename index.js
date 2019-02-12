/* eslint-disable no-console */

const express = require('express');
const responseTime = require('response-time');
const errorHandler = require('api-error-handler');
const wrap = require('amk-wrap');

const loadCerts = require('./src/utils/load_certs');


const app = express();

// models
const Users = require('./src/models/users');

// validators
const usersValidator = require('./src/validators/users_validator');

//controllers
const UsersController = require('./src/controllers/users_controller');

//instantiate models
const users = new Users();

// instantiate controllers
const usersController = new UsersController(users);

app.use(responseTime());
app.post('/login', express.json(), usersValidator.register, wrap(usersController.login));
app.post('/register', express.json(), usersValidator.register, wrap(usersController.register));
app.use(errorHandler());

loadCerts().then(() => {
	app.listen(6010, () => {
		console.log('running');
	});
});
