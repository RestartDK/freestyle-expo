import type { Vec2 } from '@/game/controls';

export type BeaconState = {
  collected: boolean;
  color: string;
  id: string;
  phase: number;
  position: Vec2;
};

export type GameState = {
  actionPulse: number;
  beacons: BeaconState[];
  player: {
    heading: number;
    position: Vec2;
  };
  worldTime: number;
};

const INITIAL_BEACONS: BeaconState[] = [
  { collected: false, color: '#8b5cf6', id: 'north', phase: 0.1, position: { x: 0, y: -2.8 } },
  { collected: false, color: '#22d3ee', id: 'west', phase: 1.3, position: { x: -3.3, y: 1.5 } },
  { collected: false, color: '#f59e0b', id: 'east', phase: 2.6, position: { x: 3.1, y: 1.9 } },
] as const;

export function createInitialState(): GameState {
  return {
    actionPulse: 0,
    beacons: INITIAL_BEACONS.map((beacon) => ({ ...beacon, position: { ...beacon.position } })),
    player: {
      heading: 0,
      position: { x: 0, y: 3.2 },
    },
    worldTime: 0,
  };
}
