import Shelly from "./Shelly"
import Messages from "../../ipc/Messages";
import { getMainWindow } from "../mainWindow";
import { handle } from "../ipc";

let shellys: Shelly[] = [];

export const initialize = () => {
    handle(Messages.OpenShellys, openShellys);
    handle(Messages.ClearShellys, clearShellys );
    handle(Messages.FireTrap, toggleSwitch);
    handle(Messages.TrapStatus, getShellyStatus);
    handle(Messages.DisconnectShellys, disconnect )
}

const openShellys = (traps: Trap[]) => {
    traps.forEach(trap => {
        if(!shellys.find(s => s.ipAddress === trap.ipAddress)) {
            const shelly = new Shelly(trap.ipAddress);
            shellys.push(shelly);
    
            shelly.on("connected", () => {
                const window = getMainWindow();
                window.webContents.send(Messages.TrapConnected, trap);
            });
    
            shelly.on('disconnected', () => {
                const window = getMainWindow();
                window.webContents.send(Messages.TrapDisconnected, trap);
            });
    
            shelly.connect();
        }
    })
};

const clearShellys = () => {
    shellys.forEach(s => s.disconnect());
    shellys = [] as Shelly[];
}

const getShellyStatus = (ipAddress: string) => {
    const shelly = getShelly(ipAddress);

    return {
        ipAddress: ipAddress,
        status: shelly.connected
    };
};

const toggleSwitch = async (ipAddress: string) => {
    const shelly = getShelly(ipAddress);

    // fire it
    await shelly.toggle(shelly.switches[0]);

    // Wait a second for the arm to move
    await new Promise(resolve => setTimeout(resolve, 1000));
};

const getShelly = (ipAddress: string) => {
    const shelly = shellys.find(s => s.ipAddress === ipAddress);

    if(!shelly) {
        return new Shelly(ipAddress);
    }
}

const disconnect = (traps: Trap[]) => {
    for(const trap of traps) {
        const index = shellys.findIndex(s => s.ipAddress === trap.ipAddress);

        if(index > -1) {
            const shelly = shellys[index];
            shelly.disconnect();
    
            shellys.splice(index);
        }
    }
}