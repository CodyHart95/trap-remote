import express from "express";
import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import scriptSetConfig from "./rpc/Script.SetConfig.mjs";
import scriptGetConfig from "./rpc/Script.GetConfig.mjs";
import scriptCreate from "./rpc/Script.Create.mjs";
import scriptPutCode from "./rpc/Script.PutCode.mjs";
import scriptStart from "./rpc/Script.Start.mjs";
import scriptEval from "./rpc/Script.Eval.mjs";
import getDeviceInfo from "./rpc/Shelly.GetDeviceInfo.mjs";
import shellyGetStatus from "./rpc/Shelly.GetStatus.mjs";
import switchToggle from "./rpc/Switch.Toggle.mjs";
import switchGetStatus from "./rpc/Switch.GetStatus.mjs";

const app = express();
const port = 5000;

app.get("/", (req, res) => {
    res.contentType(".html");

    const __filename = fileURLToPath(import.meta.url);
    const p = path.join(path.dirname(__filename), "testSwitchPage.html")
    const data = readFileSync(p);
    res.send(data);
});

app.get("/rpc/Script.SetConfig", scriptSetConfig);

app.get("/rpc/Script.GetConfig", scriptGetConfig);

app.get("/rpc/Script.Create", scriptCreate);

app.get("/rpc/Script.PutCode", scriptPutCode);

app.get("/rpc/Script.Start", scriptStart);

app.get("/rpc/Script.Eval", scriptEval);

app.get("/rpc/Shelly.getDeviceInfo", getDeviceInfo);

app.get("/rpc/Shelly.GetStatus", shellyGetStatus)

app.get("/rpc/Switch.Toggle", switchToggle)

app.get("/rpc/Switch.GetStatus", switchGetStatus)

app.listen(port, () => {
    console.log(`Test Server started on port ${port}`)
});