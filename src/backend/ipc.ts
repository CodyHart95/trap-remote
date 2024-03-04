import { ipcMain } from "electron";

export const handle = (channel: string, callback: AnyCallback) => ipcMain.handle(channel, (_, ...args) => callback(...args));