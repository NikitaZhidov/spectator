import { Response, Request, Router, NextFunction } from 'express';
import { inject, injectable } from 'inversify';
import { ApiResponse } from '@spectator/api-interfaces';
import { IController } from '../core';
import { TYPES } from '../ioc/types';
import 'reflect-metadata';
import { IPlanRepository } from '../interfaces';

@injectable()
class PlanController implements IController {
	public path = '/plan';
	public router = Router();

	constructor(
		@inject(TYPES.IPlanRepository)
		private readonly _planRepository: IPlanRepository
	) {
		this.initializeRoutes();
	}

	private initializeRoutes() {
		this.router.post(`${this.path}`, this.CreatePlan.bind(this));
		this.router.get(`${this.path}`, this.GetPlans.bind(this));
		this.router.get(`${this.path}/:id`, this.GetPlanById.bind(this));
		this.router.delete(`${this.path}/:id`, this.DeletePlan.bind(this));
		this.router.put(`${this.path}/:id`, this.UpdatePlan.bind(this));
	}

	private async CreatePlan(req: Request, res: Response, next: NextFunction) {
		try {
			const { planToCreate } = req.body;

			const plan = await this._planRepository.Create(planToCreate);
			return res.json(ApiResponse.Ok(plan));
		} catch (error) {
			return next(error);
		}
	}

	private async GetPlans(req: Request, res: Response, next: NextFunction) {
		try {
			const plans = await this._planRepository.GetAll();
			return res.json(ApiResponse.Ok(plans));
		} catch (error) {
			return next(error);
		}
	}

	private async DeletePlan(req: Request, res: Response, next: NextFunction) {
		try {
			const planId = req.params.id;

			if (planId === undefined || planId === null || planId.trim() === '') {
				return ApiResponse.BadReqest(null, ['Некорректный id плана']);
			}

			await this._planRepository.DeletePlan(planId);
			return res.json(ApiResponse.Ok(null));
		} catch (error) {
			return next(error);
		}
	}

	private async GetPlanById(req: Request, res: Response, next: NextFunction) {
		try {
			const planId = req.params.id;

			if (planId === undefined || planId === null || planId.trim() === '') {
				return ApiResponse.BadReqest(null, ['Некорректный id плана']);
			}

			const plan = await this._planRepository.GetById(planId);
			return res.json(ApiResponse.Ok(plan));
		} catch (error) {
			return next(error);
		}
	}

	private async UpdatePlan(req: Request, res: Response, next: NextFunction) {
		try {
			const { planToUpdate } = req.body;
			const planId = req.params.id;

			const plan = await this._planRepository.Update(planToUpdate, planId);
			return res.json(ApiResponse.Ok(plan));
		} catch (error) {
			return next(error);
		}
	}
}

export default PlanController;
