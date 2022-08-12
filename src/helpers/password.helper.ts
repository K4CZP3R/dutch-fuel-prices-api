import { passwordStrength } from "check-password-strength";
import { IResult } from "../models/interfaces/result.interface";
import { SHA3 } from "sha3";
import { isValidBase64 } from "./input-validator.helper";

//TODO: Broken package

const features = ["lowercase", "uppercase", "number", "symbols"];

export function isStrongPassword(password: string): IResult<undefined> {
	if (!password || password.length === 0 || typeof password !== "string")
		return { success: false, message: "Invalid data!" };

	var testResult = passwordStrength(password);
	let missingFeatures = [];

	features.forEach(feature => {
		if (!(testResult.contains as string[]).includes(feature)) {
			missingFeatures.push(feature);
		}
	});

	if (testResult.id < 2) {
		return {
			success: false,
			message: `Password is not strong enough. Missing features: ${missingFeatures.join(", ")}`,
		};
	} else {
		return {
			success: true,
		};
	}
}

/**
 * Check if password is strong enough.
 * @param passwordEncoded Base64 encoded password
 * @returns true if password is strong enough
 */
export function isStrongEncodedPassword(passwordEncoded: string): IResult<undefined> {
	if (!passwordEncoded || passwordEncoded.length === 0 || typeof passwordEncoded !== "string") {
		return { success: false, message: "Invalid data!" };
	}

	if (!isValidBase64(passwordEncoded).success) {
		return {
			success: false,
			message: "Invalid input!",
		};
	}

	var password = Buffer.from(passwordEncoded, "base64").toString("utf8");
	return isStrongPassword(password);

	//'lowercase', 'uppercase', 'symbol', 'number'
}

export function hashPassword(passwordEncoded: string): string {
	var password = Buffer.from(passwordEncoded, "base64").toString("utf8");

	console.log("plain password", password);
	const hash = new SHA3(512);
	hash.update(password);
	return hash.digest("base64");
}
