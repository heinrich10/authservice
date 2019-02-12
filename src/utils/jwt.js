
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const registry = require('./registry');

const createToken = promisify((payload, expiry, cb) => {
	payload.exp = expiry;
	jwt.sign(
		payload,
		registry.privKey,
		{ algorithm: 'RS256' },
		(err, token) => {
			if (err) return cb(err);
			cb(null, token);
		}
	);
});

module.exports = {
	createToken,
};
