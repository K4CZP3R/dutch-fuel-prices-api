import { getEnvironmentInterface } from "./helpers/dotenv.helper";
import http from "http";
import { App } from "./app";
import { getDebug } from "./helpers/debug.helper";

let env = getEnvironmentInterface();
if (!env.SERVER_PORT) {
	console.error("port for the server is not specified!");
	process.exit(1);
}

const debug = getDebug();

const app = new App();
const server = http.createServer(app.app);

server.listen(env.SERVER_PORT, "0.0.0.0", () => {
	debug(`App listening on port ${env.SERVER_PORT}!`);
});
