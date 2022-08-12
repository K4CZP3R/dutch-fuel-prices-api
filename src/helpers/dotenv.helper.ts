import * as dotenv from "dotenv";
import { IEnvironment, IEnvironmentKeys } from "../models/interfaces/environment.interface";
import _ from "lodash";
import { Environment } from "../models/environment.model";

dotenv.config();

export function getEnvironmentInterface(): IEnvironment {
	return _.pick(process.env, Object.keys(IEnvironmentKeys)) as unknown as IEnvironment;
}

export function getEnvironment(): Environment {
	return new Environment(getEnvironmentInterface());
}
