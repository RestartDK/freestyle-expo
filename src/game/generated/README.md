# Generated game files

This folder is reserved for pipeline-generated source such as:

- `game-plan.ts`
- `asset-manifest.ts`
- gameplay components or systems created by the builder

## GLB rule for native Expo

Generated `.glb` files must follow one path only:

1. Add a static Metro-discoverable `require()` in `asset-manifest.ts`
2. Reference that entry by id from gameplay code
3. Load it through `loadGeneratedGlb()`

Do not:

- pass raw `.glb` string paths into loaders
- use Metro `/assets/?unstable_path=...` URLs directly
- call `Asset.fromModule(...).downloadAsync()` from gameplay files
- use `useGLTF` for generated native models

Why: on iOS/Android, Expo assets must be resolved through `expo-asset` first so the loader receives a local file URI instead of a fragile dev-server URL.
