/* eslint-disable no-console */

const app = require('./src/app');
const registry = require('./src/lib/registry');
const loadCerts = require('./src/utils/load_certs');
const DB = require('./src/lib/db');

loadCerts().then((cert) => {
	const db = new DB();
	registry.privKey = cert;
	registry.db = db;
}).then(() => {
	app().listen(6010, () => {
		console.log('running');
	});
});
