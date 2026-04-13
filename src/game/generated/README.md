# Generated game files

This folder is reserved for pipeline-generated source such as:

- `game-plan.ts`
- `asset-manifest.ts`
- gameplay components or systems created by the builder

## GLB rule for native Expo

Generated `.glb` files must follow one path only:

1. Register the generated model in `asset-manifest.ts` with Convex storage metadata
2. Reference that entry by id from gameplay code
3. Load it through `loadGeneratedGlb()`

Do not:

- pass raw `.glb` string paths into loaders
- use Metro `/assets/?unstable_path=...` URLs directly
- call `Asset.fromModule(...).downloadAsync()` from gameplay files
- perform ad-hoc `fetch()` / file-system download logic outside `loadGeneratedGlb.ts`
- use `useGLTF` for generated native models

Why: on iOS/Android with Expo Go, generated models should come from a normal HTTPS endpoint, be cached to a local file, and only then be passed to `GLTFLoader`.
