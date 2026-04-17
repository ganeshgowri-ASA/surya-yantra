// MUX relay matrix controller
//
// 75 slots × (Force+, Force−, Sense+, Sense−) = 300 relays.
// Destinations:
//   ELOAD    — module connected to ESL-Solar 500 for IV trace
//   INVERTER — routed to the grid-tied inverter
//   CONVERTER— routed to a DC/DC converter (development)
//   IDLE     — open circuit (isolated)
//
// Safety invariants:
//   - At most one slot may be assigned to ELOAD at a given instant.
//   - Multiple slots to INVERTER are permitted (parallel strings).

import 'server-only';
import { prisma } from './prisma';
import type { MuxDestination } from '@prisma/client';

export interface MuxAssignmentRequest {
  testBedId: string;
  slotNumber: number;
  destination: MuxDestination;
  forceOn?: boolean;
  senseOn?: boolean;
}

export async function assignSlot(req: MuxAssignmentRequest) {
  const { testBedId, slotNumber, destination } = req;
  if (slotNumber < 1 || slotNumber > 75) {
    throw new Error(`Invalid slotNumber ${slotNumber}; must be 1..75`);
  }

  if (destination === 'ELOAD') {
    // Release any existing E-Load assignment first (safety)
    await prisma.muxSlotState.updateMany({
      where: { testBedId, destination: 'ELOAD', NOT: { slotNumber } },
      data: { destination: 'IDLE', forceOn: false, senseOn: false },
    });
  }

  return prisma.muxSlotState.upsert({
    where: { testBedId_slotNumber: { testBedId, slotNumber } },
    update: {
      destination,
      forceOn: req.forceOn ?? destination !== 'IDLE',
      senseOn: req.senseOn ?? destination === 'ELOAD',
    },
    create: {
      testBedId,
      slotNumber,
      destination,
      forceOn: req.forceOn ?? destination !== 'IDLE',
      senseOn: req.senseOn ?? destination === 'ELOAD',
    },
  });
}

export async function getAllMuxStates(testBedId: string) {
  return prisma.muxSlotState.findMany({
    where: { testBedId },
    orderBy: { slotNumber: 'asc' },
  });
}

export async function releaseAll(testBedId: string) {
  return prisma.muxSlotState.updateMany({
    where: { testBedId },
    data: { destination: 'IDLE', forceOn: false, senseOn: false },
  });
}

export function slotToGridPosition(slotNumber: number, rows = 15, cols = 5) {
  const idx = slotNumber - 1;
  return { row: Math.floor(idx / cols), col: idx % cols };
}

export function gridPositionToSlot(row: number, col: number, cols = 5): number {
  return row * cols + col + 1;
}
