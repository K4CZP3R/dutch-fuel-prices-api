import { hashPassword } from "../helpers/password.helper";
import { IAuth } from "../models/auth.model";
import { AuthType } from "../models/enums/auth-type.enum";
import { IResult } from "../models/interfaces/result.interface";
import { IUser } from "../models/user.model";
import { BaseAuthService } from "./base-auth.service";

export class EmailAuthService extends BaseAuthService {
	constructor() {
		super();
	}

	async authenticate(data: {
		email: string;
		passwordEncoded: string;
	}): Promise<IResult<{ accessToken: string; refreshToken: string }>> {
		let auth = await this.AuthRepo.getAuthByMail(data.email);
		if (!auth) {
			throw new Error("Email/password combination is not valid!");
		}

		if (hashPassword(data.passwordEncoded) !== auth.uniqueData.emailPwHash) {
			throw new Error("Email/password combination is not valid!");
		}

		let user = await this.getUser({ id: auth.forUser });

		if (!user) {
			throw new Error("Something went wrong, try again later.");
		}

		let token = await this.createSession({ user: user });

		return {
			success: true,
			message: "Authorized!",
			data: { accessToken: token.accessToken, refreshToken: token.refreshToken },
		};
	}

	async register(data: { email: string; passwordEncoded: string; username: string }): Promise<IResult<string>> {
		// Check if email is already registered
		if (await this.AuthRepo.getAuthByMail(data.email)) {
			throw new Error("Email already used!");
		}
		// Hash password
		const passwordHashed = hashPassword(data.passwordEncoded);

		// Create user
		let newUser = await this.createUser({ name: data.username });

		// Create auth for new user
		let newAuth = await this.createEmailAuth({ user: newUser, email: data.email, passwordHashed: passwordHashed });

		return { success: true, message: "Registered!!", data: newAuth._id };
	}

	private async createEmailAuth(data: { user: IUser; email: string; passwordHashed: string }): Promise<IAuth> {
		let auth: IAuth = {
			forUser: data.user._id,
			authType: AuthType.EMAIL,
			uniqueData: {
				emailItself: data.email,
				emailPwHash: data.passwordHashed,
			},
		};

		return await this.AuthRepo.createAuth(auth);
	}
}
