import React, { useCallback, useRef } from 'react';
import { FigureInfo, FigureType } from '@spectator/api-interfaces';
import { useTheme } from '@material-ui/core';

const getHalfFigureSide = (
	value: string | number | undefined
): string | undefined => {
	if (!value) {
		return undefined;
	}

	const [number, unit] = value
		.toString()
		.split(/([0-9]+)/)
		.filter(Boolean);

	return (Number(number) / 2 || 0) + (unit || 'px');
};

const getEllipseX = (x1: number, x2: number): number => {
	return x1 + (x2 - x1) / 2;
};

const getEllipseY = (y1: number, y2: number) => {
	return y1 + (y2 - y1) / 2;
};

export interface FigureProps extends FigureInfo {
	onClick?: (figure: FigureInfo) => void;
	showBgSize?: boolean;
	bgBorderColor?: string;
	showResizePoints?: boolean;
	resizePointsSize?: number;
	showTitleOnHover?: boolean;
}

export const Figure: React.FC<FigureProps> = ({
	type,
	begin,
	end,
	rotate,
	transform,
	color,
	strokeWidth,
	onClick,
	showBgSize,
	stroke,
	bgBorderColor,
	id,
	showResizePoints,
	resizePointsSize,
	title,
}: FigureProps) => {
	const ellipse$: React.Ref<SVGEllipseElement> = useRef(null);
	const theme = useTheme();

	const onClickFigure = useCallback(() => {
		if (onClick) {
			onClick({
				type,
				begin,
				end,
				rotate,
				transform,
				color,
				strokeWidth,
				id,
				title,
			});
		}
	}, [
		begin,
		color,
		end,
		id,
		onClick,
		rotate,
		strokeWidth,
		transform,
		type,
		title,
	]);

	const getFigureByType = (figureType: FigureType) => {
		switch (figureType) {
			case FigureType.ellipse:
				return (
					<ellipse
						onClick={onClickFigure}
						ref={ellipse$}
						fill={color}
						style={{ transform }}
						cx={getEllipseX(begin.x, end.x)}
						cy={getEllipseY(begin.y, end.y)}
						rx={getHalfFigureSide(end.x - begin.x)}
						ry={getHalfFigureSide(end.y - begin.y)}
						rotate={rotate}
						stroke={stroke}
					/>
				);
			case FigureType.line:
				return (
					<line
						onClick={onClickFigure}
						x1={begin.x}
						y1={begin.y}
						x2={end.x}
						y2={end.y}
						strokeWidth={strokeWidth || 3}
						fill="white"
						stroke="black"
					/>
				);
			default:
			case FigureType.rectangle:
				return (
					<rect
						onClick={onClickFigure}
						stroke={!showBgSize ? stroke : ''}
						fill={color}
						style={{ transform }}
						x={begin.x}
						y={begin.y}
						width={end.x - begin.x}
						height={end.y - begin.y}
						rotate={rotate}
					/>
				);
		}
	};

	return (
		<>
			{showBgSize && type !== FigureType.line && (
				<rect
					onClick={onClickFigure}
					fill="none"
					stroke={bgBorderColor || 'white'}
					style={{ transform }}
					x={begin.x}
					y={begin.y}
					width={end.x - begin.x}
					height={end.y - begin.y}
					rotate={rotate}
				/>
			)}
			{getFigureByType(type)}
			{showResizePoints && (
				<>
					<ellipse
						cx={begin.x}
						cy={begin.y}
						rx={(resizePointsSize || 0) / 2}
						ry={(resizePointsSize || 0) / 2}
						fill={theme.palette.primary.dark}
					/>
					<ellipse
						cx={end.x}
						cy={end.y}
						rx={(resizePointsSize || 0) / 2}
						ry={(resizePointsSize || 0) / 2}
						fill={theme.palette.primary.dark}
					/>
					{type !== FigureType.line && (
						<>
							<ellipse
								cx={end.x}
								cy={begin.y}
								rx={(resizePointsSize || 0) / 2}
								ry={(resizePointsSize || 0) / 2}
								fill={theme.palette.primary.dark}
							/>
							<ellipse
								cx={begin.x}
								cy={end.y}
								rx={(resizePointsSize || 0) / 2}
								ry={(resizePointsSize || 0) / 2}
								fill={theme.palette.primary.dark}
							/>
						</>
					)}
				</>
			)}
		</>
	);
};
