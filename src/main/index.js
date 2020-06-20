// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const channels = require('../common/channels');
const { getRows, CSV_FILEPATH, addRow } = require('./csvHelper');

const defaultBrowserWindowOptions = {
  show: false,
  webPreferences: {
    contextIsolation: true, // protect against prototype pollution
    enableRemoteModule: false, // turn off remote
    preload: path.join(__dirname, 'preload.js'),
  },
};
let mainWindow;
let childWindow;

function createMainWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    ...defaultBrowserWindowOptions,
    width: 1200,
    height: 700,
    minWidth: 1200,
    minHeight: 700,
  });

  mainWindow.on('close', () => {
    if (!!childWindow) {
      childWindow = null;
    }
    mainWindow = null;
  });

  // and load the index.html of the app.
  mainWindow.loadFile('public/app/index.html');

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
}

function createChildWindow() {
  childWindow = new BrowserWindow({
    ...defaultBrowserWindowOptions,
    width: 600,
    height: 350,
    frame: false,
    parent: mainWindow, // Always on top of mainWindow
    // modal: true, // Dark background and fixed position
  });

  childWindow.on('close', () => {
    childWindow = null;
  });

  childWindow.loadFile('public/childWindows/addTransaction/index.html');

  childWindow.once('ready-to-show', () => {
    childWindow.show();
  });
}

// Enable hot reload
require('electron-reload')(__dirname, {
  electron: path.join(
    __dirname,
    '..',
    '..',
    'node_modules',
    '.bin',
    'electron',
  ),
  awaitWriteFinish: true,
});

// Event listeners
ipcMain.handle(channels.FETCH_TRANSACTIONS, async (event, periodRange) => {
  try {
    if (fs.existsSync(CSV_FILEPATH)) {
      const data = await getRows(periodRange);
      return data;
    }
  } catch (error) {
    console.log('[MAIN] cannot get rows from .csv', error);
  }
});

ipcMain.on(channels.OPEN_MODAL, () => {
  if (!!childWindow) {
    childWindow.focus();
    return;
  }
  createChildWindow();
});

ipcMain.on(channels.CLOSE_MODAL, () => {
  if (!!childWindow) {
    childWindow.close();
  }
});

ipcMain.on(channels.ADD_TRANSACTION, async (event, data) => {
  await addRow(data);
  const transactions = await getRows();
  // Update store in main window
  mainWindow.webContents.send(channels.SET_TRANSACTIONS, transactions);
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createMainWindow();

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
  });
});

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
