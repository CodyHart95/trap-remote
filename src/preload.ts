// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("interop", {
    // https://stackoverflow.com/questions/44391448/electron-require-is-not-defined
    send: (msg: string, data: any) => {
        // whitelist channels
        ipcRenderer.send(msg, data);
    },
    receive: (channel: string, func: (data: any)=> void) => {
            // Deliberately strip event as it includes `sender`
        ipcRenderer.on(channel, (event, data) => func(data));
    },
    invoke: async (msg: string, data: any) => await ipcRenderer.invoke(msg, data),
    removeAllListeners: () => ipcRenderer.removeAllListeners("mainChannel"),
    removeListener: ipcRenderer.removeListener,
});