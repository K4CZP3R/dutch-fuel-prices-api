import { Model as MongoModel } from "mongoose";

export interface IBaseRepository<T extends { _id?: string }> {
	addObject(item: T): Promise<T>;
	getAll(): Promise<T[]>;
	getById(id: string): Promise<T | undefined>;
	update(id: string, item: T): Promise<T>;
	getByKey(key: string, value: any): Promise<T | undefined>;
	getWithFilters(filters?: { [key: string]: any }, orderBy?: { [key: string]: number }, limit?: number): Promise<T[]>;
	getSchemaName(): string;
	removeAll(): Promise<number>;
}

export class BaseRepository<T extends { _id?: string }> implements IBaseRepository<T> {
	constructor(private Model = MongoModel) {}

	getSchemaName(): string {
		return this.Model.collection.name;
	}

	async removeAll(): Promise<number> {
		return (await this.Model.deleteMany({})).deletedCount;
	}
	async removeById(id: string): Promise<T> {
		let found = (await this.Model.findByIdAndRemove(id)) as T;
		if (!found) return undefined;
		return found;
	}

	async addObject(item: T, uniqueByKey: undefined | string = undefined): Promise<T> {
		let doc = new this.Model(item);
		if (uniqueByKey) {
			let found = await this.getByKey(uniqueByKey, doc[uniqueByKey]);
			if (found) throw new Error(`Item with ${uniqueByKey} ${item[uniqueByKey]} already exists`);
		}
		return (await doc.save()) as Promise<T>;
	}
	async getAll(): Promise<T[]> {
		return (await this.Model.find()) as T[];
	}

	async getWithFilters(
		filters?: { [key: string]: any },
		orderBy?: { [key: string]: number },
		limit?: number
	): Promise<T[]> {
		return limit
			? ((await this.Model.find(filters).sort(orderBy).limit(limit)) as T[])
			: ((await this.Model.find(filters).sort(orderBy)) as T[]);
	}
	async getById(id: string): Promise<T> {
		return (await this.Model.findById(id)) as T;
	}
	async update(id: string, item: T): Promise<T> {
		await this.Model.findByIdAndUpdate(id, item);
		return this.getById(item._id);
	}
	async getByKey(key: string, value: any): Promise<T> {
		let found = await this.Model.findOne({ [key]: value });
		if (!found) return undefined;

		return found as T;
	}
	async getAllByKey(key: string, value: any): Promise<T[]> {
		let found = await this.Model.find({ [key]: value });
		if (!found) return undefined;

		return found as T[];
	}
}
