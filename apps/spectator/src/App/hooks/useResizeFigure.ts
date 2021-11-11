import { FigureInfo, Position } from '@spectator/api-interfaces';
import { useCallback } from 'react';
import {
	BehaviorSubject,
	combineLatest,
	fromEvent,
	Observable,
	Subject,
} from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import {
	BorderPositions,
	getAttachedBorderPositionsToGrid,
	getCorrectBorderPositions,
	getPositionByMouseEvent,
	listenMouseDrawing,
} from '../utils';

export enum ResizingType {
	topLeft = 0,
	topRight = 1,
	bottomRight = 2,
	bottomLeft = 3,
	unknown = 4,
}

export const getNewFigurePositionsAfterResizing = (
	borderPositions: BorderPositions,
	figure: FigureInfo,
	resizingType: ResizingType
): FigureInfo => {
	let resizedFigure = { ...figure };
	switch (resizingType) {
		case ResizingType.topLeft:
			resizedFigure = {
				...figure,
				begin: { ...borderPositions.end },
			};
			break;
		case ResizingType.topRight:
			resizedFigure = {
				...figure,
				begin: {
					...figure.begin,
					y: borderPositions.end.y,
				},
				end: {
					...figure.end,
					x: borderPositions.end.x,
				},
			};
			break;
		case ResizingType.bottomRight:
			resizedFigure = {
				...figure,
				end: { ...borderPositions.end },
			};
			break;
		case ResizingType.bottomLeft:
			resizedFigure = {
				...figure,
				begin: {
					...figure.begin,
					x: borderPositions.end.x,
				},
				end: {
					...figure.end,
					y: borderPositions.end.y,
				},
			};
			break;
		default:
			return { ...figure };
	}

	const correctBorderPosition = getAttachedBorderPositionsToGrid(
		getCorrectBorderPositions(
			{
				begin: resizedFigure.begin,
				end: resizedFigure.end,
			},
			figure.type
		),
		20
	);

	return { ...resizedFigure, ...correctBorderPosition };
};

export const getResizingType = (
	beginMousePosition: Position,
	figure: FigureInfo,
	resizingPosintsSize: number
) => {
	const maxDelta = resizingPosintsSize / 2;

	const xForLeft = Math.abs(beginMousePosition.x - figure.begin.x) < maxDelta;
	const xForRight = Math.abs(beginMousePosition.x - figure.end.x) < maxDelta;
	const yForTop = Math.abs(beginMousePosition.y - figure.begin.y) < maxDelta;
	const yForBottom = Math.abs(beginMousePosition.y - figure.end.y) < maxDelta;

	switch (true) {
		case yForTop && xForLeft:
			return ResizingType.topLeft;
		case yForTop && xForRight:
			return ResizingType.topRight;
		case yForBottom && xForRight:
			return ResizingType.bottomRight;
		case yForBottom && xForLeft:
			return ResizingType.bottomLeft;
		default:
			return ResizingType.unknown;
	}
};

export const useResizeFigue = (): ((
	$area: HTMLDivElement | null,
	figure: FigureInfo,
	resizing$: Subject<FigureInfo>,
	resize$: Subject<FigureInfo>,
	resizingPosintsSize: number
) => Observable<void>) => {
	return useCallback(
		(
			$area: HTMLDivElement | null,
			figure: FigureInfo,
			resizing$: Subject<FigureInfo>,
			resize$: Subject<FigureInfo>,
			resizingPosintsSize: number
		) => {
			if ($area === null) {
				throw new Error('$area is null in useResizeFigure hook');
			}

			const resizingType$ = new BehaviorSubject<ResizingType>(
				ResizingType.unknown
			);

			const resizingHandler$ = new Subject<BorderPositions>();
			const resizeHandler$ = new Subject<BorderPositions>();

			combineLatest([resizingHandler$, resizingType$])
				.pipe(
					map(([borderPositions, resizingType]) =>
						getNewFigurePositionsAfterResizing(
							borderPositions,
							figure,
							resizingType
						)
					),
					tap((newFigurePositions) => resizing$.next(newFigurePositions))
				)
				.subscribe();

			combineLatest([resizeHandler$, resizingType$])
				.pipe(
					map(([borderPositions, resizingType]) =>
						getNewFigurePositionsAfterResizing(
							borderPositions,
							figure,
							resizingType
						)
					),
					tap((newFigurePositions) => resize$.next(newFigurePositions))
				)
				.subscribe();

			const mousedown$ = fromEvent<MouseEvent>($area, 'mousedown').pipe(
				filter((e) => {
					const resizingType = getResizingType(
						getPositionByMouseEvent(e, $area),
						figure,
						resizingPosintsSize
					);
					resizingType$.next(resizingType);
					return resizingType !== ResizingType.unknown;
				})
			);

			return listenMouseDrawing(
				$area,
				resizingHandler$,
				resizeHandler$,
				mousedown$
			);
		},
		[]
	);
};
