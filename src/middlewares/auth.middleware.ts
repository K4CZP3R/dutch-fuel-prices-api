import { Router, Request, Response, NextFunction } from "express";
import { JWT_SERVICE } from "../helpers/di-names.helper";
import { HttpException } from "../models/exceptions/http.exception";
import { ISession } from "../models/interfaces/session.interface";
import { UserRepository } from "../repositories/user.repository";
import { DependencyProviderService } from "../services/dependency-provider.service";
import { JwtSessionService } from "../services/jwt-session.service";

async function authMiddleware(req: Request, res: Response, next: NextFunction) {
	let authHeader = req.get("Authorization");

	if (authHeader === undefined) {
		return next(new HttpException(401, "Unauthorized!"));
	}

	if (!authHeader.startsWith("Bearer")) return next(new HttpException(401, "Invalid authorization!"));

	let jwtKey = authHeader.replace("Bearer ", "");

	let session: ISession = undefined;

	try {
		session = await DependencyProviderService.getImpl<JwtSessionService>(JWT_SERVICE).verifySession(jwtKey);
	} catch (e: any) {
		return next(new HttpException(401, "Token malformed! " + e.message));
	}

	return session;
}

export async function authUserMiddleware(req: Request, res: Response, next: NextFunction) {
	const session = await authMiddleware(req, res, next);
	if (typeof session === "undefined") return;

	if (session.type !== "user") {
		return next(new HttpException(401, "Invalid token type!"));
	}
	req["userSession"] = session;
	new UserRepository()
		.getUserById(session.id)
		.then(user => {
			req["user"] = user;
			return next();
		})
		.catch(e => {
			return next(new HttpException(500, "something went wrong!"));
		});
}
export async function authRefreshMiddleware(req: Request, res: Response, next: NextFunction) {
	const session = await authMiddleware(req, res, next);
	if (typeof session === "undefined") return;

	if (session.type !== "refresh") {
		return next(new HttpException(401, "Invalid token type!"));
	}
	req["refreshSession"] = session;
	new UserRepository()
		.getUserById(session.id)
		.then(user => {
			req["user"] = user;
			return next();
		})
		.catch(e => {
			return next(new HttpException(500, "something went wrong!"));
		});
}
