export class HttpException extends Error {
	constructor(public errorCode: number, public message: string) {
		super(message);
	}
}
