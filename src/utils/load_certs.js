
const { readFile } = require('fs').promises;
const path = require('path');

const registry = require('./registry');

const filePath = path.join(__dirname, '../../sec/priv_key.pem');
module.exports = async () => {
	registry.privKey = await readFile(filePath);
};
