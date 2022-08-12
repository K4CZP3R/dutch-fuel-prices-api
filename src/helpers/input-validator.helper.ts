import { IResult } from "../models/interfaces/result.interface";

export function isValidEmail(input: string): IResult<undefined> {
	// Check if email is valid
	const re =
		/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	const resp = re.test(String(input).toLowerCase());
	return { success: resp, message: !resp ? "Invalid email!" : undefined };
}

export function isValid(data: string, type: any): boolean {
	if (typeof data === type) return true;
	return false;
}

export function isAllowedUsername(input: string): IResult<undefined> {
	// Check if username is valid
	const re = /^[a-zA-Z0-9_]{3,20}$/;

	let testResult = re.test(String(input).toLowerCase());

	return testResult
		? { success: true }
		: {
				success: false,
				message:
					"Username must be between 3 and 20 characters long and can only contain letters, numbers and underscores.",
		  };
}

export function isValidUUID(input: string): IResult<undefined> {
	// Check if UUID is valid
	const re = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
	const result = re.test(String(input).toLowerCase());

	return { success: result, message: result ? "That's some valid UUID!" : "Invalid UUID!" };
}

export function isValidBase64(input: string): IResult<undefined> {
	try {
		const resp = Buffer.from(input, "base64").toString("base64") === input;

		return {
			success: resp,
			message: resp ? undefined : "It's not base64 string!",
		};
	} catch (e: any) {
		return {
			success: false,
			message: "Invalid data type!",
		};
	}
}
