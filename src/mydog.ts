import Application from "./application";
import { I_connectorConstructor } from "./util/interfaceDefine";
import { ConnectorTcp } from "./connector/connectorProxyTcp";
import { ConnectorWs } from "./connector/connectorProxyWs";

interface I_mydog {
    version: string,
    createApp: () => Application | undefined,
    app: Application,
    connector: {
        connectorTcp: I_connectorConstructor,
        connectorWs: I_connectorConstructor,
    }
}


let hasCreated = false;
let mydog: I_mydog = {} as any;
mydog.version = require("../package.json").version;
mydog.createApp = function () {
    if (hasCreated) {
        console.error("the app has already been created");
        return;
    }
    hasCreated = true;
    mydog.app = new Application();
    return mydog.app;
};

mydog.connector = {
    "connectorTcp": ConnectorTcp,
    "connectorWs": ConnectorWs
};


export = mydog