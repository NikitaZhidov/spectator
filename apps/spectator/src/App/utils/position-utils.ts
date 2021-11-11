import { FigureType, Position } from '@spectator/api-interfaces';

export interface BorderPositions {
	begin: Position;
	end: Position;
}

export const getCorrectBorderPositions = (
	borderPositions: BorderPositions,
	figureType: FigureType
): BorderPositions => {
	if (figureType === FigureType.line) {
		return {
			...borderPositions,
		};
	}

	const topLeft: Position = {
		x: Math.min(borderPositions.begin.x, borderPositions.end.x),
		y: Math.min(borderPositions.begin.y, borderPositions.end.y),
	};

	const bottomRight: Position = {
		x: Math.max(borderPositions.begin.x, borderPositions.end.x),
		y: Math.max(borderPositions.begin.y, borderPositions.end.y),
	};

	return {
		begin: topLeft,
		end: bottomRight,
	};
};

export const GRID_SIZE = 20;

export const getAttachedBorderPositionsToGrid = (
	borderPositions: BorderPositions,
	gridSize: number
) => {
	const newBorderPosition = { ...borderPositions };

	newBorderPosition.begin = {
		x: newBorderPosition.begin.x - (newBorderPosition.begin.x % gridSize),
		y: newBorderPosition.begin.y - (newBorderPosition.begin.y % gridSize),
	};

	newBorderPosition.end = {
		x: newBorderPosition.end.x - (newBorderPosition.end.x % gridSize),
		y: newBorderPosition.end.y - (newBorderPosition.end.y % gridSize),
	};

	return newBorderPosition;
};
