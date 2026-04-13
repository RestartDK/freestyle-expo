# Game simulation

**Flow:** `src/game/Game.tsx` is the single live game entry. React Three Fiber runs the render loop there, clamps `delta`, then calls `step` from this folder.

- **`state.ts`** — `GameState` + `createInitialState()`. Extend with player, NPCs, flags, etc.
- **`step.ts`** — `step(state, dt, input)` — all per-frame simulation (movement, collection, physics you add later). Keep Three.js scene wiring in `Game.tsx` or small scene components.
- **`input.ts`** — `getInput()` / `InputSnapshot`. Keep a stable shape for keyboard, touch, and gamepad so gameplay code stays testable.
- **`constants.ts`** — e.g. `MAX_DELTA_SECONDS` to cap `dt` when a frame stalls.

**UI / controls:** Touch templates and `GameShell` live under **`ui/`**. Import the public facade from **`@/game/controls`**.

**Generated plans:** The build pipeline (`src/game/generated/`) may add `game-plan.ts`, `asset-manifest.ts`, and helper-driven gameplay code — keep imports stable via `@/game/generated/...`.

**Generated GLBs:** Register models in `src/game/generated/asset-manifest.ts` (chunked sidecars and/or a Convex `downloadUrl`), then load through `src/game/generated/loadGeneratedGlb.ts`. Do not pass raw `.glb` strings, Metro asset URLs, or `useGLTF` into gameplay code on native.

**Template default:** The starter home route uses simple geometry only, so the default project stays mobile-safe and avoids native GLTF texture quirks. Keep textured GLB experiments behind dedicated game logic or dev harnesses.

Do **not** start a second `requestAnimationFrame` or `setInterval` game loop; use `useFrame` (or a single delegate it calls) so there is one clock.
