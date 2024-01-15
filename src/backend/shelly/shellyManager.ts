import { ipcMain } from "electron";
import Shelly from "./Shelly"
import Messages from "../../ipc/Messages";
import { getMainWindow } from "../mainWindow";

let shellys: Shelly[] = [];

export const initialize = () => {
    ipcMain.handle(Messages.AddShellys, (_, ipAddresses) => addShellys(ipAddresses));
    ipcMain.handle(Messages.ClearShellys, clearShellys );
    ipcMain.handle(Messages.FireTrap, (_, ipAddress) => toggleSwitch(ipAddress));
    ipcMain.handle(Messages.TrapStatus, (_, ipAddress) => getShellyStatus(ipAddress));
}

const addShellys = (ipAddresses: string[]) => {
    ipAddresses.forEach(ip => {
        const shelly = new Shelly(ip);
        shellys.push(shelly);

        shelly.on("connected", () => {
            const window = getMainWindow();
            window.webContents.send(Messages.TrapConnected);
        });

        shelly.on('disconnected', () => {
            const window = getMainWindow();
            window.webContents.send(Messages.TrapDisconnected);
        });

        shelly.connect();
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

    //turn it back off
    //await shelly.toggle(shelly.switches[0]);
};

const getShelly = (ipAddress: string) => shellys.find(s => s.ipAddress === ipAddress);