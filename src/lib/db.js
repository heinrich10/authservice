
class DB {

	constructor() {
		this.users = [];
	}

	set(username, values) {
		this.users[username] = values;
	}

	get(username) {
		if (arguments.length === 0) {
			return this.users;
		}
		return this.users[username];
	}

	reset() {
		this.users = [];
	}

}

module.exports = DB;
