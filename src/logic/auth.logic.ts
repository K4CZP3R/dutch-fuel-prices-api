import { checkValues } from "../helpers/type-checker.helper";
import { IResult } from "../models/interfaces/result.interface";
import { EmailAuthService } from "../services/email-auth.service";
import { BaseAuthService } from "../services/base-auth.service";
import { IUser } from "../models/user.model";

export class AuthLogic {
	constructor(private emailAuth = new EmailAuthService(), private baseAuth = new BaseAuthService()) {}
	async getJwks(): Promise<{ keys: any[] }> {
		return await this.baseAuth.getPublicJwtInfo();
	}
	async authenticateUsingEmail(data: {
		email: string;
		passwordEncoded: string;
	}): Promise<IResult<{ accessToken: string; refreshToken: string }>> {
		checkValues(data, { shouldContainKeys: ["email", "passwordEncoded"] });

		return await this.emailAuth.authenticate(data);
	}

	async meData(data: { user: IUser }): Promise<IResult<{ user: IUser }>> {
		return { success: true, data: { user: data.user } };
	}

	async refreshToken(data: { user: IUser }): Promise<IResult<{ accessToken: string; refreshToken: string }>> {
		let newSession = await this.baseAuth.createSession({ user: data.user });

		return { success: true, data: { accessToken: newSession.accessToken, refreshToken: newSession.refreshToken } };
	}

	async registerUsingEmail(data: {
		email: string;
		passwordEncoded: string;
		username: string;
	}): Promise<IResult<string>> {
		checkValues(data, { shouldContainKeys: ["email", "passwordEncoded", "username"], checkRuleChangeableValues: true });
		return await this.emailAuth.register(data);
	}
}
