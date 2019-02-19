/* eslint-disable no-console */

const app = require('./src/app');
const grpcServer = require('./src/gapp');
const registry = require('./src/lib/registry');
const loadCerts = require('./src/utils/load_certs');
const DB = require('./src/lib/db');
const grpcCredentials = require('./src/lib/grpc_credentials');

loadCerts().then((cert) => {
	const db = new DB();
	registry.privKey = cert;
	registry.db = db;
}).then(() => {
	// init api server
	app().listen(6010, () => {
		console.log('http server running...');
	});

	// init grpc server
	const server = grpcServer();
	server.bind('0.0.0.0:6010', grpcCredentials.insecure());
	server.start();
	console.log('grpc server running...');
});
