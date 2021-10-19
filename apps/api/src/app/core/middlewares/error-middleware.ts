import {
	ApiResponse,
	IApiResponse,
	ResponseStatus,
} from '@spectator/api-interfaces';
import { NextFunction, Request, Response } from 'express';

export function errorMiddleware(
	error: IApiResponse<any>,
	req: Request,
	res: Response,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	_: NextFunction
) {
	const status = error?.status || ResponseStatus.InternalServerError;
	const errors = error?.errors || ['Что-то пошло не так!'];

	return res.status(status).send(new ApiResponse(status, error?.body, errors));
}
