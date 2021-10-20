import { Response, Request, Router, NextFunction } from 'express';
import { inject, injectable } from 'inversify';
import { ApiResponse } from '@spectator/api-interfaces';
import { IController } from '../core';
import { IAuthService, ISensorDataRepository } from '../interfaces';
import { TYPES } from '../ioc/types';
import 'reflect-metadata';

@injectable()
class AuthController implements IController {
	public path = '/auth';
	public router = Router();

	constructor(
		@inject(TYPES.IAuthService) private readonly _authService: IAuthService,
		@inject(TYPES.ISensorDataRepository)
		private readonly _sensorDataRep: ISensorDataRepository
	) {
		this.initializeRoutes();
	}

	private initializeRoutes() {
		this.router.get(`${this.path}/test`, this.TestGetMethod.bind(this));
		this.router.get(`${this.path}/ch`, this.TestGetCHMethod.bind(this));
		this.router.post(`${this.path}/test`, this.TestPostMethod.bind(this));
	}

	private async TestGetMethod(req: Request, res: Response, next: NextFunction) {
		try {
			const users = await this._authService.TestGetUsersMethod();
			return res.json(ApiResponse.Ok(users));
		} catch (error) {
			return next(error);
		}
	}

	private async TestGetCHMethod(
		req: Request,
		res: Response,
		next: NextFunction
	) {
		try {
			const result = await this._sensorDataRep.FindAll();
			return res.json(ApiResponse.Ok(result));
		} catch (error) {
			return next(error);
		}
	}

	private async TestPostMethod(
		req: Request,
		res: Response,
		next: NextFunction
	) {
		try {
			const { email, password } = req.body;
			if (
				email === undefined ||
				email.trim() === '' ||
				password === undefined ||
				password === ''
			) {
				return next(
					ApiResponse.BadReqest(null, ['Некорректый логин и пароль'])
				);
			}

			const user = await this._authService.TestCreateUserMethod(
				email,
				password
			);
			return res.json(ApiResponse.Ok(user));
		} catch (error) {
			return next(error);
		}
	}
}

export default AuthController;
