import { PlanData, Position } from '@spectator/api-interfaces';
import { model, Schema } from 'mongoose';

export const PositionSchema = new Schema<Position>({
	x: { type: Number, required: true },
	y: { type: Number, required: true },
});

const schema = new Schema<PlanData>({
	title: { type: String, required: true },
	id: { type: String, required: true },
	figures: [
		new Schema({
			type: {
				type: Number,
				required: true,
			},
			begin: PositionSchema,
			end: PositionSchema,
			title: {
				type: String,
				required: true,
			},
			transform: {
				type: String,
				required: false,
			},
			rotate: {
				type: Number,
				required: false,
			},
			color: {
				type: String,
				required: false,
			},
			stroke: {
				type: String,
				required: false,
			},
			centerX: {
				type: Number,
				required: false,
			},
			strokeWidth: {
				type: Number,
				required: false,
			},
			id: {
				type: String,
				required: true,
			},
		}),
	],
});

export const PlanModel = model<PlanData>('Plan', schema);
