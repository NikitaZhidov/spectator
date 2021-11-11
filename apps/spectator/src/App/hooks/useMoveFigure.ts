import { FigureInfo, Position } from '@spectator/api-interfaces';
import { useCallback } from 'react';
import { fromEvent, Observable, Subject } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import {
	BorderPositions,
	getAttachedBorderPositionsToGrid,
	getPositionByMouseEvent,
	listenMouseDrawing,
} from '../utils';
import { getResizingType, ResizingType } from './useResizeFigure';

export const getNewFigureWithNewPosition = (
	figure: FigureInfo,
	borderPositions: BorderPositions
): FigureInfo => {
	const delta: Position = {
		x: borderPositions.end.x - borderPositions.begin.x,
		y: borderPositions.end.y - borderPositions.begin.y,
	};

	const newFigureBorderPositions: BorderPositions =
		getAttachedBorderPositionsToGrid(
			{
				begin: { x: figure.begin.x + delta.x, y: figure.begin.y + delta.y },
				end: { x: figure.end.x + delta.x, y: figure.end.y + delta.y },
			},
			20
		);

	return {
		...figure,
		...newFigureBorderPositions,
	};
};

export const useMoveFigue = (): ((
	$area: HTMLDivElement | null,
	figure: FigureInfo,
	moving$: Subject<FigureInfo>,
	move$: Subject<FigureInfo>,
	resizingPosintsSize: number
) => Observable<void>) => {
	return useCallback(
		(
			$area: HTMLDivElement | null,
			figure: FigureInfo,
			moving$: Subject<FigureInfo>,
			move$: Subject<FigureInfo>,
			resizingPosintsSize: number
		) => {
			if ($area === null) {
				throw new Error('$area is null in useMoveFigure hook');
			}

			const movingHandler$ = new Subject<BorderPositions>();
			const moveHandler$ = new Subject<BorderPositions>();

			movingHandler$
				.pipe(
					map((borderPositions) =>
						getNewFigureWithNewPosition(figure, borderPositions)
					),
					tap((newFigure) => moving$.next(newFigure))
				)
				.subscribe();

			moveHandler$
				.pipe(
					map((borderPositions) =>
						getNewFigureWithNewPosition(figure, borderPositions)
					),
					tap((newFigure) => move$.next(newFigure))
				)
				.subscribe();

			const mousedown$ = fromEvent<MouseEvent>($area, 'mousedown').pipe(
				filter((e) => {
					const resizingType = getResizingType(
						getPositionByMouseEvent(e, $area),
						figure,
						resizingPosintsSize
					);

					return resizingType === ResizingType.unknown;
				})
			);

			return listenMouseDrawing(
				$area,
				movingHandler$,
				moveHandler$,
				mousedown$
			);
		},
		[]
	);
};
