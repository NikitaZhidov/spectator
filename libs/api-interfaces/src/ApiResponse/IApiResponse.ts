import { ResponseStatus } from './ResponseStatus';

export interface IApiResponse<T> {
	status: ResponseStatus;
	errors: string[];
	body: T;
}
