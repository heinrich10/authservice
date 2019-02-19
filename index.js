/* eslint-disable no-console */

const app = require('./src/app');
const grpcServer = require('./src/gapp');
const registry = require('./src/lib/registry');
const loadCerts = require('./src/utils/load_certs');
const DB = require('./src/lib/db');
const grpcCredentials = require('./src/lib/grpc_credentials');
const { INTERFACE, PORT } = require('./config');

loadCerts().then((cert) => {
	const db = new DB();
	registry.privKey = cert;
	registry.db = db;
}).then(() => {
	if (INTERFACE === 'grpc') {
		// init grpc server
		const server = grpcServer();
		server.bind(`0.0.0.0:${PORT}`, grpcCredentials.insecure());
		server.start();
		console.log(`grpc server listneing on ${PORT}...`);
	} else {
		// init api server
		app().listen(PORT, () => {
			console.log(`http server listening on ${PORT}...`);
		});
	}
});
