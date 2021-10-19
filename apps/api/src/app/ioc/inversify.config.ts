import { Container } from 'inversify';
import { IAuthService } from '../interfaces/serivces';
import { AuthService } from '../services';
import { TYPES } from './types';
import AuthController from '../controllers/auth.controller';
import { IUserRepository } from '../interfaces';
import { UserRepository } from '../repositories';

const container = new Container();

container
	.bind<IAuthService>(TYPES.IAuthService)
	.to(AuthService)
	.inSingletonScope();

container
	.bind<AuthController>(TYPES.AuthController)
	.to(AuthController)
	.inSingletonScope();

container
	.bind<IUserRepository>(TYPES.IUserRepository)
	.to(UserRepository)
	.inSingletonScope();

export default container;
