import { NextFunction, Response, Request } from "express";
import { checkValues } from "../helpers/type-checker.helper";
import { AuthLogic } from "../logic/auth.logic";
import { authRefreshMiddleware, authUserMiddleware } from "../middlewares/auth.middleware";
import { IRoute } from "../models/interfaces/route.interface";
import { BaseController } from "./base.controller";

export class AuthController extends BaseController {
	routes: IRoute[] = [
		{
			path: "/jwks",
			method: "GET",
			func: this.pathJwks.bind(this),
		},
		{
			path: "/email/register",
			method: "POST",
			func: this.pathEmailRegister.bind(this),
		},
		{
			path: "/email",
			method: "POST",
			func: this.pathEmailAuth.bind(this),
		},
		{
			path: "/refresh",
			method: "GET",
			func: this.pathRefresh.bind(this),
			middlewares: [authRefreshMiddleware],
		},
		{
			path: "/me",
			method: "GET",
			func: this.pathMe.bind(this),
			middlewares: [authUserMiddleware],
		},
	];

	constructor(private authLogic: AuthLogic = new AuthLogic()) {
		super({ path: "/auth" });
		this.loadRoutes();
	}

	async pathMe(req: Request, res: Response, next: NextFunction) {
		let result = await this.authLogic.meData({ user: req["user"] });
		res.json(result);
	}

	async pathRefresh(req: Request, res: Response, next: NextFunction) {
		let result = await this.authLogic.refreshToken({ user: req["user"] });
		res.json(result);
	}

	async pathEmailAuth(req: Request, res: Response, next: NextFunction) {
		let result = await this.authLogic.authenticateUsingEmail(req.body);
		res.json(result);
	}

	async pathEmailRegister(req: Request, res: Response, next: NextFunction) {
		let result = await this.authLogic.registerUsingEmail(req.body);

		res.json(result);
	}

	async pathJwks(req: Request, res: Response, next: NextFunction) {
		let result = await this.authLogic.getJwks();
		res.json(result);
	}
}
