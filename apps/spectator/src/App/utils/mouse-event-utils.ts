import { Position } from '@spectator/api-interfaces';
import { fromEvent, Observable, Subject } from 'rxjs';
import {
	map,
	mergeMap,
	startWith,
	switchMap,
	takeUntil,
	tap,
	throttleTime,
} from 'rxjs/operators';
import { BorderPositions } from './position-utils';

export function getPositionByMouseEvent(
	e: MouseEvent,
	$area: HTMLDivElement
): Position {
	const rect = $area.getBoundingClientRect();

	const x = e.clientX - (rect?.left || 0);
	const y = e.clientY - (rect?.top || 0);

	return { x, y };
}

export const listenMouseDrawing = (
	$area: HTMLDivElement | null,
	onChangePosition$: Subject<BorderPositions>,
	onMouseUp$: Subject<BorderPositions>,
	startDrawingEvent$: Observable<MouseEvent>
): Observable<void> => {
	if ($area == null) {
		throw new Error('$area is null');
	}

	let begin: Position = { x: 0, y: 0 };

	const mouseup$ = fromEvent<MouseEvent>($area, 'mouseup');
	const mousemove$ = fromEvent<MouseEvent>($area, 'mousemove');

	const mousemoveWhenMousedown$ = startDrawingEvent$.pipe(
		tap((e) => {
			begin = getPositionByMouseEvent(e, $area);
		}),
		mergeMap((e) => mousemove$.pipe(startWith(e), takeUntil(mouseup$))),
		throttleTime(17),
		tap((e) =>
			onChangePosition$.next({ begin, end: getPositionByMouseEvent(e, $area) })
		)
	);

	return mousemoveWhenMousedown$.pipe(
		switchMap(() =>
			mouseup$.pipe(
				tap((e) => {
					onMouseUp$.next({ begin, end: getPositionByMouseEvent(e, $area) });
				}),
				map(() => {})
			)
		)
	);
};
