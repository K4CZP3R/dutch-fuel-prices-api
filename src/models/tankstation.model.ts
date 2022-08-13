import { Schema, model } from "mongoose";
import { randomUuid } from "../helpers/mongo.helper";


export interface ITankstation {
    _id?: string;
    cat: number;
    city: string;
    country: string;
    id: number;
    lat: number;
    lng: number;
    name: string;
    updatedAt: Date;
    createdAt: Date;
    prices: {
        fuelType: string;
        price: number
    }[]
}

const priceSchema = new Schema()

const schema = new Schema<ITankstation>(
    {
        _id: randomUuid,
        cat: Number,
        city: String,
        country: String,
        id: Number,
        lat: Number,
        lng: Number,
        name: String,
        prices: [{
            fuelType: String,
            price: Number
        }]

    }, {
    timestamps: true
}
)

export const TankstationModel = model<ITankstation>("Tankstation", schema);