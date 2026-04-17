import { contextBridge, ipcRenderer } from 'electron';

type SerialPortInfo = {
  path: string;
  manufacturer?: string;
  serialNumber?: string;
  pnpId?: string;
  vendorId?: string;
  productId?: string;
};

type OpenPortOptions = {
  path: string;
  baudRate?: number;
  dataBits?: 5 | 6 | 7 | 8;
  stopBits?: 1 | 1.5 | 2;
  parity?: 'none' | 'even' | 'odd' | 'mark' | 'space';
};

const suryaBridge = {
  platform: process.platform,
  versions: {
    electron: process.versions.electron,
    chrome: process.versions.chrome,
    node: process.versions.node,
  },

  app: {
    getVersion: (): Promise<string> => ipcRenderer.invoke('app:get-version'),
    openExternal: (url: string): Promise<void> =>
      ipcRenderer.invoke('app:open-external', url),
    getLogsPath: (): Promise<string> => ipcRenderer.invoke('app:get-logs-path'),
  },

  serial: {
    list: (): Promise<SerialPortInfo[]> => ipcRenderer.invoke('serial:list'),
    open: (opts: OpenPortOptions): Promise<{ id: string }> =>
      ipcRenderer.invoke('serial:open', opts),
    close: (id: string): Promise<void> => ipcRenderer.invoke('serial:close', id),
    write: (id: string, data: string): Promise<void> =>
      ipcRenderer.invoke('serial:write', id, data),
    query: (id: string, scpi: string, timeoutMs?: number): Promise<string> =>
      ipcRenderer.invoke('serial:query', id, scpi, timeoutMs),
    onData: (handler: (id: string, chunk: string) => void): (() => void) => {
      const listener = (
        _e: Electron.IpcRendererEvent,
        id: string,
        chunk: string,
      ): void => handler(id, chunk);
      ipcRenderer.on('serial:data', listener);
      return () => ipcRenderer.removeListener('serial:data', listener);
    },
  },

  updater: {
    quitAndInstall: (): Promise<void> =>
      ipcRenderer.invoke('updater:quit-and-install'),
    onUpdateAvailable: (handler: (info: unknown) => void): (() => void) => {
      const listener = (_e: Electron.IpcRendererEvent, info: unknown): void =>
        handler(info);
      ipcRenderer.on('updater:update-available', listener);
      return () =>
        ipcRenderer.removeListener('updater:update-available', listener);
    },
    onUpdateDownloaded: (handler: (info: unknown) => void): (() => void) => {
      const listener = (_e: Electron.IpcRendererEvent, info: unknown): void =>
        handler(info);
      ipcRenderer.on('updater:update-downloaded', listener);
      return () =>
        ipcRenderer.removeListener('updater:update-downloaded', listener);
    },
  },
};

contextBridge.exposeInMainWorld('surya', suryaBridge);

export type SuryaBridge = typeof suryaBridge;
