
const request = require('supertest');
const { expect } = require('chai');
const app = require('../../src/app');
const registry = require('../../src/lib/registry');
const DB = require('../../src/lib/db');
const loadCerts = require('../../src/utils/load_certs');
const { case1 } = require('./fixtures/users.js');

describe('Login Test', () => {
  let thisApp;
  let db;
  const body = {
    username: 'user1',
    password: 'password',
  };
  before(async () => {
    db = new DB();
    db.users[case1.username] = case1;
    registry.db = db;
    registry.privKey = await loadCerts();
    thisApp = app();
  });
	describe('Successfully Log In', () => {
		it('should return an access token when inputting the correct credentials', (done) => {
			request(thisApp)
				.post('/login')
				.send(body)
				.expect('Content-Type', /json/)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);
          const { body } = res;
          expect(body).to.have.property('token');
          expect(body).to.have.property('refreshToken');
					done();
				});
		});
	});
  describe('Unsuccessful Log In', () => {
    it('should not return an access token when credentials are incorret', (done) => {
      const body = {
        username: 'user2',
        password: 'password',
      };
      request(thisApp)
				.post('/login')
				.send(body)
				.expect('Content-Type', /json/)
				.expect(400)
				.end((err, res) => {
					if (err) return done(err);
          const { name, message } = res.body;
          expect(name).to.be.equal('Error');
          expect(message).to.be.equal('username or password incorrect')
					done();
				});
    });
    it('should not return an access token when username is missing', (done) => {
      const body = {
        user: 'user2',
        password: 'password',
      };
      request(thisApp)
				.post('/login')
				.send(body)
				.expect('Content-Type', /json/)
				.expect(400)
				.end((err, res) => {
					if (err) return done(err);
          const { name, message } = res.body;
          expect(name).to.be.equal('Error');
          expect(message[0]).to.be.equal('username is missing')
					done();
				});
    });
    it('should not return an access token when password is missing', (done) => {
      const body = {
        username: 'user2',
        pword: 'password',
      };
      request(thisApp)
				.post('/login')
				.send(body)
				.expect('Content-Type', /json/)
				.expect(400)
				.end((err, res) => {
					if (err) return done(err);
          const { name, message } = res.body;
          expect(name).to.be.equal('Error');
          expect(message[0]).to.be.equal('password is missing')
					done();
				});
    });
  });
});
