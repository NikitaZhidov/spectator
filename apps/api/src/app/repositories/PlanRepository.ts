import { v4 as uuidv4 } from 'uuid';
import { PlanData, PlanToCreate } from '@spectator/api-interfaces';
import { injectable } from 'inversify';
import { PlanModel } from '../models';
import { IPlanRepository } from '../interfaces';

@injectable()
class PlanRepository implements IPlanRepository {
	async Create(planToCreate: PlanToCreate): Promise<PlanData> {
		const planId = uuidv4();
		const plan = new PlanModel({
			title: planToCreate.title || planId,
			id: planId,
			figures: planToCreate.figures,
		});

		await plan.save();

		return plan;
	}

	async GetAll(): Promise<PlanData[]> {
		const plans = await PlanModel.find({});
		return plans;
	}

	async DeletePlan(id: string): Promise<void> {
		await PlanModel.deleteOne({ id });
	}

	async GetById(id: string): Promise<PlanData> {
		const plan = await PlanModel.findOne({ id });
		return plan;
	}

	async Update(planToUpdate: PlanData, planId: string): Promise<PlanData> {
		const plan = await PlanModel.findOne({ id: planId });
		plan.figures = planToUpdate.figures;
		plan.title = planToUpdate.title;
		await plan.save();
		return plan;
	}
}

export default PlanRepository;
