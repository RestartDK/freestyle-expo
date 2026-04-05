/**
 * Metro resolves `TestScene.native.tsx` / `TestScene.web.tsx` at bundle time; this re-export exists so
 * `import { TestScene } from '@/game-ui/TestScene'` type-checks under `tsc` (no platform extensions).
 */
export { TestScene } from './TestScene.web';
