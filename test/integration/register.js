
const request = require('supertest');
const { expect } = require('chai');
const app = require('../../src/app');
const registry = require('../../src/lib/registry');
const DB = require('../../src/lib/db');

describe('Login Test', () => {
	describe('Successfully create a user', () => {
		let thisApp;
		let db;
		before(() => {
			db = new DB();
			registry.db = db;
			thisApp = app();
		});
		it('should return success is true when supplied with username and password', (done) => {
			const body = {
				username: 'user1',
				password: 'password',
			};
			request(thisApp)
				.post('/register')
				.send(body)
				.expect('Content-Type', /json/)
				.expect(201)
				.end((err, res) => {
					if (err) return done(err);
					expect(res.body.success).to.be.equal(true);
					expect(db.get(body.username)).to.be.not.undefined;
					done();
				});
		});
	});
	describe('Don\'t allow duplicate users', () => {
		let thisApp;
		let db;
		const body = {
			username: 'user2',
			password: 'password',
		};
		before(() => {
			db = new DB();
			registry.db = db;
			thisApp = app();
		});
		it('should create a new user', (done) => {
			request(thisApp)
				.post('/register')
				.send(body)
				.expect('Content-Type', /json/)
				.expect(201)
				.end((err, res) => {
					if (err) return done(err);
					expect(res.body.success).to.be.equal(true);
					expect(db.get(body.username)).to.be.not.undefined;
					done();
				});
		});
		it('should return an error because of duplicate user', (done) => {
			request(thisApp)
				.post('/register')
				.send(body)
				.expect('Content-Type', /json/)
				.expect(422)
				.end((err, res) => {
					if (err) return done(err);
					const { message, name } = res.body;
					expect(message).to.be.equal('Unprocessable Entity');
					expect(name).to.be.equal('Error');
					done();
				});
		});
	});
	describe('Won\'t create a user if there is an error', () => {
		let thisApp;
		let db;
		before(() => {
			db = new DB();
			registry.db = db;
			thisApp = app();
		});
		it('should not have a user entry when username field name is incorrect', (done) => {
			const body = {
				user: 'user2',
				password: 'password',
			};
			request(thisApp)
				.post('/register')
				.send(body)
				.expect('Content-Type', /json/)
				.expect(400)
				.end((err, res) => {
					if(err) return done(err);
					const { message, name } = res.body;
					expect(message[0]).to.be.equal('username is missing');
					expect(name).to.be.equal('Error');
					expect(db.get()).to.be.deep.equal([]);
					done();
				});
		});
		it('should not have a user entry when password field name is incorrect', (done) => {
			const body = {
				username: 'user2',
				pword: 'password',
			};
			request(thisApp)
				.post('/register')
				.send(body)
				.expect('Content-Type', /json/)
				.expect(400)
				.end((err, res) => {
					if(err) return done(err);
					const { message, name } = res.body;
					expect(message[0]).to.be.equal('password is missing');
					expect(name).to.be.equal('Error');
					expect(db.get()).to.be.deep.equal([]);
					done();
				});
		});
	});
});
