
const usersService = require('../services/users_service');


const INVALID_PASSWORD = 'username or password incorrect';
const DUPLICATE = 'Unprocessable Entity';
const MISSING_FIELDS = 'missing username of password';

let self;

class UsersGcontroller {

	constructor(users) {
		this.users = users;
		self = this;
	}

	async login (call, cb) {
		const { username, password } = call.request;
		const user = self.users.get(username);
		if (user) {
			const isLoggedIn = await usersService.compare(password, user.salt, user.password);
			if (isLoggedIn) {
				const token = await usersService.createJWT(username);
				return cb(null, {
					status: 200,
					token,
					refreshToken: user.refreshToken,
				});
			}
		}
		cb({ status: 400, message: INVALID_PASSWORD });
	}

	async register (call, cb) {
		const { username, password } = call.request;
		if (!username || !password) {
			return cb({ status: 400, message: MISSING_FIELDS });
		}
		const existingUser = await self.users.get(username);

		if (existingUser) {
			return cb({ status: 422, message: DUPLICATE });
		}

		const [salt, refreshToken] = await Promise.all([
			usersService.createSalt(),
			usersService.createSalt(),
		]);

		const hashPassword = await usersService.hashPassword(password, salt);

		self.users.save({
			username,
			password: hashPassword,
			salt, refreshToken,
			createdAt: new Date(),
			updatedAt: new Date(),
		});
		cb(null, { status: 201, message: 'success'});
	}

}

module.exports = UsersGcontroller;
