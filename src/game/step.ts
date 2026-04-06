import type { InputSnapshot } from '@/game/input';
import type { GameState } from '@/game/state';

const ACTION_PULSE_DECAY_PER_SECOND = 2.8;
const COLLECTION_RADIUS = 1.1;
const MOVE_SPEED = 3.1;
const PLAY_AREA_LIMIT = 4.6;

/** Pure simulation tick: advance `state` by `dt` seconds using `input`. */
export function step(state: GameState, dt: number, input: InputSnapshot) {
  state.worldTime += dt;
  state.actionPulse = Math.max(0, state.actionPulse - dt * ACTION_PULSE_DECAY_PER_SECOND);

  const moveLength = Math.hypot(input.move.x, input.move.y);
  if (moveLength > 0.001) {
    const normalizedX = input.move.x / moveLength;
    const normalizedY = -input.move.y / moveLength;
    const scalar = Math.min(moveLength, 1) * MOVE_SPEED * dt;

    state.player.position.x = Math.max(-PLAY_AREA_LIMIT, Math.min(PLAY_AREA_LIMIT, state.player.position.x + normalizedX * scalar));
    state.player.position.y = Math.max(-PLAY_AREA_LIMIT, Math.min(PLAY_AREA_LIMIT, state.player.position.y + normalizedY * scalar));
    state.player.heading = Math.atan2(normalizedX, normalizedY);
  }

  if (!input.actionPressed) {
    return;
  }

  state.actionPulse = 1;

  for (const beacon of state.beacons) {
    if (beacon.collected) {
      continue;
    }

    const distance = Math.hypot(
      beacon.position.x - state.player.position.x,
      beacon.position.y - state.player.position.y,
    );
    if (distance <= COLLECTION_RADIUS) {
      beacon.collected = true;
    }
  }
}
