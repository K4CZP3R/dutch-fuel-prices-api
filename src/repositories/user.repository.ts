import { UserModel, IUser } from "../models/user.model";

export class UserRepository {
	constructor(private Model = UserModel) {}

	async createUser(data: IUser): Promise<IUser> {
		let doc = new this.Model(data);
		return (await doc.save()) as IUser;
	}

	async getUserById(id: string): Promise<IUser> {
		return (await this.Model.findById(id)) as IUser;
	}

	async updateUser(data: IUser): Promise<IUser> {
		await this.Model.findByIdAndUpdate(data._id, data);
		return this.getUserById(data._id);
	}
}
