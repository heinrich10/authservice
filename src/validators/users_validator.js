
const ErrorObject = require('amk-error');

exports.register = (req, res, next) => {
	const { body } = req;

	const error = [];

	if (typeof body.username !== 'string') {
		error.push('username is missing');
	}

	if (typeof body.password !== 'string') {
		error.push('password is missing');
	}

	if (error.length > 0) {
		throw new ErrorObject(error, 400);
	}

	next();
};
