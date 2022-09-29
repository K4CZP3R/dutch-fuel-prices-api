import { Request, Response, NextFunction } from "express";

export interface IRoute {
	path: string;
	method: "POST" | "GET" | "PUT" | "DELETE";
	func: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	middlewares?: any[];
}
