import { FigureInfo } from '@spectator/api-interfaces';

export const DELETE_FIGURE = 'DELETE_FIGURE';
export const ADD_FIGURE = 'ADD_FIGURE';
export const SET_PREV_STATE = 'SET_PREV_STATE';
export const SWITCH_SHOWGRID = 'SWITCH_SHOWGRID';
export const EDIT_FIGURE = 'EDIT_FIGURE';
export const SET_EDITING_FIGURE = 'SET_EDITING_FIGURE';
export const SET_EDITING_BUFFER_FIGURE = 'SET_EDITING_BUFFER_FIGURE';
export const DELETE_EDITING_FIGURE = 'DELETE_EDITING_FIGURE';
export const ADD_EDITING_FIGURE_TO_COPY_BUFFER =
	'ADD_EDITING_FIGURE_TO_COPY_BUFFER';
export const ADD_EDITING_FIGURE_FROM_COPY_BUFFER =
	'ADD_EDITING_FIGURE_FROM_COPY_BUFFER';
export const SET_FIGURE_TITLE = 'SET_FIGURE_TITLE';
export const SET_PLAN_TITLE = 'SET_PLAN_TITLE';
export const SAVE_PLAN = 'SAVE_PLAN';
export const SET_CREATED_FIGURES = 'SET_CREATED_FIGURES';

export interface CreatePlanPageState {
	editingBufferFigure: FigureInfo | null;
	copyFigureBuffer: FigureInfo | undefined;
	createdFigures: FigureInfo[];
	stateStack: FigureInfo[][];
	editingFigure: FigureInfo | undefined;
	showGrid: boolean;
	isEditTitle: boolean;
	planTitle: string;
}

export interface Action {
	type: string;
	payload: any;
}

export const planReducer = (
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
		case DELETE_FIGURE:
			return {
				...state,
				stateStack: getChangedStack(),
				editingFigure: undefined,
				createdFigures: state.createdFigures.filter(
					(cf) => cf.id !== action.payload.id
				),
			};
		case ADD_FIGURE:
			return {
				...state,
				stateStack: getChangedStack(),
				createdFigures: [...state.createdFigures, action.payload],
			};
		case SET_PREV_STATE: {
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
		case SWITCH_SHOWGRID:
			return { ...state, showGrid: !state.showGrid };
		case EDIT_FIGURE:
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
		case SET_EDITING_FIGURE:
			return { ...state, editingFigure: action.payload };
		case SET_EDITING_BUFFER_FIGURE:
			return { ...state, editingBufferFigure: action.payload };
		case DELETE_EDITING_FIGURE:
			return {
				...state,
				stateStack: getChangedStack(),
				createdFigures: state.createdFigures.filter((cf) => {
					return cf.id !== state?.editingFigure?.id;
				}),
				editingFigure: undefined,
			};
		case ADD_EDITING_FIGURE_TO_COPY_BUFFER:
			return {
				...state,
				copyFigureBuffer: state.editingFigure,
			};
		case ADD_EDITING_FIGURE_FROM_COPY_BUFFER: {
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
				stateStack: state.copyFigureBuffer
					? getChangedStack()
					: state.stateStack,
				createdFigures: newCreatedFigures,
				editingFigure: undefined,
			};
		}
		case SET_FIGURE_TITLE: {
			const newEditingFigure = state.editingFigure
				? { ...state.editingFigure, title: action.payload }
				: state.editingFigure;
			return {
				...state,
				editingFigure: newEditingFigure,
				createdFigures: state.createdFigures.map((f) => {
					if (f.id === state.editingFigure?.id) {
						return { ...f, title: action.payload };
					}
					return f;
				}),
			};
		}
		case SET_PLAN_TITLE: {
			return {
				...state,
				planTitle: action.payload,
			};
		}
		case SAVE_PLAN: {
			return {
				editingBufferFigure: null,
				createdFigures: [],
				stateStack: [],
				editingFigure: undefined,
				showGrid: false,
				copyFigureBuffer: undefined,
				isEditTitle: true,
				planTitle: `Plan${Date.now().toString()}`,
			};
		}
		case SET_CREATED_FIGURES: {
			return {
				...state,
				createdFigures: action.payload,
			};
		}
		default:
			throw new Error('Invalid action type');
	}
};
