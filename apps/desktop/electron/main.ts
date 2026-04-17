import { app, BrowserWindow, shell, ipcMain, Menu } from 'electron';
import log from 'electron-log';
import { autoUpdater } from 'electron-updater';
import path from 'node:path';
import { registerSerialPortHandlers } from './ipc/serialport';
import { registerAppHandlers } from './ipc/app';

const isDev = !app.isPackaged;
const DEV_URL = process.env.ELECTRON_START_URL ?? 'http://localhost:3000';

log.transports.file.level = 'info';
autoUpdater.logger = log;

let mainWindow: BrowserWindow | null = null;

function createMainWindow(): BrowserWindow {
  const window = new BrowserWindow({
    width: 1600,
    height: 1000,
    minWidth: 1280,
    minHeight: 800,
    show: false,
    backgroundColor: '#0b0f17',
    title: 'Surya Yantra — PV IV Curve Tracer',
    icon: path.join(__dirname, '..', '..', 'resources', 'icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      webSecurity: true,
      spellcheck: false,
    },
  });

  window.once('ready-to-show', () => window.show());

  window.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  if (isDev) {
    window.loadURL(DEV_URL);
    window.webContents.openDevTools({ mode: 'detach' });
  } else {
    const indexHtml = path.join(__dirname, '..', 'web', 'index.html');
    window.loadFile(indexHtml).catch((err) => {
      log.error('Failed to load packaged web build', err);
    });
  }

  window.on('closed', () => {
    mainWindow = null;
  });

  return window;
}

function setApplicationMenu(): void {
  const isMac = process.platform === 'darwin';
  const template: Electron.MenuItemConstructorOptions[] = [
    ...(isMac
      ? [
          {
            label: app.name,
            submenu: [
              { role: 'about' as const },
              { type: 'separator' as const },
              { role: 'quit' as const },
            ],
          },
        ]
      : []),
    {
      label: 'File',
      submenu: [isMac ? { role: 'close' } : { role: 'quit' }],
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
      ],
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'Check for Updates',
          click: () => autoUpdater.checkForUpdatesAndNotify(),
        },
        {
          label: 'View Logs',
          click: () => shell.openPath(log.transports.file.getFile().path),
        },
      ],
    },
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

function setupAutoUpdater(): void {
  if (isDev) return;

  autoUpdater.autoDownload = true;
  autoUpdater.autoInstallOnAppQuit = true;

  autoUpdater.on('update-available', (info) => {
    log.info('Update available', info.version);
    mainWindow?.webContents.send('updater:update-available', info);
  });

  autoUpdater.on('update-downloaded', (info) => {
    log.info('Update downloaded', info.version);
    mainWindow?.webContents.send('updater:update-downloaded', info);
  });

  autoUpdater.on('error', (err) => {
    log.error('Auto-updater error', err);
  });

  autoUpdater.checkForUpdatesAndNotify().catch((err) => {
    log.warn('Initial update check failed', err);
  });
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    mainWindow = createMainWindow();
  }
});

app.whenReady().then(() => {
  registerAppHandlers();
  registerSerialPortHandlers();
  setApplicationMenu();
  mainWindow = createMainWindow();
  setupAutoUpdater();
});

ipcMain.handle('updater:quit-and-install', () => {
  autoUpdater.quitAndInstall();
});
