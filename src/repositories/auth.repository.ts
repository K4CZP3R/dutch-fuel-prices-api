import { AuthModel, IAuth } from "../models/auth.model";
export class AuthRepository {
	constructor(private Model = AuthModel) {}

	async createAuth(data: IAuth): Promise<IAuth> {
		let doc = new this.Model(data);
		return (await doc.save()) as IAuth;
	}

	async getAuthByMail(email: string): Promise<IAuth | undefined> {
		let found = await this.Model.findOne({ "uniqueData.emailItself": email });

		if (!found) return undefined;

		return found as IAuth;
	}

	async getAuthById(id: string): Promise<IAuth | undefined> {
		return (await this.Model.findById(id)) as IAuth;
	}

	async updateAuth(auth: IAuth): Promise<IAuth> {
		await this.Model.findByIdAndUpdate(auth._id, auth);
		return this.getAuthById(auth._id);
	}
}
