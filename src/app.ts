import express from "express";
import helmet from "helmet";
import cors from "cors";

import { IController } from "./models/interfaces/controller.interface";
import { errorMiddleware } from "./middlewares/error.middleware";
import { DependencyProviderService } from "./services/dependency-provider.service";
import { JWT_SERVICE } from "./helpers/di-names.helper";
import { getEnvironment } from "./helpers/dotenv.helper";
import { createMongooseConnection } from "./services/mongoose-connection.service";
import { configToMongoUrl } from "./helpers/mongo.helper";
import { Environment } from "./models/environment.model";
import { getDebug } from "./helpers/debug.helper";
import { DirectLeaseService, DIRECTLEASE_SERVICE } from "./services/directlease.service";
import { FuelType } from "./models/enums/fuel-type.enum";
import { TankstationController } from "./controllers/tankstation.controller";


export class App {
	public app: express.Express;
	debug: debug.Debugger;
	public appIsReady: boolean;

	constructor() {
		this.appIsReady = false;
		this.debug = getDebug();

		const environemnt = getEnvironment();

		this.debug("Initializing express app");
		this.app = express();

		this.bootstrapApp(environemnt)
			.then(() => {
				this.appIsReady = true;
				this.debug("App bootstrapped!");
			})
			.catch((e: any) => {
				console.error("Something went wrong while bootstrapping", e);
			});
	}

	private async bootstrapApp(environment: Environment) {
		await environment.initialize();
		this.setupDi(environment);
		if (environment.isDev()) await this.seedDatabaseInDev();
		this.setupMiddlewares();
		this.setupControllers();
		this.setupAfterMiddlewares();
	}

	private setupDi(env: Environment) {
		createMongooseConnection(configToMongoUrl(env.getDatabase()));

		DependencyProviderService.setImpl<DirectLeaseService>(
			DIRECTLEASE_SERVICE,
			new DirectLeaseService([FuelType.Diesel, FuelType.Euro95, FuelType.Euro98], env.refreshPricesEveryMs())
		)
	}

	private setupMiddlewares() {
		this.app.use(helmet());
		this.app.use(cors());
		this.app.use(express.json());
	}

	private setupControllers() {
		this.controllers.forEach(controller => {
			this.app.use(controller.path, controller.router);
		});
	}

	private setupAfterMiddlewares() {
		this.app.use(errorMiddleware);
	}

	private async seedDatabaseInDev() {
		/* Define repos and seed here */
	}
}
