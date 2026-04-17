import { BrowserWindow, ipcMain } from 'electron';
import log from 'electron-log';
import { randomUUID } from 'node:crypto';
import { SerialPort } from 'serialport';

type PortHandle = {
  id: string;
  port: SerialPort;
  buffer: string;
};

const DEFAULT_BAUD_RATE = 9600;
const DEFAULT_QUERY_TIMEOUT_MS = 2000;
const SCPI_TERMINATOR = '\n';

const openPorts = new Map<string, PortHandle>();

function broadcast(channel: string, ...args: unknown[]): void {
  for (const win of BrowserWindow.getAllWindows()) {
    win.webContents.send(channel, ...args);
  }
}

export function registerSerialPortHandlers(): void {
  ipcMain.handle('serial:list', async () => {
    const ports = await SerialPort.list();
    return ports.map((p) => ({
      path: p.path,
      manufacturer: p.manufacturer,
      serialNumber: p.serialNumber,
      pnpId: p.pnpId,
      vendorId: p.vendorId,
      productId: p.productId,
    }));
  });

  ipcMain.handle(
    'serial:open',
    async (
      _e,
      opts: {
        path: string;
        baudRate?: number;
        dataBits?: 5 | 6 | 7 | 8;
        stopBits?: 1 | 1.5 | 2;
        parity?: 'none' | 'even' | 'odd' | 'mark' | 'space';
      },
    ) => {
      const id = randomUUID();
      const port = new SerialPort({
        path: opts.path,
        baudRate: opts.baudRate ?? DEFAULT_BAUD_RATE,
        dataBits: opts.dataBits ?? 8,
        stopBits: opts.stopBits ?? 1,
        parity: opts.parity ?? 'none',
        autoOpen: false,
      });

      await new Promise<void>((resolve, reject) => {
        port.open((err) => (err ? reject(err) : resolve()));
      });

      const handle: PortHandle = { id, port, buffer: '' };
      openPorts.set(id, handle);

      port.on('data', (chunk: Buffer) => {
        const text = chunk.toString('utf8');
        handle.buffer += text;
        broadcast('serial:data', id, text);
      });

      port.on('error', (err) => log.error(`serial[${id}] error`, err));
      port.on('close', () => {
        openPorts.delete(id);
        broadcast('serial:closed', id);
      });

      return { id };
    },
  );

  ipcMain.handle('serial:close', async (_e, id: string) => {
    const handle = openPorts.get(id);
    if (!handle) return;
    await new Promise<void>((resolve, reject) => {
      handle.port.close((err) => (err ? reject(err) : resolve()));
    });
  });

  ipcMain.handle('serial:write', async (_e, id: string, data: string) => {
    const handle = openPorts.get(id);
    if (!handle) throw new Error(`Port ${id} not open`);
    const payload = data.endsWith(SCPI_TERMINATOR) ? data : data + SCPI_TERMINATOR;
    await new Promise<void>((resolve, reject) => {
      handle.port.write(payload, (err) => (err ? reject(err) : resolve()));
    });
  });

  ipcMain.handle(
    'serial:query',
    async (_e, id: string, scpi: string, timeoutMs?: number) => {
      const handle = openPorts.get(id);
      if (!handle) throw new Error(`Port ${id} not open`);

      handle.buffer = '';
      const payload = scpi.endsWith(SCPI_TERMINATOR) ? scpi : scpi + SCPI_TERMINATOR;

      return new Promise<string>((resolve, reject) => {
        const limit = timeoutMs ?? DEFAULT_QUERY_TIMEOUT_MS;
        const timer = setTimeout(() => {
          handle.port.removeListener('data', onData);
          reject(new Error(`SCPI query timeout after ${limit}ms: ${scpi.trim()}`));
        }, limit);

        const onData = (): void => {
          const idx = handle.buffer.indexOf(SCPI_TERMINATOR);
          if (idx >= 0) {
            const response = handle.buffer.slice(0, idx).trim();
            handle.buffer = handle.buffer.slice(idx + 1);
            clearTimeout(timer);
            handle.port.removeListener('data', onData);
            resolve(response);
          }
        };

        handle.port.on('data', onData);
        handle.port.write(payload, (err) => {
          if (err) {
            clearTimeout(timer);
            handle.port.removeListener('data', onData);
            reject(err);
          }
        });
      });
    },
  );
}
