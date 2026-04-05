/**
 * Per-frame input snapshot. Wire this to keyboard, touch, gamepad, etc.
 * The scaffold returns an empty snapshot so `step` has a stable API.
 */
export type InputSnapshot = Record<string, never>;

export function getInput(): InputSnapshot {
  return {};
}
