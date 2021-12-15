import { PlanData } from '@spectator/api-interfaces';
import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { planApi } from '../api/planApi';
import { PreloaderOverlay } from '../components';
import { AppRoutes } from '../constants';
import { CreatePlanPage } from './CreatePlanPage';

export const EditPlanPage = () => {
	const { id } = useParams() as any;

	const history = useHistory();

	const [isLoadingPlan, setIsLoadingPlan] = useState(false);
	const [planData, setPlanData] = useState<PlanData>();

	useEffect(() => {
		setIsLoadingPlan(true);
		planApi.getPlanById(id).then((plan) => {
			if (plan === null) {
				history.push(AppRoutes.PlanCreate);
			} else {
				setPlanData(plan);
			}
			setIsLoadingPlan(false);
		});
	}, [id, history]);

	const updatePlan = async (planToUpdate: PlanData, planId: string) => {
		const plan = await planApi.updatePlan(planToUpdate, planId);
		return plan;
	};

	if (isLoadingPlan) {
		return <PreloaderOverlay />;
	}

	return <CreatePlanPage updatePlan={updatePlan} planData={planData} />;
};
