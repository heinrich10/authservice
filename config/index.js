/* eslint-disable no-process-env */

const {
	INTERFACE = 'rest',
	PORT = 6010,
} = process.env;

module.exports = {
	INTERFACE,
	PORT,
};
