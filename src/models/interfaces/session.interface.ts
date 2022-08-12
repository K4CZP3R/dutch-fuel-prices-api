import { IUser } from "../user.model";

export interface ISession {
	id: string;
	type: string;
	user: IUser;
}
