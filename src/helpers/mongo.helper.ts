import { IDatabaseConfig } from "../models/interfaces/orm-database-config.interface";
import { v4 as uuid } from "uuid";
import { generateNumberBetween } from "./secure.helper";

export function configToMongoUrl(databaseConfig: IDatabaseConfig) {
	if (databaseConfig.username && databaseConfig.password) {
		return `mongodb://${databaseConfig.username}:${databaseConfig.password}@${databaseConfig.hostname}:${databaseConfig.port}/${databaseConfig.databaseName}`;
	} else {
		return `mongodb://${databaseConfig.hostname}:${databaseConfig.port}/${databaseConfig.databaseName}`;
	}
}

export const randomUuid = {
	type: String,
	default: () => {
		return uuid();
	},
};

export const randomPin = {
	type: String,
	default: () => {
		return generateNumberBetween(100000, 999999).toString();
	},
};
