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

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

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

**`TestScene`** (`@/game/ui/TestScene`) renders a minimal **Three.js** scene on **`expo-gl`** as a default “base object” for manual QA. **`ControlTemplateSwitcher`** (`@/game/ui/ControlTemplateSwitcher`) switches templates **A–D**. The **root route** (`app/index.tsx`) shows the main **`GameScreen`** (R3F) and, in **`__DEV__`**, a **Control QA** link to **`/dev-controls`**; the **full control-template demo** (TestScene + switcher + Metro logging) lives on **`/dev-controls`** (`app/dev-controls.tsx`, `__DEV__` only).

**Game code layout:** Simulation (`state`, `step`, `input`, …) and the **`@/game/controls`** facade live under **`src/game/`**; React UI (shell, test scene, control templates) under **`src/game/ui/`**. Generated plans from external pipelines go under **`src/game/generated/`** (e.g. `game-plan.ts`, `asset-manifest.ts`).

### Dependencies (controls & orientation)

- **`expo-screen-orientation`** — runtime landscape lock on iOS/Android (with `app.json` orientation).
- **`react-native-gesture-handler`** / **`react-native-reanimated`** — virtual sticks and knob motion (already in the template).

## How to test

1. **Dev QA screen (manual)** — Run `npx expo start`. In **development** builds, the home screen has a **Control QA** link that navigates to **`/dev-controls`** (you can also open that URL directly). Pick **A–D** and watch Metro logs: stub handlers `console.log` move, actions, swipe, and lane taps.
2. **Automated smoke test** — `npm test` runs Jest and mounts template **A** with a `testID` on the joystick.

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you will create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

