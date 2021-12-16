import 'reflect-metadata';
import { Container } from 'inversify';
import { IAuthService } from '../interfaces/serivces';
import { AuthService } from '../services';
import { TYPES } from './types';
import AuthController from '../controllers/auth.controller';
import {
	IPlanRepository,
	ISensorDataRepository,
	IUserRepository,
} from '../interfaces';
import {
	PlanRepository,
	SensorDataRepository,
	UserRepository,
} from '../repositories';
import { PlanController } from '../controllers';

const container = new Container();

container
	.bind<IAuthService>(TYPES.IAuthService)
	.to(AuthService)
	.inSingletonScope();

container
	.bind<PlanController>(TYPES.PlanController)
	.to(PlanController)
	.inSingletonScope();

container
	.bind<AuthController>(TYPES.AuthController)
	.to(AuthController)
	.inSingletonScope();

container
	.bind<IUserRepository>(TYPES.IUserRepository)
	.to(UserRepository)
	.inSingletonScope();

container
	.bind<ISensorDataRepository>(TYPES.ISensorDataRepository)
	.to(SensorDataRepository)
	.inSingletonScope();

container
	.bind<IPlanRepository>(TYPES.IPlanRepository)
	.to(PlanRepository)
	.inSingletonScope();

export default container;
