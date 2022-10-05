import { TankstationRepository } from "../repositories/tankstation.repository";
import axios from "axios";
import { FuelType } from "../models/enums/fuel-type.enum";
import { ITankstation } from "../models/tankstation.model";
import Tesseract, { createWorker } from "tesseract.js";
import { makeFuelInfoReadable } from "../helpers/image-manipulation.helper";
import { IResult } from "../models/interfaces/result.interface";
import { imageToText } from "../helpers/ocr.helper";
import { getDebug } from "../helpers/debug.helper";

export const DIRECTLEASE_SERVICE = "DIRECTLEASE_SERVICE";

export class DirectLeaseService {
	private BASE_URL = "https://tankservice.app-it-up.com";
	private debug: debug.Debugger = getDebug();
	private jobActive = false;

	constructor(
		private fuelsToInclude: FuelType[],
		private refreshPricesEveryMs: number,
		private tankstationRepository = new TankstationRepository()
	) {}

	private async fetchAllRemoteTankstations(): Promise<ITankstation[]> {
		const fuelParam = this.fuelsToInclude.map(fuel => fuel.toString()).join(",");
		const url = `${this.BASE_URL}/Tankservice/v2/places?fmt=web&country=NL&fuel=${fuelParam}&lang=nl`;
		return axios.get<ITankstation[]>(url).then(response => response.data);
	}

	private async tankstationExistsRemotely(id: number): Promise<ITankstation> {
		const availableTankstationsRemotely = await this.fetchAllRemoteTankstations();
		return availableTankstationsRemotely.find(t => t.id === id);
	}

	private async fetchImageOfTankstation(tankstation: ITankstation): Promise<Buffer> {
		const url = `${this.BASE_URL}/Tankservice/v2/places/${tankstation.id}.png?lang=nl`;
		return axios.get(url, { responseType: "arraybuffer" }).then(response => response.data);
	}

	private async saveTankstationWithPrices(tankstation: ITankstation) {
		let imageWithPrices = await this.fetchImageOfTankstation(tankstation);
		imageWithPrices = await makeFuelInfoReadable(imageWithPrices);

		const textFromImage = await imageToText(imageWithPrices);

		const textWithPrices = textFromImage.split("\n").filter(line => line.includes("€"));

		let prices: { fuelType: string; price: number }[] = [];

		for (let text of textWithPrices) {
			let [rawType, rawPrice] = text.split("€");

			let price =
				parseInt(
					rawPrice
						.split("")
						.filter(char => char.match(/[0-9]/))
						.join("")
				) / 100;
			if (price === 7.77) {
				console.warn(
					`Price in '${text}' from tankstation ${tankstation.id} is probably wrong: ?.?? is recognized as 7.77`
				);
				price = -1;
			}
			let fuelType = rawType
				.split("")
				.filter(char => char.match(/[a-z0-9()]/i))
				.join("")
				.toLowerCase();
			prices.push({ fuelType, price });
		}
		tankstation.prices = prices;
		if (tankstation._id) {
			console.log("Updating.");
			await this.tankstationRepository.update(tankstation._id, tankstation);
		} else {
			console.log("Adding!");
			await this.tankstationRepository.addObject(tankstation);
		}

		return tankstation;
	}

	public async getTankstationsInCity(city: string): Promise<IResult<ITankstation[]>> {
		const tankstations = await this.fetchAllRemoteTankstations();
		const tankstationsInCity = tankstations.filter(tankstation => tankstation.city === city);
		return {
			success: true,
			message: "Use getTankstationById to get the prices.",
			data: tankstationsInCity,
		};
	}

	public async getTankstationById(id: number): Promise<IResult<ITankstation | undefined>> {
		const savedTankstation = await this.tankstationRepository.getByKey("id", id);

		if (savedTankstation && new Date().getTime() - savedTankstation.updatedAt.getTime() < this.refreshPricesEveryMs) {
			return { success: true, message: "Returned up-to-date data.", data: savedTankstation };
		}

		const tankstationRemotely = await this.tankstationExistsRemotely(id);

		if (!tankstationRemotely) throw new Error(`Tankstation with id ${id} not found.`);

		// if (this.jobActive) {
		//     throw new Error("Job already active.");
		// }

		if (!this.jobActive) {
			this.jobActive = true;
			this.saveTankstationWithPrices({ ...tankstationRemotely, _id: savedTankstation?._id ?? undefined }).finally(
				() => {
					this.jobActive = false;
					this.debug("Done");
				}
			);
		}

		if (savedTankstation)
			return {
				success: true,
				message: "Tankstation found, analyzing prices, showing outdated data (retry request to get new data)",
				data: savedTankstation,
			};
		else
			return {
				success: true,
				message: "Tankstation found, analyzing prices, this is the first time.",
				data: undefined,
			};
	}
}
