import { User } from '@spectator/api-interfaces';

export interface IUserRepository {
	FindByEmail(email: string): Promise<User>;
	FindById(id: string): Promise<User>;
	FindAll(): Promise<User[]>;
	Create(email: string, password: string): Promise<User>;
}
