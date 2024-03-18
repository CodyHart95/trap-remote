import { BrowserWindow } from "electron";
import path from "path";

let mainWindow: BrowserWindow = null;

export const createMainWindow = () => {
    // Create the browser window.
    mainWindow = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
      },
    });

    mainWindow.removeMenu();
    mainWindow.maximize();

    return mainWindow;
  };

export const getMainWindow = () => mainWindow;