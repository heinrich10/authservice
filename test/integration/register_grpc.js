
const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const { expect } = require('chai');
const grpcServer = require('../../src/gapp');
const registry = require('../../src/lib/registry');
const DB = require('../../src/lib/db');
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

const SERVER_URL = '0.0.0.0:6010';
const CLIENT_URL = 'localhost:6010';

describe('Register Test using gRPC', () => {
	let client;
	before(() => {
		const users_proto = grpc.loadPackageDefinition(packageDefinition).users;
		client = new users_proto.Users(CLIENT_URL, grpc.credentials.createInsecure());
	});
	describe('Successfully create a user', () => {
		let db;
		let server;
		before(() => {
			db = new DB();
			registry.db = db;
			server = grpcServer();
			server.bind(SERVER_URL, grpcCredentials.insecure());
			server.start();
		});
		after(() => {
			server.forceShutdown();
		});
		it('should return success is true when supplied with username and password', (done) => {
			const params = {
				username: 'user1',
				password: 'password',
			};
			client.register(params, (err, response) => {
				const { status, message } = response;
				expect(status).to.be.equal(201);
				expect(message).to.be.equal('success');
				expect(db.get(params.username)).to.be.not.undefined;
				done(err);
			});
		});
	});
	describe('Don\'t allow duplicate users', () => {
		let db;
		let server;
		const params = {
			username: 'user2',
			password: 'password',
		};
		before(() => {
			db = new DB();
			registry.db = db;
			server = grpcServer();
			server.bind(SERVER_URL, grpcCredentials.insecure());
			server.start();
		});
		after(() => {
			server.forceShutdown();
		});
		it('should create a new user', (done) => {
			client.register(params, (err, response) => {
				const { status, message } = response;
				expect(status).to.be.equal(201);
				expect(message).to.be.equal('success');
				expect(db.get(params.username)).to.be.not.undefined;
				done(err);
			});
		});
		it('should return an error because of duplicate user', (done) => {
			client.register(params, (err, response) => {
				expect(err).to.be.instanceOf(Error);
				expect(err.details).to.be.equal('Unprocessable Entity');
				expect(response).to.be.undefined;
				done();
			});
		});
	});
	describe('Won\'t create a user if there is an error', () => {
		let db;
		let server;
		before(() => {
			db = new DB();
			registry.db = db;
			server = grpcServer();
			server.bind(SERVER_URL, grpcCredentials.insecure());
			server.start();
		});
		after(() => {
			server.forceShutdown();
		});
		it('should not have a user entry when username field name is incorrect', (done) => {
			const params = {
				user: 'user2',
				password: 'password',
			};
			client.register(params, (err, response) => {
				expect(err).to.be.instanceOf(Error);
				expect(err.details).to.be.equal('missing username of password');
				expect(response).to.be.undefined;
				expect(db.get()).to.be.deep.equal([]);
				done();
			});
		});
		it('should not have a user entry when password field name is incorrect', (done) => {
			const params = {
				username: 'user2',
				pword: 'password',
			};
			client.register(params, (err, response) => {
				expect(err).to.be.instanceOf(Error);
				expect(err.details).to.be.equal('missing username of password');
				expect(response).to.be.undefined;
				expect(db.get()).to.be.deep.equal([]);
				done();
			});
		});
	});
});
