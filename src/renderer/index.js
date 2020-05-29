// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
const { ipcRenderer } = window.electron;
console.log('renderer process');

const getTransactions = async () => {
  console.log('getTransactions');
  const result = await ipcRenderer.invoke('toMain', 'mon message transmis');
  console.log('renderer result:', result);
  return result;
};

getTransactions();
