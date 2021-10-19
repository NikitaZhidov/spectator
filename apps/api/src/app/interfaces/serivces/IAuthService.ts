import { User } from '@spectator/api-interfaces';

export interface IAuthService {
	TestGetUsersMethod(): Promise<User[]>;
	TestCreateUserMethod(email: string, password: string): Promise<User>;
}
