// public/electron-main.js
const { app, BrowserWindow } = require("electron");
const path = require("path");
const express = require("express");
const cors = require("cors");

const localServerApp = express();
const PORT = process.env.PORT || 8088;

// Check if in development mode without electron-is-dev
const isDev = process.env.NODE_ENV !== 'production';

const startLocalServer = (done) => {
  localServerApp.use(express.json({ limit: "100mb" }));
  localServerApp.use(cors());
  
  if (isDev) {
    localServerApp.use(express.static(path.join(__dirname, '../public')));
  } else {
    localServerApp.use(express.static(path.join(__dirname, '../build')));
  }

  localServerApp.get('*', (req, res) => {
    if (isDev) {
      res.sendFile(path.join(__dirname, '../public', 'index.html'));
    } else {
      res.sendFile(path.join(__dirname, '../build', 'index.html'));
    }
  });

  localServerApp.listen(PORT, async () => {
    console.log(`Server Started on PORT ${PORT}`);
    done();
  });
};

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      webSecurity: !isDev,
      nodeIntegrationInWorker: true
    },
  });

  const startURL = isDev 
    ? `http://localhost:${PORT}`
    : `file://${path.join(__dirname, '../build/index.html')}`;

  mainWindow.loadURL(startURL);

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }
}

app.whenReady().then(() => {
  startLocalServer(createWindow);

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});