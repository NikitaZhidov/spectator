import { ResponseStatus } from './ResponseStatus';
import { IApiResponse } from './IApiResponse';

class ApiResponse<T> implements IApiResponse<T> {
	status: ResponseStatus;
	errors: string[];
	body: T;

	constructor(status: ResponseStatus, body: T, errors?: string[]) {
		this.status = status;
		this.body = body;
		this.errors = errors;
	}

	public static Ok<T>(body: T) {
		return new ApiResponse<T>(ResponseStatus.Ok, body);
	}

	public static BadReqest<T>(body: T, errors: string[]) {
		return new ApiResponse<T>(ResponseStatus.BadRequest, body, errors);
	}

	public static Unauthorized(errors: string[]) {
		return new ApiResponse(ResponseStatus.Unauthorized, null, errors);
	}

	public static Forbidden(errors: string[]) {
		return new ApiResponse(ResponseStatus.Forbidden, null, errors);
	}

	public static NotFound(errors: string[]) {
		return new ApiResponse(ResponseStatus.NotFound, null, errors);
	}

	public static InternalServerError(errors: string[]) {
		return new ApiResponse(ResponseStatus.InternalServerError, null, errors);
	}
}

export default ApiResponse;
