const {app, BrowserWindow} = require('electron');
const path = require('path');

app.on('ready', () => {
  const mainWindow = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, 'src/preload.js')
    }
  });
  mainWindow.loadFile(path.join(__dirname, 'public/index.html'));
  mainWindow.webContents.openDevTools();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
