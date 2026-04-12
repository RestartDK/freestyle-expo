export type GeneratedAssetEntry = {
  base64: string | null;
  exists: boolean;
  fileName: string;
  kind: 'model' | 'manifest';
  notes: string | null;
  path: string;
  sha256: string | null;
  source: 'harness' | 'tripo';
};

export type ResolvedGeneratedAssetEntry = GeneratedAssetEntry & {
  base64: string;
  exists: true;
  kind: 'model';
  sha256: string;
};

/**
 * Single source of truth for agent-added GLBs.
 * Generated models are embedded as base64 and materialized to local files by
 * `src/game/generated/loadGeneratedGlb.ts`. Do not construct `.glb` paths or
 * remote URLs dynamically in gameplay code.
 */
export const generatedAssets: Record<string, GeneratedAssetEntry> = {
  // Example:
  // ancientSpikeTrap: {
  //   base64: '<base64 glb bytes>',
  //   exists: true,
  //   fileName: 'ancient_spike_trap.glb',
  //   kind: 'model',
  //   notes: null,
  //   path: 'assets/generated/ancient_spike_trap.glb',
  //   sha256: '<sha256 hex>',
  //   source: 'tripo',
  // },
};

export type GeneratedAssetId = keyof typeof generatedAssets & string;

export function getGeneratedAssetEntry(
  assetId: string
): ResolvedGeneratedAssetEntry {
  const entry = generatedAssets[assetId];
  if (
    entry &&
    entry.exists &&
    entry.kind === 'model' &&
    entry.base64 !== null &&
    entry.sha256 !== null
  ) {
    return entry as ResolvedGeneratedAssetEntry;
  }

  throw new Error(
    `Missing generated GLB "${assetId}". Add embedded base64 data to src/game/generated/asset-manifest.ts instead of using a raw path or URL.`
  );
}
