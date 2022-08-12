import { Schema, model } from "mongoose";
import { randomUuid } from "../helpers/mongo.helper";
import { AccountType } from "./enums/account-type.enum";

export interface IUser {
	_id?: string;
	accountType?: string;
	name: string;
}

const schema = new Schema<IUser>(
	{
		_id: randomUuid,
		accountType: { type: String, default: AccountType.USER },
		name: { type: String },
	},
	{ timestamps: true }
);

export const UserModel = model<IUser>("User", schema);
