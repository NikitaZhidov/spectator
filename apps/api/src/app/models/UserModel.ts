import { model, Schema } from 'mongoose';
import { User } from '@spectator/api-interfaces';

const schema = new Schema<User>({
	email: { type: String, required: true },
	password: { type: String, required: true },
});

export const UserModel = model<User>('User', schema);
