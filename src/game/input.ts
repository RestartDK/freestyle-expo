import type { Vec2 } from '@/game/controls';

/**
 * Per-frame input snapshot. Wire this to keyboard, touch, gamepad, etc.
 * The starter shell feeds this from the on-screen control facade.
 */
export type InputSnapshot = {
  actionPressed: boolean;
  move: Vec2;
};

export function getInput(): InputSnapshot {
  return {
    actionPressed: false,
    move: { x: 0, y: 0 },
  };
}
