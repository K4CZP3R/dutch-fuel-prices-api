import { IDatabaseConfig } from "../models/interfaces/orm-database-config.interface";
import { v4 as uuid } from "uuid";

export function configToMongoUrl(databaseConfig: IDatabaseConfig) {
	if (databaseConfig.url) {
		return databaseConfig.url;
	} else if (databaseConfig.username && databaseConfig.password) {
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
