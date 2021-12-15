import { FigureInfo, PlanData } from '@spectator/api-interfaces';
import { Action } from './planReducer';

export const INIT_PAGE_BY_PLANS = 'INIT_PAGE_BY_PLANS';
export const SELECT_PLAN = 'SELECT_PLAN';
export const DELETE_PLAN = 'DELETE_PLAN';
export const SET_SELECTED_FIGURE = 'SET_SELECTED_FIGURE';

export interface WatchPlanPageState {
	createdPlans: PlanData[];
	createdFigures: FigureInfo[];
	selectOptions: SelectOption[];
	selectedPlan: SelectOption;
	selectedFigure: FigureInfo | undefined;
}

export interface SelectOption {
	label: string;
	value: string;
}

export const watchPlanReducer = (
	state: WatchPlanPageState,
	action: Action
): WatchPlanPageState => {
	switch (action.type) {
		case INIT_PAGE_BY_PLANS: {
			const plans = action.payload as PlanData[];
			const planOptions = plans.map((p) => ({
				label: `${p.title}`,
				value: p.id,
			}));
			const targetOption = planOptions[0] || { label: '', value: '' };
			return {
				...state,
				createdPlans: plans,
				selectOptions: planOptions,
				selectedPlan: targetOption,
				createdFigures:
					plans.find((p) => p.id === targetOption.value)?.figures || [],
			};
		}

		case SELECT_PLAN:
			return {
				...state,
				selectedPlan: action.payload,
				createdFigures:
					state.createdPlans.find((p) => p.id === action.payload.value)
						?.figures || [],
				selectedFigure: undefined,
			};

		case DELETE_PLAN: {
			const createdPlans = state.createdPlans.filter(
				(p) => p.id !== state.selectedPlan.value
			);

			const selectOptions = state.selectOptions.filter(
				(p) => p.value !== state.selectedPlan.value
			);

			const selectedPlan = selectOptions[0] || {
				label: '',
				value: '',
			};

			const createdFigures =
				createdPlans.find((p) => p.id === selectedPlan.value)?.figures || [];

			return {
				...state,
				createdPlans,
				selectOptions,
				selectedPlan,
				createdFigures,
				selectedFigure: undefined,
			};
		}

		case SET_SELECTED_FIGURE:
			return {
				...state,
				selectedFigure: action.payload,
			};

		default:
			throw new Error('Invalid action type');
	}
};
