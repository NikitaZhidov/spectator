/* eslint-disable react-hooks/exhaustive-deps */
import React, { memo } from 'react';

export interface PlanGridProps {
	showGrid?: boolean;
	gridSize: number;
	widthInPx: number;
	heightInPx: number;
}

export const PlanGrid: React.FC<PlanGridProps> = memo(
	({ showGrid, gridSize, widthInPx, heightInPx }: PlanGridProps) => {
		return (
			<>
				{showGrid &&
					new Array(Math.ceil(widthInPx / gridSize)).fill(0).map((elem, i) => {
						return (
							<line
								key={`${elem}_{${gridSize * i}}`}
								x1={i * gridSize}
								y1={0}
								x2={i * gridSize}
								y2={heightInPx}
								stroke="gray"
								strokeWidth={1}
							/>
						);
					})}
				{showGrid &&
					new Array(Math.ceil(widthInPx / gridSize)).fill(0).map((elem, i) => {
						return (
							<line
								key={`${elem}_{${20 * i}}`}
								x1={0}
								y1={i * gridSize}
								x2={widthInPx}
								y2={i * gridSize}
								stroke="gray"
								strokeWidth={1}
							/>
						);
					})}
			</>
		);
	}
);
