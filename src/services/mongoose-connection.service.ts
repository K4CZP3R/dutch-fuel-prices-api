import mongoose from "mongoose";

export function createMongooseConnection(mongoUrl: string): Promise<any> {
	return mongoose.connect(mongoUrl);
}

export function destroyMongooseConnection(): Promise<void>{
	return mongoose.disconnect();
}