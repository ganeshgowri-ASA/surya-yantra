// Surya Yantra — /api/ws upgrade route
//
// Next.js App Router does not natively own the HTTP server socket, so the
// Socket.IO handshake is served from the custom Node server (see
// `server.ts` — invoked via `node server.js` in production and
// `pnpm dev`). This route exists for two reasons:
//
//   1. To document the `/api/ws` endpoint inside the App Router.
//   2. To attach a Socket.IO server lazily when the route is hit on an
//      environment that exposes the underlying HTTP server (e.g. the custom
//      Node server populates `globalThis.__surya_http_server__`). On serverless
//      Vercel deployments this returns a 501 with guidance — long-lived
//      WebSockets require a stateful runtime.
//
// Clients connect with `io('/', { path: '/api/ws' })`.

import { NextResponse } from 'next/server';
import type { Server as HTTPServer } from 'node:http';
import { getIVSocketServer } from '../../../lib/websocket-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

declare global {
  // Set by the custom Node server on boot.
  // eslint-disable-next-line no-var
  var __surya_http_server__: HTTPServer | undefined;
  // eslint-disable-next-line no-var
  var __surya_io_attached__: boolean | undefined;
}

function ensureAttached(): { attached: boolean; reason?: string } {
  if (globalThis.__surya_io_attached__) return { attached: true };
  const httpServer = globalThis.__surya_http_server__;
  if (!httpServer) {
    return {
      attached: false,
      reason:
        'No HTTP server handle available. Run the custom Node server (`pnpm start`) ' +
        'or deploy to an environment that supports long-lived WebSockets.',
    };
  }
  getIVSocketServer(httpServer);
  globalThis.__surya_io_attached__ = true;
  return { attached: true };
}

export async function GET(): Promise<NextResponse> {
  const { attached, reason } = ensureAttached();
  if (!attached) {
    return NextResponse.json(
      {
        ok: false,
        endpoint: '/api/ws',
        transport: 'socket.io',
        reason,
      },
      { status: 501 },
    );
  }
  return NextResponse.json({
    ok: true,
    endpoint: '/api/ws',
    transport: 'socket.io',
    events: {
      serverToClient: ['iv:meta', 'iv:point', 'iv:batch', 'iv:end', 'iv:error'],
      clientToServer: ['iv:subscribe', 'iv:unsubscribe', 'iv:pause', 'iv:resume'],
    },
  });
}

export async function POST(): Promise<NextResponse> {
  return NextResponse.json(
    { ok: false, error: 'Use the Socket.IO handshake on GET /api/ws' },
    { status: 405 },
  );
}
