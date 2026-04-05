# Control templates (A–D)

`ControlTemplate` is the single entry point for AI-generated games. Import from `@/game-ui/controls`.

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

Use `GameShell` from `@/game-ui/GameShell`: the GL / `GLView` child gets `pointerEvents="none"`; controls render in a sibling overlay with `pointerEvents="box-none"` on the wrapper and interactive children handling touches.

The repo includes **`TestScene`** (`@/game-ui/TestScene`) — a rotating cube on `expo-gl` + Three.js — and wires it on the **dev-only** route **`/dev-controls`** with **`ControlTemplateSwitcher`** (`@/game-ui/ControlTemplateSwitcher`) for **A–D**. The **app root** runs the main R3F `GameScreen`; use **`/dev-controls`** for manual control QA.

**Path note:** `@/game/*` is reserved for the **simulation** modules in the repo root `game/` folder (`constants`, `input`, `state`, `step`). Touch UI lives under **`@/game-ui/*`**.
