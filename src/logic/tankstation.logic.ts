import { checkValues } from "../helpers/type-checker.helper";
import { IResult } from "../models/interfaces/result.interface";
import { ITankstation } from "../models/tankstation.model";
import { Inject } from "../services/dependency-provider.service";
import { DirectLeaseService, DIRECTLEASE_SERVICE } from "../services/directlease.service";

export class TankstationLogic {
    @Inject<DirectLeaseService>(DIRECTLEASE_SERVICE)
    directleaseService!: DirectLeaseService


    async getTankstationById(data: { id: string }): Promise<any> {
        checkValues(data, { shouldContainKeys: ["id"] })
        return this.directleaseService.getTankstationById(parseInt(data.id));
    }

    async getTankstationsInCity(data: { city: string }): Promise<IResult<ITankstation[]>> {
        checkValues(data, { shouldContainKeys: ["city"] })
        return this.directleaseService.getTankstationsInCity(data.city);
    }

}