
const registry = require('../lib/registry');

class Users {

	constructor() {
		this.users = registry.db.users;
	}

	get(username) {
		return this.users[username];
	}

	save({username, password, salt, refreshToken, createdAt, updatedAt}) {
		this.users[username] = {
			username,
			password,
			salt,
			refreshToken,
			createdAt,
			updatedAt,
		};
	}

}

module.exports = Users;
