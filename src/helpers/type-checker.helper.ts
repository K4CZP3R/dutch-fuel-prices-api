import { IResult } from "../models/interfaces/result.interface";
import { isAllowedUsername, isValidEmail, isValidUUID } from "./input-validator.helper";
import { isStrongEncodedPassword, isStrongPassword } from "./password.helper";

export function checkValues(
	dataIn: any,
	config?: { shouldContainKeys?: string[]; checkRuleChangeableValues?: boolean }
) {
	let shouldContainKeys = config && config.shouldContainKeys ? config.shouldContainKeys : [];
	let checkRuleChangeableValues = config && config.checkRuleChangeableValues ? config.checkRuleChangeableValues : false;

	shouldContainKeys.forEach(shouldKey => {
		if (Object.keys(dataIn).indexOf(shouldKey) === -1) {
			throw new Error("Misformed data!");
		}
	});

	Object.keys(dataIn).forEach(key => {
		let result: IResult<undefined> | undefined = undefined;
		switch (key.toLowerCase()) {
			case "email":
				result = dataIn[key] ? isValidEmail(dataIn[key]) : { success: false, message: "Invalid data (email)" };
				break;
			case "passwordencoded":
				if (checkRuleChangeableValues) {
					result = dataIn[key]
						? isStrongEncodedPassword(dataIn[key])
						: { success: false, message: "Invalid data (password)" };
				}
				break;
			case "password":
				if (checkRuleChangeableValues) {
					result = dataIn[key] ? isStrongPassword(dataIn[key]) : { success: false, message: "Invalid data (password)" };
				}
				break;
			case "username":
				if (checkRuleChangeableValues) {
					result = dataIn[key]
						? isAllowedUsername(dataIn[key])
						: { success: false, message: "Invalid data (username)" };
				}
				break;
			default:
				if (key.toLowerCase().includes("id")) {
					result = dataIn[key] ? isValidUUID(dataIn[key]) : { success: false, message: "Invalid data (id)" };
				}
				if (key.toLowerCase().includes("name")) {
					result = dataIn[key] ? isAllowedUsername(dataIn[key]) : { success: false, message: "Invalid data (name)" };
				}
				break;
		}
		if (result === undefined) {
			return;
		}
		if (!result.success) {
			//TODO: Something wrong with uuid check
			// console.log("throwing!", result.message);
			throw new Error(result.message);
		}
		return;
	});
}
