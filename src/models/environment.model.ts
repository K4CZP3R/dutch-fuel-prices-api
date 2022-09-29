import { IEnvironment } from "./interfaces/environment.interface";
import { IDatabaseConfig } from "./interfaces/orm-database-config.interface";
import { existsSync, read, readFileSync } from "fs";
import { generateKeys } from "../scripts/generate-keys.script";

export class Environment {
	constructor(public env: IEnvironment) {}

	async initialize(): Promise<void> {
		await this.generateKeyPairIfNeeded();
	}

	getDatabase(): IDatabaseConfig {
		return {
			username: this.env.DB_USER,
			hostname: this.env.DB_HOST,
			databaseName: this.env.DB_NAME,
			password: this.env.DB_PASS,
			port: this.env.DB_PORT,
			url: this.env.DB_URL,
		};
	}

	isDev(): boolean {
		return this.env.ENVIRONMENT === "dev";
	}

	refreshPricesEveryMs(): number {
		return parseInt(this.env.PRICES_REFRESH_EVERY_MS);
	}
}
