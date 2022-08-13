
import { NextFunction, Request, Response } from "express";
import { TankstationLogic } from "../logic/tankstation.logic";
import { IRoute } from "../models/interfaces/route.interface";
import { BaseController } from "./base.controller";

export class TankstationController extends BaseController {
    routes: IRoute[] = [
        {
            path: "/by-id/:id",
            method: "GET",
            func: this.pathById.bind(this)
        },
        {
            path: "/by-city/:city",
            method: "GET",
            func: this.pathByCity.bind(this)
        }
    ]

    constructor(private tankstationLogic = new TankstationLogic()) {
        super({ path: "/tankstation" });
        this.loadRoutes();
    }

    async pathById(req: Request, res: Response, next: NextFunction) {
        const data = { ...req.params } as any;
        let result = await this.tankstationLogic.getTankstationById(data);
        return res.json(result);
    }

    async pathByCity(req: Request, res: Response, next: NextFunction) {
        const data = { ...req.params } as any;
        let result = await this.tankstationLogic.getTankstationsInCity(data);
        return res.json(result);

    }
}