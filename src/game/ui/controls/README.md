# Control templates (A–D)

`ControlTemplate` is the single entry point for AI-generated games. Import from **`@/game/controls`** (facade), not from deep paths under `ui/`.

## IDs

| ID | Layout |
|----|--------|
| **A** | Left virtual joystick + primary action button (right). |
| **B** | Twin sticks: move (left) + aim / look (right). |
| **C** | One stick + tap zone + secondary hold button. |
| **D** | Swipe strip + three lane buttons + large primary action. |

## Callbacks (`ControlTemplateProps`)

- `onMove` — primary stick vector, roughly `[-1, 1]` per axis (y up is positive).
- `onMoveSecondary` — second stick (template **B**).
- `onPrimaryAction` / `onSecondaryAction` — `true` while held.
- `onTap` — discrete tap (template **C**).
- `onSwipe` — swipe delta when gesture ends (template **D**).
- `onLane` — lane index `0 | 1 | 2` (template **D**).

## Layering with `expo-gl` / Three

Use **`GameShell`** from **`@/game/ui/GameShell`**: the GL / `GLView` child gets `pointerEvents="none"`; controls render in a sibling overlay with `pointerEvents="box-none"` on the wrapper and interactive children handling touches.

Optional: **`CanvasScene`** (`@/game/ui/CanvasScene`) — bundled harness GLBs on `expo-gl` + Three.js — is not mounted on the root route; import it in a scratch screen if you need a minimal GLB viewer. **`ControlTemplateSwitcher`** (`@/game/ui/ControlTemplateSwitcher`) switches templates **A–D** when you wire it yourself.

**Layout:** All game code for this template lives under **`src/game/`** — simulation modules at the root of that folder, React UI under **`src/game/ui/`**.
