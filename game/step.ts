import type { InputSnapshot } from '@/game/input';
import type { GameState } from '@/game/state';

/** Pure simulation tick: advance `state` by `dt` seconds using `input`. */
export function step(state: GameState, dt: number, input: InputSnapshot) {
  void input;
  state.worldTime += dt;
  state.box.rotation.x += dt * 0.5;
  state.box.rotation.y += dt * 0.6;
}
