
const grpc = require('grpc');

exports.insecure = () => {
	return grpc.ServerCredentials.createInsecure();
};
