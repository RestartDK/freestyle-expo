# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with `[create-expo-app](https://www.npmjs.com/package/create-expo-app)`.

## Get started

1. Install dependencies with npm
  ```bash
   npm install
  ```
2. Start the app
  ```bash
   npx expo start
  ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing files under **`src/app/`**. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

### Where routes live vs other code

Expo Router expects your **route tree** in an `app` directory. Per the [Expo Router `src` directory reference](https://docs.expo.dev/router/reference/src-directory/), that can be **`app/`** at the **project root** or **`src/app/`**; **if both exist, `src/app/` wins** and root `app/` is ignored. Non-route code (components, hooks, game logic) should stay **outside** that folder—see [Core concepts](https://docs.expo.dev/router/basics/core-concepts/).

This repo follows the **SDK 55-style layout**: routes in **`src/app/`**, shared UI in **`src/components/`**, **`src/hooks/`**, **`src/constants/`**, and game code in **`src/game/`**. Bundled images referenced from `app.json` stay in root **`assets/`**; the `@/assets/*` alias points there (see `tsconfig.json`).

## Orientation

The game shell is **landscape-only**: `app.json` sets `"orientation": "landscape"`, and the root layout calls `expo-screen-orientation` on native to lock landscape after launch. When you use **web preview** or **Expo Go**, rotate the window or device to **landscape** so thumb zones and layout match how the shell is designed and tested.

## Control templates (A–D)

Generated games should import a single component and pass `controlTemplate` from your planner:

```ts
import { ControlTemplate } from '@/game/controls';
```


| ID    | Role                                               |
| ----- | -------------------------------------------------- |
| **A** | Left virtual joystick + primary action (right).    |
| **B** | Twin sticks: move + aim / look.                    |
| **C** | One stick + tap zone + secondary hold.             |
| **D** | Swipe strip + three lane buttons + primary action. |


Touch handling uses **react-native-gesture-handler** and **react-native-reanimated** only (no mixed gesture stacks). See `src/game/ui/controls/README.md` for callback props and layering notes with `expo-gl` / Three.

Use **`GameShell`** (`@/game/ui/GameShell`) so the GL view sits under a full-screen overlay: the scene uses `pointerEvents="none"`; controls use `pointerEvents="box-none"` so touches hit sticks and buttons without passing through to the canvas.

**`CanvasScene`** (`@/game/ui/CanvasScene`) is an optional **expo-gl** + **Three.js** harness that loads bundled GLBs from **`glbRegistry`** (not mounted on the root route). Use it when you need a minimal r3f scene without the full game. **`ControlTemplateSwitcher`** (`@/game/ui/ControlTemplateSwitcher`) is available if you mount templates **A–D** in your own screen. The **root route** (`src/app/index.tsx`) renders only **`@/game/Game`** — there is no separate dev QA route.

**Game code layout:** The single live game entry is **`src/game/Game.tsx`**. Simulation (`state`, `step`, `input`, …) and the **`@/game/controls`** facade live under **`src/game/`**; React UI (shell, `CanvasScene`, control templates) under **`src/game/ui/`**. Generated plans from external pipelines go under **`src/game/generated/`** (e.g. `game-plan.ts`, `asset-manifest.ts`, `loadGeneratedGlb.ts`).

## GLTF / Expo GL note

On native Expo builds, textured GLBs may log warnings such as `EXGL: gl.pixelStorei() doesn't support this parameter yet!`. That warning usually comes from Three texture upload paths and is often non-fatal, but it is noisy and can hide real asset issues. The default starter game therefore uses simple geometry instead of textured GLBs. Keep GLTF experiments in dedicated game code or the dev harness until you have verified they render correctly on device.

## Generated GLB contract

For agent-generated models, use one loading path only:

1. Add a static Metro-discoverable `require()` entry in **`src/game/generated/asset-manifest.ts`**
2. Reference the asset by id from gameplay code
3. Load it through **`src/game/generated/loadGeneratedGlb.ts`**

Do not load generated models from raw `.glb` strings, Metro `/assets/?unstable_path=...` URLs, or `useGLTF` on native. Expo must resolve bundled assets through `expo-asset` first so the loader receives a local file URI.

### Dependencies (controls & orientation)

- **`expo-screen-orientation`** — runtime landscape lock on iOS/Android (with `app.json` orientation).
- **`react-native-gesture-handler`** / **`react-native-reanimated`** — virtual sticks and knob motion (already in the template).

## How to test

1. **Playable game** — Run `npx expo start` and open the app; the root route is **`Game`**. To try **`CanvasScene`** or **`ControlTemplateSwitcher`**, import them into a temporary route or screen during development (they are not registered by default).
2. **Automated smoke test** — `npm test` runs Jest and mounts template **A** with a `testID` on the joystick.

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **`src/app`** tree where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you will create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
