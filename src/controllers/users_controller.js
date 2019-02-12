
const ErrorObject = require('amk-error');
const usersService = require('../services/users_service');

const INVALID_PASSWORD = 'username or password incorrect';
const DUPLICATE = 'Unprocessable Entity';

let self;

class UsersController {

	constructor(users) {
		this.users = users;
		self = this;
	}

	async login(req, res) {
		const { username, password } = req.body;

		const user = self.users.get(username);

		if (user) {
			const isLoggedIn = await usersService.compare(password, user.salt, user.password);
			if (isLoggedIn) {
				const token = await usersService.createJWT(username);
				return res.json({
					token,
					refreshToken: user.refreshToken,
				});
			}
		}
		throw new ErrorObject(INVALID_PASSWORD, 400);
	}

	async register(req, res) {
		const { username, password } = req.body;

		const existingUser = await self.users.get(username);

		if (existingUser) {
			throw new ErrorObject(DUPLICATE, 422);
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

		res.status = 201;
		res.json({
			success: true,
		});
	}
}

module.exports = UsersController;
