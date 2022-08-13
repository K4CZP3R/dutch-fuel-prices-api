import { IResult } from "../models/interfaces/result.interface";
import { isAllowedUsername, isValidEmail, isValidUUID } from "./input-validator.helper";

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
			default:
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
