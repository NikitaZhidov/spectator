import { PlanData, PlanToCreate } from '@spectator/api-interfaces';

export interface IPlanRepository {
	Create(planToCreate: PlanToCreate): Promise<PlanData>;
	Update(planToUpdate: PlanData, planId: string): Promise<PlanData>;
	GetAll(): Promise<PlanData[]>;
	DeletePlan(id: string): Promise<void>;
	GetById(id: string): Promise<PlanData>;
}
