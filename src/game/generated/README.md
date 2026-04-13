# Generated game files

This folder is reserved for pipeline-generated source such as:

- `game-plan.ts`
- `asset-manifest.ts`
- gameplay components or systems created by the builder

## GLB rule for native Expo

Generated `.glb` files must go through `loadGeneratedGlb()` only. Register each model in `asset-manifest.ts` using **either**:

1. **Chunked sidecars** — base64 chunks under `asset-blobs/` (offline / template-friendly), or
2. **Convex `downloadUrl`** — pipeline VMs fetch bytes, then the same loader writes a cache file and runs `GLTFLoader`.

`loadGeneratedGlb` always normalizes mesh/material names after parse so Tripo-style UUIDs with hyphens cannot break GLSL `SHADER_NAME` defines on native.

Do not:

- pass raw `.glb` string paths into loaders
- use Metro `/assets/?unstable_path=...` URLs directly
- call `Asset.fromModule(...).downloadAsync()` from gameplay files
- use `useGLTF` for generated native models

Why: on iOS/Android, the loader must receive a real local file URI. `loadGeneratedGlb` is the single place that materializes remote or embedded bytes and sanitizes names for WebGL.
