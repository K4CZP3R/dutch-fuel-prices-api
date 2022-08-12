import * as crypto from "crypto";

export function generateNumberBetween(min: number, max: number): number {
	return crypto.randomInt(min, max);
}

export function generateRandomSecret(lengthEven: number): string {
	return crypto.randomBytes(lengthEven / 2).toString("hex");
}

export function generateKeyPair(): { publicKey: string; privateKey: string } {
	const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
		modulusLength: 4096,
		publicKeyEncoding: {
			type: "spki", // recommended to be 'spki' by the Node.js docs
			format: "pem",
		},
		privateKeyEncoding: {
			type: "pkcs8", // recommended to be 'pkcs8' by the Node.js docs
			format: "pem",
		},
	});

	return {
		publicKey: publicKey,
		privateKey: privateKey,
	};
}

generateKeyPair();
