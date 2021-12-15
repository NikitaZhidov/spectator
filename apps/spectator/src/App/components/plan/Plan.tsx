import { useTheme, Box } from '@material-ui/core';
import { FigureInfo } from '@spectator/api-interfaces';
import React from 'react';
import { GRID_SIZE } from '../../utils';
import { Figure } from '../figure';
import { PlanGrid } from './PlanGrid';

export interface PlanProps {
	widthInPx: number;
	heightInPx: number;
	editingBufferFigure?: FigureInfo | null;
	createdFigures: FigureInfo[];
	itemRef?: React.RefObject<HTMLDivElement>;
	showGrid?: boolean;
	editingFigure?: FigureInfo;
	resizePointsSize?: number;
	onClickBgPlan?: () => void;
	onClickFigure?: (figure: FigureInfo) => void;
}

export const Plan: React.FC<PlanProps> = ({
	widthInPx,
	heightInPx,
	createdFigures,
	editingBufferFigure,
	itemRef,
	onClickFigure,
	showGrid,
	editingFigure,
	resizePointsSize,
	onClickBgPlan,
}: PlanProps) => {
	const theme = useTheme();

	const onClickPlan = (e: any) => {
		if (e.target.tagName === 'svg' && onClickBgPlan) {
			onClickBgPlan();
		}
	};

	return (
		<div ref={itemRef}>
			<Box
				onClick={onClickPlan}
				width={`${widthInPx}px`}
				height={`${heightInPx}px`}
				borderRadius="10px"
				bgcolor={`${theme.palette.background.default}`}
				border={`1px solid ${theme.palette.secondary.dark}`}
				overflow="hidden"
			>
				<svg width="100%" height="100%">
					<PlanGrid
						widthInPx={widthInPx}
						heightInPx={heightInPx}
						showGrid={showGrid}
						gridSize={GRID_SIZE}
					/>
					{createdFigures.map((cf) => {
						return (
							<Figure
								title={cf.title}
								showResizePoints={editingFigure?.id === cf.id}
								resizePointsSize={resizePointsSize}
								stroke={theme.palette.secondary.light}
								id={cf.id}
								showBgSize={
									editingFigure?.id ? cf.id === editingFigure?.id : false
								}
								bgBorderColor={theme.palette.secondary.dark}
								onClick={onClickFigure}
								key={`${cf.begin.x}_${cf.end.x}_${cf.type}_${cf.id}`}
								begin={cf.begin}
								end={cf.end}
								type={cf.type}
							/>
						);
					})}
					{editingBufferFigure && (
						<Figure
							title=""
							id={editingBufferFigure.id}
							color="rgb(90%, 16%, 35%, .2)"
							onClick={onClickFigure}
							begin={editingBufferFigure.begin}
							end={editingBufferFigure.end}
							type={editingBufferFigure.type}
						/>
					)}
				</svg>
			</Box>
		</div>
	);
};
