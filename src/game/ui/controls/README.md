# Control templates (A and B)

`ControlTemplate` is the single entry point for AI-generated games. Import from **`@/game/controls`** (facade), not from deep paths under `ui/`.

## IDs

| ID | Layout |
|----|--------|
| **A** | Left virtual joystick + primary action button (right). |
| **B** | Swipe strip + three lane buttons + large primary action. |

## Callbacks (`ControlTemplateProps`)

- `onMove` — primary stick vector, roughly `[-1, 1]` per axis (y up is positive); template **A** only.
- `onPrimaryAction` — `true` while held (templates **A** and **B**).
- `onSwipe` — swipe delta when gesture ends (template **B**).
- `onLane` — lane index `0 | 1 | 2` (template **B**).

## Layering with `expo-gl` / Three

Use **`GameShell`** from **`@/game/ui/GameShell`**: the GL / `GLView` child gets `pointerEvents="none"`; controls render in a sibling overlay with `pointerEvents="box-none"` on the wrapper and interactive children handling touches.

Optional: **`CanvasScene`** (`@/game/ui/CanvasScene`) — bundled harness GLBs on `expo-gl` + Three.js — is not mounted on the root route; import it in a scratch screen if you need a minimal GLB viewer. **`ControlTemplateSwitcher`** (`@/game/ui/ControlTemplateSwitcher`) switches templates **A and B** when you wire it yourself.

**Layout:** All game code for this template lives under **`src/game/`** — simulation modules at the root of that folder, React UI under **`src/game/ui/`**.
