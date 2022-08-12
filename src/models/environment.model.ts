import { IEnvironment } from "./interfaces/environment.interface";
import { IDatabaseConfig } from "./interfaces/orm-database-config.interface";
import { read, readFileSync } from "fs";

export class Environment {
	constructor(public env: IEnvironment) {}

	getDatabase(): IDatabaseConfig {
		return {
			username: this.env.DB_USER,
			hostname: this.env.DB_HOST,
			databaseName: this.env.DB_NAME,
			password: this.env.DB_PASS,
			port: this.env.DB_PORT,
		};
	}

	isDev(): boolean {
		return this.env.ENVIRONMENT === "dev";
	}

	getJwkKeyPair(): { private: any; public: any } {
		return {
			private: JSON.parse(readFileSync(this.env.JWT_KEY_PRIVATE).toString()),
			public: JSON.parse(readFileSync(this.env.JWT_KEY_PUBLIC).toString()),
		};
	}
}
