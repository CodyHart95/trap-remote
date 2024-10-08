import { app, BrowserWindow, Menu } from 'electron';
import { initialize as initializeStorage } from "./backend/storage";
import path from 'path';
import { initialize as initializeShellyManager } from "./backend/shelly/shellyManager";
import { createMainWindow } from './backend/mainWindow';
import isDev from 'electron-is-dev';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  const mainWindow = createMainWindow();

  initializeStorage();
  initializeShellyManager();

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  if(isDev) {
    // Open the DevTools.
    mainWindow.webContents.openDevTools({mode: "detach"});
  }

  mainWindow.webContents.on("before-input-event", (event, input) => {
    if(input.type === "keyDown" && input.key === "d" && input.modifiers.includes("control")) {
      mainWindow.webContents.openDevTools({ mode: "detach" });
    }
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.d
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

Menu.setApplicationMenu(null);
