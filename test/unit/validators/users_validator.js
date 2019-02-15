
const usersValidator = require('../../../src/validators/users_validator');
const { expect } = require('chai');

describe('testing usersValidator', () => {
	it('should invoke next with no parameters if there are no errors', (done) => {
		const body = {
			username: 'user1',
			password: 'password',
		};
		usersValidator.register({ body }, undefined, (err) => {
			expect(err).to.be.undefined;
			done();
		});
	});
	it('should invoke next with no parameters even if there are additional fields', (done) => {
		const body = {
			username: 'user1',
			password: 'password',
			extra: 'field',
		};
		usersValidator.register({ body }, undefined, (err) => {
			expect(err).to.be.undefined;
			done();
		});
	});
	it('should return an error when username field is missing', (done) => {
		const body = {
			user: 'user1',
			password: 'password',
		};
		usersValidator.register({ body }, undefined, (err) => {
			expect(err).to.be.instanceOf(Error);
			expect(err.message).to.have.length(1);
			expect(err.message[0]).to.be.equal('username is missing');
			done();
		});
	});
	it('should return an error when password field is missing', (done) => {
		const body = {
			username: 'user1',
			pword: 'password',
		};
		usersValidator.register({ body }, undefined, (err) => {
			expect(err).to.be.instanceOf(Error);
			expect(err.message).to.have.length(1);
			expect(err.message[0]).to.be.equal('password is missing');
			done();
		});
	});
	it('should return an error when username and password field is missing', (done) => {
		const body = {
			user: 'user1',
			pword: 'password',
			extra: 'field',
		};
		usersValidator.register({ body }, undefined, (err) => {
			expect(err).to.be.instanceOf(Error);
			expect(err.message).to.have.length(2);
			expect(err.message[0]).to.be.equal('username is missing');
			expect(err.message[1]).to.be.equal('password is missing');
			done();
		});
	});
});
