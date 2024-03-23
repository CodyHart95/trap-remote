import {EventEmitter} from 'events';
import { getStatus, toggleSwitch, listScripts, updateScriptConfig, startScript, createScript, putScriptCode } from "./apiClient";
import { ShellyScriptConfig, ShellySwitch } from "./types";
import { readFile } from "fs/promises";

export default class Shelly extends EventEmitter {
    ipAddress: string;
    switches: ShellySwitch[];
    connected = false;
    private hasSetup = false;
    private heartbeatId: NodeJS.Timeout;
    private closeScriptName = "close_script";

    constructor(ipAddress: string) {
        super();
        this.ipAddress = ipAddress;
    }

    connect = async () => {
        if(this.heartbeatId) {
            this.stopHeartbeat();
        }

        try {
            await this.connectInternal();
        }
        catch(err) {
            // Do we care? We'll keep trying to connect through the heartbeat;
        }
        finally {
            this.startHeartbeat();
        }
    }

    disconnect = () => {
        this.stopHeartbeat();
        this.connected = false;
        this.emit("disconnected");
    }

    toggle = async (shellySwitch: ShellySwitch) => {

        if(!this.switches.includes(shellySwitch)) {
            throw new Error("Given switch does not match Shelly device");
        }

        await toggleSwitch(this.ipAddress, shellySwitch.id)
    }

    private startHeartbeat = () => {
        this.heartbeatId = setInterval(() => {
            this.connectInternal().catch(() => this.connected = false)
        }, 10000);
    }

    private stopHeartbeat = () => {
        clearInterval(this.heartbeatId);
        this.heartbeatId = null;
    }

    private connectInternal = async () => {
        try {
            const status = await getStatus(this.ipAddress);
            this.switches = Object.keys(status).filter(k => k.startsWith("switch")).map(k => status[k]);
            this.connected = true;
            this.emit("connected");
            this.onInitialConnect();
        }
        catch(err) {
            if(this.connected) {
                this.emit("disconnected");
                this.connected = false;
            }
        }
    }

    private onInitialConnect = async () => {
        if(!this.hasSetup) {
            const scripts = await listScripts(this.ipAddress);

            const closeScriptConfig = scripts.find(s => s.name === this.closeScriptName)
            if(closeScriptConfig) {
                await this.checkScriptConfig(closeScriptConfig);
            }
            else {
                await this.uploadScript();
            }
        }
    }

    private checkScriptConfig = async (closeScriptConfig: ShellyScriptConfig) => {
        if(closeScriptConfig.enable && closeScriptConfig.running) {
            return;
        }

        const newConfig = {
            id: closeScriptConfig.id,
            name: closeScriptConfig.name,
            enable: closeScriptConfig.enable
        }

        await updateScriptConfig(this.ipAddress, closeScriptConfig.id, newConfig);
        await startScript(this.ipAddress, closeScriptConfig.id);
    }

    private uploadScript = async () => {
        try {
            const closeScript = await readFile("./src/backend/shelly/CloseScript.sjs", "utf-8");

            const scriptString = closeScript.replace(/\s/g,'');
            const { id } = await createScript(this.ipAddress, this.closeScriptName);

            await putScriptCode(this.ipAddress, id, scriptString);

            await this.checkScriptConfig({ id, name: this.closeScriptName, enable: true } as ShellyScriptConfig);
        }
        catch(err) {
            console.log(err);
        }
    }
}