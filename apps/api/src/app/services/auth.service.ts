import { User } from '@spectator/api-interfaces';
import { inject, injectable } from 'inversify';
import { IAuthService, IUserRepository } from '../interfaces';
import { TYPES } from '../ioc/types';

@injectable()
class AuthService implements IAuthService {
	constructor(
		@inject(TYPES.IUserRepository)
		private readonly _userRepository: IUserRepository
	) {}

	async TestGetUsersMethod(): Promise<User[]> {
		const users: User[] = await this._userRepository.FindAll();

		return users;
	}

	async TestCreateUserMethod(email: string, password: string): Promise<User> {
		const user = await this._userRepository.Create(email, password);

		return user;
	}
}

export default AuthService;
