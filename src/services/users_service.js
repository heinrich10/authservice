
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('../utils/jwt');

const SALT_ROUNDS = 10;
const SALT_LENGTH = 256;
const DEFAULT_EXPIRY = 120; // in seconds
const HEX = 'hex';

const createSalt = promisify((cb) => {
	crypto.randomBytes(SALT_LENGTH, (err, buff) => {
		if (err) return cb(err);
		cb(null, buff.toString(HEX));
	});
});

const hashPassword = (password, salt) => {
	const pword = `${salt}${password}`;
	return bcrypt.hash(pword, SALT_ROUNDS);
};

const compare = (password, salt, hash) => {
	const pword = `${salt}${password}`;
	return bcrypt.compare(pword, hash);
};

const createJWT = (username) => {
	const expiry = Math.floor(Date.now() / 1000) + DEFAULT_EXPIRY;
	return jwt.createToken({username}, expiry);
};

module.exports = {
	createSalt,
	hashPassword,
	compare,
	createJWT,
};
