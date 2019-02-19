
const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');

const UsersGcontroller = require('./gcontrollers/users_controller');
const Users = require('./models/users');

const PROTO_PATH = __dirname + '/proto/users.proto';

module.exports = () => {
	const packageDefinition = protoLoader.loadSync(
		PROTO_PATH,
		{
			keepCase: true,
			longs: String,
			enums: String,
			defaults: true,
			oneofs: true
		});

	const users_proto = grpc.loadPackageDefinition(packageDefinition).users;

	const users = new Users();
	const usersGcontroller = new UsersGcontroller(users);


	const services = {
		login: usersGcontroller.login,
		register: usersGcontroller.register,
	};

	const server = new grpc.Server();

	server.addService(users_proto.Users.service, services);

	return server;
};
