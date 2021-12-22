import { ApiResponse, User } from '@spectator/api-interfaces';
import { baseAxios } from './baseAxios';

export const accountApi = {
	async addAccount(newAccount: User): Promise<User> {
		try {
			const res = await baseAxios.post<ApiResponse<User>>('/user', {
				newAccount,
			});
			return res.data.body;
		} catch (error) {
			throw new Error('Add new account post error');
		}
	},

	async authUser(currentAccount: User): Promise<User> {
		try {
			const res = await baseAxios.post<ApiResponse<User>>('/user/auth', {
				currentAccount,
			});
			return res.data.body;
		} catch (error) {
			throw new Error('Auth post error');
		}
	},
};
