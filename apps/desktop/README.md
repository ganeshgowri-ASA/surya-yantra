# Surya Yantra — Desktop (Electron)

Standalone Electron shell that wraps the Next.js web app and adds direct
hardware access (serial port / SCPI) via IPC.

## Layout

```
apps/desktop/
├── electron/
│   ├── main.ts                # Main process, window, updater wiring
│   ├── preload.ts             # Context-isolated bridge → window.surya
│   └── ipc/
│       ├── app.ts             # App metadata IPC handlers
│       └── serialport.ts      # SerialPort list / open / write / query
├── shared/                    # Symlinks into apps/web for code reuse
├── resources/                 # Icons for installers (icon.ico, icon.png, icon.icns)
├── electron-builder.json      # Windows .exe / NSIS / portable config
├── tsconfig.electron.json     # TS config for the main process bundle
└── package.json
```

## Dev workflow

```bash
# From repo root
pnpm install

# Run Next.js dev server + Electron together
pnpm --filter @surya-yantra/desktop dev

# Or run Electron alone against an already-running Next dev server
pnpm --filter @surya-yantra/desktop dev:electron
```

The shell loads `http://localhost:3000` in development (override via
`ELECTRON_START_URL`). In production builds it loads the packaged Next.js
standalone output from `resources/web`.

## Windows installer

```bash
pnpm --filter @surya-yantra/desktop dist:win
```

Outputs to `release/<version>/`:

- `Surya Yantra-Setup-<ver>-x64.exe` — NSIS installer
- `Surya Yantra-Portable-<ver>-x64.exe` — single-file portable

Set `GH_TOKEN` and run `pnpm publish:win` to publish to GitHub Releases; the
auto-updater in `electron/main.ts` picks up the feed automatically via
`electron-builder.json > publish`.

## Renderer → main IPC

The preload script exposes `window.surya` to the renderer:

```ts
const ports = await window.surya.serial.list();
const { id } = await window.surya.serial.open({ path: ports[0].path, baudRate: 9600 });
const idn = await window.surya.serial.query(id, "*IDN?");
window.surya.serial.onData((portId, chunk) => console.log(portId, chunk));
```

All serial I/O runs in the main process, so the ESL-Solar 500 SCPI driver in
`packages/scpi-client` can target these same IPC channels when running inside
the desktop shell.

## Hardware integration (next steps)

`electron/ipc/serialport.ts` is a thin, generic bridge. Hook up the
`@surya-yantra/scpi-client` package on top of it once that package lands; no
changes to the Electron shell should be necessary.
