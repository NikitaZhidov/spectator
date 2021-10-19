import { User } from '@spectator/api-interfaces';
import { injectable } from 'inversify';
import { IUserRepository } from '../interfaces';
import { UserModel } from '../models';

@injectable()
class UserRepository implements IUserRepository {
	async FindByEmail(email: string): Promise<User> {
		const user = await UserModel.findOne({ email });
		return user;
	}

	async FindById(id: string): Promise<User> {
		const user = await UserModel.findById(id);
		return user;
	}

	async Create(email: string, password: string): Promise<User> {
		const user = new UserModel({
			email,
			password,
		});

		await user.save();

		return user;
	}

	async FindAll(): Promise<User[]> {
		const users = await UserModel.find();
		return users;
	}
}

export default UserRepository;
