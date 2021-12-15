import 'reflect-metadata';
import * as express from 'express';
import * as cors from 'cors';
import { connect } from 'mongoose';
import { mongoConfig } from './app/config/db';
import { AuthController, PlanController } from './app/controllers';
import { errorMiddleware, IController } from './app/core';
import container from './app/ioc/inversify.config';
import { TYPES } from './app/ioc/types';

const PORT = process.env.SERVER_PORT || 3333;

class App {
	public app: express.Application;

	constructor(controllers: IController[]) {
		this.app = express();

		this.connectToDatabases();
		this.initializeMiddlewares();
		this.initializeControllers(controllers);
		this.initializeErrorHandling();
	}

	public listen() {
		this.app.listen(PORT, () =>
			// eslint-disable-next-line no-console
			console.log(`Listening at http://localhost:${PORT}/`)
		);
	}

	private initializeMiddlewares() {
		this.app.use(cors());
		this.app.use(express.json());
		this.app.use(express.urlencoded({ extended: true }));
	}

	private initializeErrorHandling() {
		this.app.use(errorMiddleware);
	}

	private initializeControllers(controllers: IController[]) {
		controllers.forEach((controller) => {
			this.app.use('/api', controller.router);
		});
	}

	private connectToDatabases() {
		connect(
			`mongodb://${mongoConfig.username}:${mongoConfig.password}@${mongoConfig.hostname}:${mongoConfig.port}/${mongoConfig.database}?authSource=admin`,
			(err) => {
				if (err) throw err;
				// eslint-disable-next-line no-console
				console.log(`Successfully connected to MongoDB`);
			}
		);
	}
}

const mainApp = new App([
	container.get<PlanController>(TYPES.PlanController),
	container.get<AuthController>(TYPES.AuthController),
]);

mainApp.listen();
