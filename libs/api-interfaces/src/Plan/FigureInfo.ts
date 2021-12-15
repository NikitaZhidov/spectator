import { Position } from '../shared';
import { FigureType } from './FigureType';

export interface FigureInfo {
	type: FigureType;
	begin: Position;
	end: Position;
	title: string;
	transform?: string;
	rotate?: number;
	color?: string;
	stroke?: string;
	centerX?: number;
	strokeWidth?: number;
	id: number | string;
}
