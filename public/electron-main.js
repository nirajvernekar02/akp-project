// electron-main.js
const { app, BrowserWindow } = require("electron");
const path = require("path");
const express = require("express");
const cors = require("cors");

const PORT = process.env.PORT || 8088;
const isDev = !app.isPackaged;

let mainWindow;
let retryCount = 0;
const MAX_RETRIES = 20;
const RETRY_DELAY = 1000;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: true
    },
    show: false,
    backgroundColor: '#ffffff',
    autoHideMenuBar: true
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    if (isDev) {
      mainWindow.webContents.openDevTools();
    }
  });

  const loadURL = async () => {
    try {
      // Update the URL loading logic
      if (isDev) {
        await mainWindow.loadURL('http://localhost:3000');
      } else {
        // In production, load from the correct build path
        const indexPath = path.join(__dirname, '../build/index.html');
        await mainWindow.loadFile(indexPath);
      }
      console.log('Application loaded successfully');
      retryCount = 0;
    } catch (err) {
      console.log(`Failed to load (attempt ${retryCount + 1}):`, err);
      if (retryCount < MAX_RETRIES) {
        retryCount++;
        setTimeout(loadURL, RETRY_DELAY);
      } else {
        console.error('Max retries reached. Could not load the application.');
        app.quit();
      }
    }
  };

  loadURL();
  return mainWindow;
}

const startProductionServer = () => {
  const server = express();
  server.use(cors());
  server.use(express.json({ limit: "100mb" }));

  // Update static path to use absolute path
  const staticPath = path.resolve(__dirname, '../build');
  console.log('Serving static files from:', staticPath);
  
  server.use(express.static(staticPath));

  server.get('*', (req, res) => {
    res.sendFile(path.join(staticPath, 'index.html'));
  });

  return new Promise((resolve, reject) => {
    server.listen(PORT, () => {
      console.log(`Server started on port ${PORT} in ${isDev ? 'development' : 'production'} mode`);
      resolve();
    }).on('error', reject);
  });
};

const waitForDevServer = () => {
  return new Promise((resolve) => {
    const checkServer = () => {
      require('http').get('http://localhost:3000', (res) => {
        if (res.statusCode === 200) {
          resolve();
        } else {
          setTimeout(checkServer, 1000);
        }
      }).on('error', () => {
        setTimeout(checkServer, 1000);
      });
    };
    checkServer();
  });
};

app.whenReady().then(async () => {
  try {
    if (!isDev) {
      await startProductionServer();
    } else {
      console.log('Waiting for development server...');
      await waitForDevServer();
      console.log('Development server is ready');
    }
    createWindow();
  } catch (error) {
    console.error('Failed to start application:', error);
    app.quit();
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Handle any unexpected errors
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
});