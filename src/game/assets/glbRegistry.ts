/**
 * Single place for static GLB imports. Metro must see every file at build time — add new
 * `import … from '@/assets/.../*.glb'` lines here, then reference them via `glb.<name>`.
 */
import barrelGlb from '@/assets/harness/barrel.glb';
import blockGrassGlb from '@/assets/harness/block-grass.glb';
import coinGoldGlb from '@/assets/harness/coin-gold.glb';
import flagGlb from '@/assets/harness/flag.glb';

export const glb = {
  barrel: barrelGlb,
  blockGrass: blockGrassGlb,
  coinGold: coinGoldGlb,
  flag: flagGlb,
} as const;

export type GlbKey = keyof typeof glb;

/** Models shown in order by the harness / CanvasScene demo row. */
export const HARNESS_DEMO_KEYS = [
  'barrel',
  'flag',
  'coinGold',
  'blockGrass',
] as const satisfies readonly GlbKey[];
