import { JWT_SERVICE } from "../helpers/di-names.helper";
import { ISession } from "../models/interfaces/session.interface";
import { IUser } from "../models/user.model";
import { AuthRepository } from "../repositories/auth.repository";
import { Inject } from "./dependency-provider.service";
import { JwtSessionService } from "./jwt-session.service";
import { UserRepository } from "../repositories/user.repository";

export class BaseAuthService {
	@Inject<JwtSessionService>(JWT_SERVICE)
	jwtSessionService!: JwtSessionService;

	constructor(public AuthRepo: AuthRepository = new AuthRepository(), public userRepository = new UserRepository()) {}

	async createUser(data: { name: string }): Promise<IUser> {
		return await this.userRepository.createUser({
			name: data.name,
		});
	}

	async updateUser(data: { user: IUser }): Promise<IUser> {
		return await this.userRepository.updateUser(data.user);
	}

	async getUser(data: { id: string }): Promise<IUser> {
		return await this.userRepository.getUserById(data.id);
	}

	async createSession(data: { user: IUser }): Promise<{ accessToken: string; refreshToken: string }> {
		return {
			accessToken: await this.jwtSessionService.signSession({ id: data.user._id, type: "user", user: data.user }),
			refreshToken: await this.jwtSessionService.signRefresh({ id: data.user._id, type: "refresh", user: data.user }),
		};
	}

	async getPublicJwtInfo(): Promise<{ keys: any[] }> {
		return {
			keys: [await this.jwtSessionService.getPublicJwk()],
		};
	}
}
