import Debug, { Debugger } from "debug";
import getCallerFile = require("get-caller-file");

export function getDebug(tag: string = ""): Debugger {
    return Debug(`${tag ? `${tag}:` : ''}dutch-fuel-prices-api:${getCallerFileName(3)}`);
}

export function getCallerFileName(pos = 2): string | undefined {
    let callerFile: string | undefined = undefined;

    try {
        const fullPath = getCallerFile(pos) as string;
        // Get running platform
        const isWindows = process.platform === "win32";

        callerFile = fullPath.split(isWindows ? /\\/ : /\//).pop();


        // callerFile = fullPath.split(/[/]/).pop();
    } catch (e: unknown) {
        callerFile = "unknown";
    }
    return callerFile;
}