// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const { contextBridge, ipcRenderer, ipcMain } = require('electron');
const channels = require('../common/channels');
const channelsList = Object.values(channels);

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    send: (channel, data) => {
      // whitelist channels
      if (channelsList.includes(channel)) {
        ipcRenderer.send(channel, data);
      }
    },
    invoke: async (channel, data) => {
      if (channelsList.includes(channel)) {
        const result = await ipcRenderer.invoke(channel, data);
        return result;
      }
    },
    on: (channel, func) => {
      if (channelsList.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.on(channel, (event, ...args) => func(...args));
      }
    },
  },
});

// Inject versions into DOM
window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  };

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type]);
  }

  replaceText(`app-version`, process.env.npm_package_version);
});
