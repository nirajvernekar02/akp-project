const path = require('path');
const { app, BrowserWindow, ipcMain } = require('electron');
const isDev = require('electron-is-dev');
const { spawn } = require('child_process');

let mainWindow;
let backendProcess;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    }
  });

  // Load the React app
  mainWindow.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`
  );

  // Open DevTools in development
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  // Handle window closing
  mainWindow.on('closed', () => {
    mainWindow = null;
    
    // Terminate backend process when app closes
    if (backendProcess) {
      backendProcess.kill();
    }
  });
}

function startBackendService() {
  // Replace with your actual backend start command
  backendProcess = spawn('node', ['path/to/your/backend/server.js'], {
    detached: true,
    stdio: 'ignore'
  });

  backendProcess.unref(); // Allow the parent process to exit independently
}

app.on('ready', () => {
  createWindow();
  
  // Start backend service only in production
  if (!isDev) {
    startBackendService();
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});