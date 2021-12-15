import { Box, Button, TextField } from '@material-ui/core';
import { FigureInfo, FigureType, PlanData } from '@spectator/api-interfaces';
import React, { useEffect, useReducer, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Subject } from 'rxjs';
import { planApi } from '../api/planApi';
import { Plan, PreloaderOverlay, WindowWrapper } from '../components';
import { FigureTool } from '../components/plan/FigureTool';
import { AppRoutes, PlanConstants } from '../constants';
import { useMoveFigue, useResizeFigue } from '../hooks';
import {
	ADD_EDITING_FIGURE_FROM_COPY_BUFFER,
	ADD_EDITING_FIGURE_TO_COPY_BUFFER,
	ADD_FIGURE,
	CreatePlanPageState,
	DELETE_EDITING_FIGURE,
	DELETE_FIGURE,
	EDIT_FIGURE,
	planReducer,
	SAVE_PLAN,
	SET_CREATED_FIGURES,
	SET_EDITING_BUFFER_FIGURE,
	SET_EDITING_FIGURE,
	SET_FIGURE_TITLE,
	SET_PLAN_TITLE,
	SET_PREV_STATE,
	SWITCH_SHOWGRID,
} from '../reducers';

const figureTools: FigureType[] = [
	FigureType.rectangle,
	FigureType.ellipse,
	FigureType.line,
];

export interface CreatePlanPageProps {
	planData?: PlanData;
	updatePlan?: (planToUpdate: PlanData, planId: string) => Promise<PlanData>;
}

const RESIZE_PONTS_SIZE = 10;

export const CreatePlanPage: React.FC<CreatePlanPageProps> = ({
	planData,
	updatePlan,
}: CreatePlanPageProps) => {
	const history = useHistory();

	const $plan = useRef(null);

	const [state, dispatch] = useReducer(planReducer, {
		editingBufferFigure: null,
		createdFigures: planData?.figures || [],
		stateStack: [],
		editingFigure: undefined,
		showGrid: false,
		copyFigureBuffer: undefined,
		isEditTitle: true,
		planTitle: planData?.title || `Plan${Date.now().toString()}`,
	} as CreatePlanPageState);

	useEffect(() => {
		if (planData) {
			dispatch({ type: SET_PLAN_TITLE, payload: planData.title });
			dispatch({ type: SET_CREATED_FIGURES, payload: planData.figures });
		}
	}, [planData]);

	const [isSavingPlan, setIsSavingPlan] = useState<boolean>(false);

	const onClickFigure = (figure: FigureInfo) => {
		dispatch({ type: SET_EDITING_FIGURE, payload: figure });
	};

	const onClickBgPlan = () => {
		dispatch({ type: SET_EDITING_FIGURE, payload: undefined });
	};

	const onDeleteFigure = () => {
		if (state.editingFigure) {
			dispatch({ type: DELETE_FIGURE, payload: state.editingFigure });
		}
	};

	const onSelectFigureTool = (type: FigureType) => {
		const figure: FigureInfo = {
			type,
			begin: { x: 80, y: 80 },
			end: { x: 140, y: 140 },
			id: Date.now().toString(),
			title: `Figure${Date.now().toString()}`,
		};

		dispatch({
			type: ADD_FIGURE,
			payload: figure,
		});
	};

	const setPrevState = () => {
		dispatch({ type: SET_PREV_STATE, payload: null });
	};

	const startResizing = useResizeFigue();
	const startMoving = useMoveFigue();

	useEffect(() => {
		if (state.editingFigure) {
			const moving$ = new Subject<FigureInfo>();
			const move$ = new Subject<FigureInfo>();

			const movingSubscription = startMoving(
				$plan.current,
				state.editingFigure,
				moving$,
				move$,
				RESIZE_PONTS_SIZE
			).subscribe();

			moving$.subscribe((figureInfo) => {
				dispatch({ type: SET_EDITING_BUFFER_FIGURE, payload: figureInfo });
			});

			move$.subscribe((figureInfo) => {
				dispatch({ type: EDIT_FIGURE, payload: figureInfo });
				movingSubscription.unsubscribe();
			});

			const resizing$ = new Subject<FigureInfo>();
			const resize$ = new Subject<FigureInfo>();

			const subscription = startResizing(
				$plan.current,
				state.editingFigure,
				resizing$,
				resize$,
				RESIZE_PONTS_SIZE
			).subscribe();

			resizing$.subscribe((figureInfo) => {
				dispatch({ type: SET_EDITING_BUFFER_FIGURE, payload: figureInfo });
			});
			resize$.subscribe((figureInfo) => {
				dispatch({ type: EDIT_FIGURE, payload: figureInfo });
				subscription.unsubscribe();
			});

			return () => {
				subscription.unsubscribe();
				movingSubscription.unsubscribe();
			};
		}

		return () => {};
	}, [startResizing, startMoving, state.editingFigure]);

	useEffect(() => {
		const ctrlZListener = (e: KeyboardEvent) => {
			if (e.ctrlKey && e.key === 'z') {
				setPrevState();
			}
		};

		const ctrlCListener = (e: KeyboardEvent) => {
			if (e.ctrlKey && e.key === 'c') {
				dispatch({ type: ADD_EDITING_FIGURE_TO_COPY_BUFFER, payload: null });
			}
		};

		const ctrlVListener = (e: KeyboardEvent) => {
			if (e.ctrlKey && e.key === 'v') {
				dispatch({
					type: ADD_EDITING_FIGURE_FROM_COPY_BUFFER,
					payload: null,
				});
			}
		};

		const deleteListener = (e: KeyboardEvent) => {
			if (e.key === 'Delete') {
				dispatch({ type: DELETE_EDITING_FIGURE, payload: null });
			}
		};

		document.addEventListener('keydown', ctrlZListener);
		document.addEventListener('keydown', ctrlCListener);
		document.addEventListener('keydown', ctrlVListener);
		document.addEventListener('keydown', deleteListener);

		return () => {
			document.removeEventListener('keydown', ctrlZListener);
			document.removeEventListener('keydown', ctrlCListener);
			document.removeEventListener('keydown', ctrlVListener);
			document.removeEventListener('keydown', deleteListener);
		};
	}, []);

	const onClickSave = async () => {
		setIsSavingPlan(true);

		let plan: null | PlanData = null;

		if (updatePlan && planData) {
			plan = await updatePlan(
				{
					...planData,
					figures: state.createdFigures,
					title: state.planTitle,
				},
				planData.id
			);
		} else {
			plan = await planApi.savePlan({
				figures: state.createdFigures,
				title: state.planTitle,
			});
		}

		dispatch({ type: SAVE_PLAN, payload: null });
		setIsSavingPlan(false);

		if (plan) {
			history.push(AppRoutes.RouteToWatchPlan(plan.id));
		}
	};

	return (
		<>
			{isSavingPlan && <PreloaderOverlay />}
			<Box display="flex" justifyContent="space-between">
				<Box marginRight="10px">
					<WindowWrapper>
						<Box
							display="flex"
							justifyContent="space-between"
							alignItems="center"
						>
							<Box>
								<Button
									variant="contained"
									style={{ marginBottom: '10px', marginRight: '15px' }}
									onClick={() =>
										dispatch({ type: SWITCH_SHOWGRID, payload: null })
									}
								>
									{!state.showGrid ? 'Показать сетку' : 'Убрать сетку'}
								</Button>
								{state.stateStack.length > 0 && (
									<Button
										style={{ marginBottom: '10px' }}
										variant="contained"
										onClick={setPrevState}
									>
										Вернуть
									</Button>
								)}
							</Box>
							<Box>
								{state.editingFigure && (
									<TextField
										value={state.editingFigure?.title || ''}
										onChange={(changeEvent) =>
											dispatch({
												type: SET_FIGURE_TITLE,
												payload: changeEvent.target.value,
											})
										}
									/>
								)}
							</Box>
						</Box>

						<Plan
							onClickBgPlan={onClickBgPlan}
							resizePointsSize={RESIZE_PONTS_SIZE}
							editingFigure={state.editingFigure}
							showGrid={state.showGrid}
							onClickFigure={onClickFigure}
							createdFigures={state.createdFigures}
							editingBufferFigure={state.editingBufferFigure}
							itemRef={$plan}
							widthInPx={PlanConstants.widthInPx}
							heightInPx={PlanConstants.heightInPx}
						/>
						<Box display="flex" alignItems="center">
							<Button
								onClick={onClickSave}
								style={{ margin: '10px' }}
								variant="contained"
								color="secondary"
							>
								Сохранить
							</Button>
							<TextField
								value={state.planTitle}
								onChange={(changeEvent) =>
									dispatch({
										type: SET_PLAN_TITLE,
										payload: changeEvent.target.value,
									})
								}
							/>
						</Box>
					</WindowWrapper>
				</Box>
				<Box flex="1" minWidth={100}>
					<WindowWrapper>
						<Box
							height="100%"
							display="flex"
							flexDirection="column"
							justifyContent="space-between"
						>
							<Box display="flex" flexDirection="column">
								{figureTools.map((ft: FigureType, i) => (
									<FigureTool
										id={`figuretool_${i + 1}`}
										select={onSelectFigureTool}
										key={`${ft}_type`}
										figure={ft}
									/>
								))}
							</Box>
							{state.editingFigure && (
								<Button
									onKeyDown={onDeleteFigure}
									onClick={() => onDeleteFigure()}
									color="default"
									variant="contained"
								>
									Удалить
								</Button>
							)}
						</Box>
					</WindowWrapper>
				</Box>
			</Box>
		</>
	);
};
