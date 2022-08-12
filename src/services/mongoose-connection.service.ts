import mongoose from "mongoose";

export function createMongooseConnection(mongoUrl: string) {
	mongoose.connect(mongoUrl);
}