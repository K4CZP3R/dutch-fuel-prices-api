import { writeFile } from "fs/promises";
import * as jose from "jose";

async function main() {
	console.log("Will generate a keypair.");
	const { publicKey, privateKey } = await jose.generateKeyPair("RS512");

	const publicJwk = await jose.exportJWK(publicKey);
	const privateJwk = await jose.exportJWK(privateKey);

	await writeFile("public.jwk", JSON.stringify(publicJwk, null, 2));
	await writeFile("private.jwk", JSON.stringify(privateJwk, null, 2));
}

main();
