import { Router, Request, Response, NextFunction } from "express";
import { IController } from "../models/interfaces/controller.interface";
import { IRoute } from "../models/interfaces/route.interface";

export class BaseController implements IController {
	public path: string;
	public routes: IRoute[] = [];
	public router: Router = Router();

	constructor(config: { path: string }) {
		this.path = config.path;
	}

	public loadRoutes(): void {
		this.routes.forEach(route => {
			if (!route.method) {
				console.warn("Invalid route:", route, " in path:", this.path, "ignoring!");
				return;
			}

			this.router[route.method.toLowerCase()](
				route.path,
				route.middlewares ? route.middlewares : [],
				async (req: Request, res: Response, next: NextFunction) => {
					route.func(req, res, next).catch(error => {
						next(error);
					});
				}
			);
		});
	}
}
