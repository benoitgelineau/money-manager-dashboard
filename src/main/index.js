// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');
const channels = require('../common/channels');
const { getRows, CSV_FILEPATH, addRow } = require('./csvHelper');

let mainWindow;
let modalWindow;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 700,
    minWidth: 1200,
    minHeight: 700,
    webPreferences: {
      contextIsolation: true, // protect against prototype pollution
      enableRemoteModule: false, // turn off remote
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.on('close', () => {
    if (!!modalWindow) {
      modalWindow = null;
    }
    mainWindow = null;
  });

  // and load the index.html of the app.
  mainWindow.loadFile('public/app/index.html');

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
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
  if (!!modalWindow) {
    modalWindow.focus();
    return;
  }
  modalWindow = new BrowserWindow({
    width: 600,
    height: 350,
    frame: false,
    webPreferences: {
      contextIsolation: true, // protect against prototype pollution
      enableRemoteModule: false, // turn off remote
      preload: path.join(__dirname, 'preload.js'),
    },
  });
  modalWindow.on('close', () => {
    modalWindow = null;
  });
  modalWindow.loadFile('public/modals/index.html');
  modalWindow.show();
});

ipcMain.on(channels.CLOSE_MODAL, () => {
  if (!!modalWindow) {
    modalWindow.close();
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
  createWindow();

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
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
