
const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const { expect } = require('chai');
const grpcServer = require('../../src/gapp');
const registry = require('../../src/lib/registry');
const DB = require('../../src/lib/db');
const loadCerts = require('../../src/utils/load_certs');
const { case1 } = require('./fixtures/users');
const grpcCredentials = require('../../src/lib/grpc_credentials');

const PROTO_PATH = './src/proto/users.proto';
const packageDefinition = protoLoader.loadSync(
	PROTO_PATH,
	{
		keepCase: true,
		longs: String,
		enums: String,
		defaults: true,
		oneofs: true
	}
);
const users_proto = grpc.loadPackageDefinition(packageDefinition).users;

const SERVER_URL = '0.0.0.0:6010';
const CLIENT_URL = 'localhost:6010';

describe('Login Test using gRPC', () => {
	let client;
	let server;
	before(async () => {
		const db = new DB();
		db.users[case1.username] = case1;
		registry.db = db;
		registry.privKey = await loadCerts();

		client = new users_proto.Users(CLIENT_URL, grpc.credentials.createInsecure());
		server = grpcServer();
		server.bind(SERVER_URL, grpcCredentials.insecure());
		server.start();
	});
	after(() => {
		server.forceShutdown();
	});
	describe('Successfully Log In', () => {
		it('should return an access token when inputting the correct credentials', (done) => {
			const params = {
				username: 'user1',
				password: 'password',
			};
			client.login(params, (err, response) => {
				const { status, token, refreshToken } = response;
				expect(status).to.be.equal(200);
				expect(token).to.be.not.null;
				expect(refreshToken).to.be.not.null;
				done(err);
			});
		});
	});
	describe('Unsuccessful Log In', () => {
		it('should not return an access token when credentials are incorret', (done) => {
			const params = {
				username: 'user2',
				password: 'password',
			};
			client.login(params, (err, response) => {
				expect(err).to.be.instanceOf(Error);
				expect(err.details).to.be.equal('username or password incorrect');
				expect(response).to.be.undefined;
				done();
			});
		});
		it('should not return an access token when username is missing', (done) => {
			const params = {
				user: 'user2',
				password: 'password',
			};
			client.login(params, (err, response) => {
				expect(err).to.be.instanceOf(Error);
				expect(err.details).to.be.equal('username or password incorrect');
				expect(response).to.be.undefined;
				done();
			});
		});
		it('should not return an access token when password is missing', (done) => {
			const params = {
				username: 'user2',
				pword: 'password',
			};
			client.login(params, (err, response) => {
				expect(err).to.be.instanceOf(Error);
				expect(err.details).to.be.equal('username or password incorrect');
				expect(response).to.be.undefined;
				done();
			});
		});
	});
});
