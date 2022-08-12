// import * as jwt from "jsonwebtoken";
import * as jose from "jose";
import { ISession } from "../models/interfaces/session.interface";

export class JwtSessionService {
	private JWKS;
	constructor(
		private config: {
			privateJwk: any;
			publicJwk: any;
			expiresIn: number;
			refreshExpiresIn: number;
			issuer: string;
		}
	) {
		this.JWKS = jose.createLocalJWKSet({ keys: [config.publicJwk] });
		jose.importJWK(this.config.privateJwk, "RS512").then(key => (this.config.privateJwk = key));
		jose.importJWK(this.config.publicJwk, "RS512").then(key => (this.config.publicJwk = key));
	}

	async signSession(session: ISession): Promise<string> {
		return await new jose.SignJWT({ session: session })
			.setProtectedHeader({ alg: "RS512" })
			.setIssuedAt()
			.setIssuer(this.config.issuer)
			.setExpirationTime(`${this.config.expiresIn}s`)
			.sign(this.config.privateJwk);
	}
	async signRefresh(session: ISession): Promise<string> {
		return await new jose.SignJWT({ session: session })
			.setProtectedHeader({ alg: "RS512" })
			.setIssuedAt()
			.setIssuer(this.config.issuer)
			.setExpirationTime(`${this.config.refreshExpiresIn}s`)
			.sign(this.config.privateJwk);
	}

	async getPublicJwk(): Promise<any> {
		return await jose.exportJWK(this.config.publicJwk);
	}
	getIssuer(): string {
		return this.config.issuer;
	}

	async verifySession(key: string): Promise<ISession> {
		const { payload } = await jose.jwtVerify(key, this.JWKS, {
			issuer: this.config.issuer,
		});

		return payload.session as ISession;
	}
}
