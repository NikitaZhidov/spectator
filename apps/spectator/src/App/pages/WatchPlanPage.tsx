import { Box, Button } from '@material-ui/core';
import { FigureInfo } from '@spectator/api-interfaces';
import React, { useEffect, useReducer, useState } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import Select from 'react-select';
import { planApi } from '../api/planApi';
import { Plan, PreloaderOverlay, WindowWrapper } from '../components';
import { AppRoutes, PlanConstants } from '../constants';
import {
	DELETE_PLAN,
	INIT_PAGE_BY_PLANS,
	SelectOption,
	SELECT_PLAN,
	SET_SELECTED_FIGURE,
	WatchPlanPageState,
	watchPlanReducer,
} from '../reducers';

export const WatchPlanPage: React.FC = () => {
	const [state, dispatch] = useReducer(watchPlanReducer, {
		createdFigures: [],
		selectOptions: [],
		selectedPlan: { label: '', value: '' },
		createdPlans: [],
		selectedFigure: undefined,
	} as WatchPlanPageState);

	const { id } = useParams() as any;
	const history = useHistory();

	const [isLoadingPlans, setIsLoadingPlans] = useState(false);
	const [isDeletingPlan, setIsDeletingPlan] = useState(false);

	useEffect(() => {
		if (id && state.selectOptions.length > 0) {
			dispatch({
				type: SELECT_PLAN,
				payload:
					state.selectOptions.find((o) => o.value === id) ||
					state.selectOptions[0],
			});
		}
	}, [id, state.createdPlans, state.selectOptions]);

	useEffect(() => {
		setIsLoadingPlans(true);
		planApi.getPlans().then((plans) => {
			dispatch({ type: INIT_PAGE_BY_PLANS, payload: plans });
			setIsLoadingPlans(false);
		});
	}, []);

	const onChangeSelectedPlan = (newSelectedPlan: SelectOption) => {
		history.push(AppRoutes.RouteToWatchPlan(newSelectedPlan.value));
	};

	const onDeletePlan = async () => {
		setIsDeletingPlan(true);
		await planApi.deletePlan(state.selectedPlan.value);
		dispatch({ type: DELETE_PLAN, payload: null });
		setIsDeletingPlan(false);
	};

	const onSelectFigure = (figure: FigureInfo | undefined) => {
		dispatch({ type: SET_SELECTED_FIGURE, payload: figure });
	};

	return (
		<>
			{(isLoadingPlans || isDeletingPlan) && <PreloaderOverlay />}
			<Box>
				<Box style={{ marginBottom: '10px' }}>
					<WindowWrapper>
						<Select
							onChange={(newSelectedPlan) => {
								if (newSelectedPlan) {
									onChangeSelectedPlan(newSelectedPlan);
								}
							}}
							styles={{
								option: (provided) => ({
									...provided,
									color: 'black',
								}),
							}}
							value={state.selectedPlan}
							options={state.selectOptions}
						/>
					</WindowWrapper>
				</Box>
				<Box>
					<WindowWrapper>
						<Box minHeight="25px" color="black">
							{state.selectedFigure && state.selectedFigure.title}
						</Box>
						<Box style={{ marginBottom: '15px' }}>
							<Plan
								onClickBgPlan={() => onSelectFigure(undefined)}
								onClickFigure={onSelectFigure}
								editingFigure={state.selectedFigure}
								createdFigures={state.createdFigures}
								widthInPx={PlanConstants.widthInPx}
								heightInPx={PlanConstants.heightInPx}
							/>
						</Box>
						<Box display="flex">
							{state.createdPlans.length > 0 && (
								<Button
									variant="contained"
									style={{ marginRight: '10px' }}
									color="secondary"
									onClick={onDeletePlan}
								>
									Удалить
								</Button>
							)}
							{state.selectedPlan.value && (
								<Link to={AppRoutes.RouteToPlanEdit(state.selectedPlan.value)}>
									<Button variant="contained" color="primary">
										Редактировать
									</Button>
								</Link>
							)}
						</Box>
					</WindowWrapper>
				</Box>
			</Box>
		</>
	);
};
