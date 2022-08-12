import { Router } from "express";
import { IRoute } from "./route.interface";

export interface IController {
	path: string;
	router: Router;
	routes: IRoute[];

	loadRoutes(): void;
}
