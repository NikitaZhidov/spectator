import { ApiResponse, PlanData, PlanToCreate } from '@spectator/api-interfaces';
import { baseAxios } from './baseAxios';

export const planApi = {
	async savePlan(planToCreate: PlanToCreate): Promise<PlanData> {
		try {
			const res = await baseAxios.post<ApiResponse<PlanData>>('/plan', {
				planToCreate,
			});
			return res.data.body;
		} catch (error) {
			throw new Error('Plan creating post error');
		}
	},

	async getPlans(): Promise<PlanData[]> {
		try {
			const plans = await baseAxios.get<ApiResponse<PlanData[]>>('/plan');
			return plans.data.body;
		} catch (error) {
			throw new Error('Plans getting error');
		}
	},

	async deletePlan(planId: string): Promise<void> {
		try {
			await baseAxios.delete(`/plan/${planId}`);
		} catch (error) {
			throw new Error('Plan delete error');
		}
	},

	async getPlanById(planId: string): Promise<PlanData> {
		try {
			const res = await baseAxios.get<ApiResponse<PlanData>>(`/plan/${planId}`);
			return res.data.body;
		} catch (error) {
			throw new Error('Plan getting error');
		}
	},

	async updatePlan(planToUpdate: PlanData, planId: string): Promise<PlanData> {
		try {
			const res = await baseAxios.put<ApiResponse<PlanData>>(
				`/plan/${planId}`,
				{
					planToUpdate,
				}
			);

			return res.data.body;
		} catch (error) {
			throw new Error('Update plan error');
		}
	},
};
