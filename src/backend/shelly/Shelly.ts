import {EventEmitter} from 'events';
import { getStatus, toggleSwitch } from "./apiClient";
import { ShellySwitch } from "./types";

export default class Shelly extends EventEmitter {
    ipAddress: string;
    switches: ShellySwitch[];
    connected = false;
    private hasConnected = false;
    private heartbeatId: NodeJS.Timeout

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
        }, 5000);
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
            this.emit("connected")
        }
        catch(err) {
            if(this.connected) {
                this.emit("disconnected");
                this.connected = false;
            }
        }
    }
}