import { Request, Response, NextFunction } from "express";
import { HttpException } from "../models/exceptions/http.exception";

export function errorMiddleware(error: HttpException, request: Request, response: Response, next: NextFunction) {
	const status = error.errorCode || 500;
	const message = error.message || "Something went wrong.";

	response.status(status).send({ status, message });
}
