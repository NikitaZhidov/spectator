import { validationResult } from 'express-validator';

import { Response, Request, Router, NextFunction } from 'express';
import { injectable } from 'inversify';
import { ApiResponse } from '@spectator/api-interfaces';
import { IController } from '../core';

import 'reflect-metadata';
import { UserModel } from '../models';

@injectable()
class AuthController implements IController {
	public path = '/auth';
	public router = Router();

	constructor() {
		this.initializeRoutes();
	}

	private initializeRoutes() {
		this.router.post(`${this.path}/register`, this.RegisterUser.bind(this));

		this.router.get(`${this.path}/user`, this.GetAllUsers.bind(this));
	}

	private async RegisterUser(req: Request, res: Response, next: NextFunction) {
		try {
			const errors = validationResult(req);

			if (!errors.isEmpty()) {
				return res.status(400).json({
					errors: errors.array(),
					message: 'Некорректные данные при регистрации',
				});
			}

			const { login, password } = req.body.newAccount;

			const candidate = await UserModel.findOne({ login });

			if (candidate) {
				return res
					.status(400)
					.json({ message: 'Такой пользователь уже существует' });
			}

			const hashedPass = await this._hashCode(password);
			const user = new UserModel({ login, password: hashedPass });

			await user.save();

			return res.json(ApiResponse.Ok(candidate));
		} catch (error) {
			return next(error);
		}
	}

	private async GetAllUsers(req: Request, res: Response, next: NextFunction) {
		try {
			const users = await UserModel.find({});
			return res.json(ApiResponse.Ok(users));
		} catch (error) {
			return next(error);
		}
	}

	private _hashCode(str: string): number {
		let h: number = 0;

		// eslint-disable-next-line no-plusplus
		for (let i = 0; i < str.length; i++) {
			h = 31 * h + str.charCodeAt(i);
		}
		// eslint-disable-next-line no-bitwise
		return h & 0xffffffff;
	}
}

export default AuthController;
