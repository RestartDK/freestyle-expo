export type GeneratedAssetModuleEntry = {
  module: number;
};

/**
 * Single source of truth for agent-added GLBs.
 * Keep every generated model as a static Metro-discoverable require/import here.
 * Do not construct `.glb` paths dynamically in gameplay code.
 */
export const generatedAssetModules: Record<string, GeneratedAssetModuleEntry> = {
  // Example:
  // ancientSpikeTrap: {
  //   module: require('@/assets/generated/ancient_spike_trap.glb'),
  // },
};

export type GeneratedAssetId = keyof typeof generatedAssetModules & string;

export function getGeneratedAssetModule(assetId: string) {
  const entry = generatedAssetModules[assetId];
  if (entry) {
    return entry.module;
  }

  throw new Error(
    `Missing generated GLB "${assetId}". Add a static require to src/game/generated/asset-manifest.ts instead of using a raw path or URL.`
  );
}
