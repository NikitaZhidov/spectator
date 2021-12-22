import { ApiResponse, User } from '@spectator/api-interfaces';
import { baseAxios } from './baseAxios';

export const accountApi = {
	async addAccount(newAccount: User): Promise<User> {
		try {
			const res = await baseAxios.post<ApiResponse<User>>('/auth/register', {
				newAccount,
			});

			return res.data.body;
		} catch (error) {
			throw new Error('Add new account post error');
		}
	},

	async getUsers(): Promise<User[]> {
		try {
			const res = await baseAxios.get<ApiResponse<User[]>>('/auth/user');

			return res.data.body;
		} catch (error) {
			throw new Error('Get users error');
		}
	},
};
