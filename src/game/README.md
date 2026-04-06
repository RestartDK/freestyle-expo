# Game simulation

**Flow:** React Three Fiber runs the render loop. `src/components/game/Scene.tsx` uses `useFrame` once per frame, clamps `delta`, then calls `step` from this folder.

- **`state.ts`** — `GameState` + `createInitialState()`. Extend with player, NPCs, flags, etc.
- **`step.ts`** — `step(state, dt, input)` — all per-frame simulation (movement, physics you add later). Keep Three.js scene wiring in `Scene` or small view components.
- **`input.ts`** — `getInput()` / `InputSnapshot`. Centralize keyboard, touch, and gamepad here so gameplay code stays testable.
- **`constants.ts`** — e.g. `MAX_DELTA_SECONDS` to cap `dt` when a frame stalls.

**UI / controls:** Touch templates and `GameShell` live under **`ui/`**. Import the public facade from **`@/game/controls`**.

**Generated plans:** The build pipeline (`src/game/generated/`) may add `game-plan.ts` and `asset-manifest.ts` — keep imports stable via `@/game/generated/...`.

Do **not** start a second `requestAnimationFrame` or `setInterval` game loop; use `useFrame` (or a single delegate it calls) so there is one clock.
