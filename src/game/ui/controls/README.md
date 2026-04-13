# Control template

`ControlTemplate` is the single entry point for AI-generated games. Import from **`@/game/controls`** (facade), not from deep paths under `ui/`.

## ID

| ID | Layout |
|----|--------|
| **A** | Left virtual joystick + primary action button (right). |

## Callbacks (`ControlTemplateProps`)

- `onMove` — primary stick vector, roughly `[-1, 1]` per axis (y up is positive).
- `onPrimaryAction` — `true` while held.

## Layering with `expo-gl` / Three

Use **`GameShell`** from **`@/game/ui/GameShell`**: the GL / `GLView` child gets `pointerEvents="none"`; controls render in a sibling overlay with `pointerEvents="box-none"` on the wrapper and interactive children handling touches.

Optional: **`CanvasScene`** (`@/game/ui/CanvasScene`) — bundled harness GLBs on `expo-gl` + Three.js — is not mounted on the root route; import it in a scratch screen if you need a minimal GLB viewer.

**Layout:** All game code for this template lives under **`src/game/`** — simulation modules at the root of that folder, React UI under **`src/game/ui/`**.
