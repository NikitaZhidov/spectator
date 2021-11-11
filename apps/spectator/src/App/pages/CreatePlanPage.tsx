import { Box, Button } from '@material-ui/core';
import { FigureInfo, FigureType } from '@spectator/api-interfaces';
import React, { useEffect, useReducer, useRef } from 'react';
import { Subject } from 'rxjs';
import { Plan, WindowWrapper } from '../components';
import { FigureTool } from '../components/plan/FigureTool';
import { useMoveFigue, useResizeFigue } from '../hooks';

const figureTools: FigureType[] = [
	FigureType.rectangle,
	FigureType.ellipse,
	FigureType.line,
];

interface CreatePlanPageState {
	editingBufferFigure: FigureInfo | null;
	copyFigureBuffer: FigureInfo | undefined;
	createdFigures: FigureInfo[];
	stateStack: FigureInfo[][];
	editingFigure: FigureInfo | undefined;
	showGrid: boolean;
}

interface Action {
	type: string;
	payload: any;
}

// ! ADD MAX STACK SIZE!

const reducer = (
	state: CreatePlanPageState,
	action: Action
): CreatePlanPageState => {
	const MAX_STACK_SIZE = 32;

	const getChangedStack = () => {
		const newStack = [...state.stateStack];
		if (state.stateStack.length >= MAX_STACK_SIZE) {
			newStack.shift();
		}
		return [...newStack, state.createdFigures];
	};

	switch (action.type) {
		case 'delete-figure':
			return {
				...state,
				stateStack: getChangedStack(),
				editingFigure: undefined,
				createdFigures: state.createdFigures.filter(
					(cf) => cf.id !== action.payload.id
				),
			};
		case 'add-figure':
			return {
				...state,
				stateStack: getChangedStack(),
				createdFigures: [...state.createdFigures, action.payload],
			};
		case 'set-prev-state': {
			const stateStack = [...state.stateStack];
			const prevState = stateStack.pop();
			return {
				...state,
				editingFigure: undefined,
				editingBufferFigure: null,
				createdFigures: prevState || [],
				stateStack,
			};
		}
		case 'switch-showgrid':
			return { ...state, showGrid: !state.showGrid };
		case 'edit-figure':
			return {
				...state,
				stateStack: getChangedStack(),
				createdFigures: [
					...state.createdFigures.map((cf) => {
						return cf.id === action.payload.id ? action.payload : cf;
					}),
				],
				editingFigure: action.payload,
				editingBufferFigure: null,
			};
		case 'set-editing-figure':
			return { ...state, editingFigure: action.payload };
		case 'set-editing-buffer-figure':
			return { ...state, editingBufferFigure: action.payload };
		case 'delete-editing-figure':
			return {
				...state,
				stateStack: getChangedStack(),
				createdFigures: state.createdFigures.filter((cf) => {
					return cf.id !== state?.editingFigure?.id;
				}),
				editingFigure: undefined,
			};
		case 'add-editing-figure-to-copy-buffer':
			return {
				...state,
				copyFigureBuffer: state.editingFigure,
			};
		case 'add-figure-from-copy-buffer': {
			const newCreatedFigures = [...state.createdFigures];
			if (state.copyFigureBuffer)
				newCreatedFigures.push({
					...state.copyFigureBuffer,
					begin: {
						x: state.copyFigureBuffer.begin.x + 10,
						y: state.copyFigureBuffer.begin.y + 10,
					},
					end: {
						x: state.copyFigureBuffer.end.x + 10,
						y: state.copyFigureBuffer.end.y + 10,
					},
					id: Date.now().toString(),
				});
			return {
				...state,
				stateStack: getChangedStack(),
				createdFigures: newCreatedFigures,
				// temp
				editingFigure: undefined,
			};
		}
		default:
			throw new Error('Invalid action type');
	}
};

const RESIZE_PONTS_SIZE = 10;

export const CreatePlanPage: React.FC = () => {
	const $plan = useRef(null);

	const [state, dispatch] = useReducer(reducer, {
		editingBufferFigure: null,
		createdFigures: [],
		stateStack: [],
		editingFigure: undefined,
		showGrid: false,
		copyFigureBuffer: undefined,
	} as CreatePlanPageState);

	const onClickFigure = (figure: FigureInfo) => {
		dispatch({ type: 'set-editing-figure', payload: figure });
	};

	const onClickBgPlan = () => {
		dispatch({ type: 'set-editing-figure', payload: undefined });
	};

	const onDeleteFigure = () => {
		if (state.editingFigure) {
			dispatch({ type: 'delete-figure', payload: state.editingFigure });
		}
	};

	const onSelectFigureTool = (type: FigureType) => {
		const figure: FigureInfo = {
			type,
			begin: { x: 80, y: 80 },
			end: { x: 140, y: 140 },
			id: Date.now().toString(),
		};

		dispatch({
			type: 'add-figure',
			payload: figure,
		});
	};

	const setPrevState = () => {
		dispatch({ type: 'set-prev-state', payload: null });
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
				dispatch({ type: 'set-editing-buffer-figure', payload: figureInfo });
			});

			move$.subscribe((figureInfo) => {
				dispatch({ type: 'edit-figure', payload: figureInfo });
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
				dispatch({ type: 'set-editing-buffer-figure', payload: figureInfo });
			});
			resize$.subscribe((figureInfo) => {
				dispatch({ type: 'edit-figure', payload: figureInfo });
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
				dispatch({ type: 'add-editing-figure-to-copy-buffer', payload: null });
			}
		};

		const ctrlVListener = (e: KeyboardEvent) => {
			if (e.ctrlKey && e.key === 'v') {
				dispatch({
					type: 'add-figure-from-copy-buffer',
					payload: null,
				});
			}
		};

		const deleteListener = (e: KeyboardEvent) => {
			if (e.key === 'Delete') {
				dispatch({ type: 'delete-editing-figure', payload: null });
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

	return (
		<Box display="flex" justifyContent="space-between">
			<Box marginRight="10px">
				<WindowWrapper>
					<Button
						variant="contained"
						style={{ marginBottom: '10px', marginRight: '15px' }}
						onClick={() => dispatch({ type: 'switch-showgrid', payload: null })}
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
					<Plan
						onClickBgPlan={onClickBgPlan}
						resizePointsSize={RESIZE_PONTS_SIZE}
						editingFigure={state.editingFigure}
						showGrid={state.showGrid}
						onClickFigure={onClickFigure}
						createdFigures={state.createdFigures}
						editingBufferFigure={state.editingBufferFigure}
						itemRef={$plan}
						widthInPx={1060}
						heightInPx={600}
					/>
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
								Delete
							</Button>
						)}
					</Box>
				</WindowWrapper>
			</Box>
		</Box>
	);
};
