import { ITankstation, TankstationModel } from "../models/tankstation.model";
import { BaseRepository } from "./base.repository";

export class TankstationRepository extends BaseRepository<ITankstation>{
    constructor() {
        super(TankstationModel)
    }
}