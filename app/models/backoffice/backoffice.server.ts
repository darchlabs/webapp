import {Backoffice as BackofficeClass} from "darchlabs"
import invariant from "tiny-invariant"

let Backoffice: BackofficeClass;

declare global {
    var __backoffice__: BackofficeClass;
}

if (process.env.NODE_ENV == "production") {
    Backoffice = getClient()
} else {
    if (!global.__backoffice__) {
        global.__backoffice__ = getClient();
    }
    Backoffice = global.__backoffice__;
}

function getClient() {
    const { BACKOFFICE_URL} = process.env;
    invariant(typeof BACKOFFICE_URL === "string", "BACKOFFICE_URL env var not set");

    const client = new BackofficeClass(BACKOFFICE_URL);

    return client;
}

export { Backoffice }