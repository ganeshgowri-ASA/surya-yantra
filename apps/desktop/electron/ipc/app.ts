import { app, ipcMain, shell } from 'electron';
import log from 'electron-log';

export function registerAppHandlers(): void {
  ipcMain.handle('app:get-version', () => app.getVersion());
  ipcMain.handle('app:open-external', (_e, url: string) => shell.openExternal(url));
  ipcMain.handle('app:get-logs-path', () => log.transports.file.getFile().path);
}
