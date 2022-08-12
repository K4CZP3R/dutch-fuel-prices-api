import { Schema, model } from "mongoose";
import { randomUuid } from "../helpers/mongo.helper";
import { AccountType } from "./enums/account-type.enum";
import { AuthType } from "./enums/auth-type.enum";

export interface IAuth {
	_id?: string;
	forUser?: string;
	authType?: AuthType;
	accountType?: AccountType;
	uniqueData?: {
		emailPwHash?: string;
		emailItself?: string;
	};
	createdAt?: Date;
	updatedAt?: Date;
}

const schema = new Schema<IAuth>(
	{
		_id: randomUuid,
		forUser: { type: String, required: true },
		authType: { type: String, required: true },
		accountType: { type: String, default: AccountType.USER },
		uniqueData: {
			emailPwHash: { type: String, required: false },
			emailItself: { type: String, required: false },
		},
	},
	{ timestamps: true }
);

export const AuthModel = model<IAuth>("Auth", schema);
