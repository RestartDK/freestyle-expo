export type GeneratedAssetEntry = {
  chunks: readonly string[] | null;
  exists: boolean;
  fileName: string;
  kind: 'model' | 'manifest';
  notes: string | null;
  path: string;
  sha256: string | null;
  source: 'harness' | 'tripo';
};

export type ResolvedGeneratedAssetEntry = GeneratedAssetEntry & {
  chunks: readonly string[];
  exists: true;
  kind: 'model';
  sha256: string;
};

/**
 * Single source of truth for agent-added GLBs.
 * Generated models are embedded in chunked sidecar modules under
 * `src/game/generated/asset-blobs/` and materialized to local files by
 * `src/game/generated/loadGeneratedGlb.ts`.
 */
export const generatedAssets: Record<string, GeneratedAssetEntry> = {
  // Example:
  // import { chunks as ancientSpikeTrapChunks } from './asset-blobs/asset_000_ancient-spike-trap';
  // ancientSpikeTrap: {
  //   chunks: ancientSpikeTrapChunks,
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
    entry.chunks !== null &&
    entry.sha256 !== null
  ) {
    return entry as ResolvedGeneratedAssetEntry;
  }

  throw new Error(
    `Missing generated GLB "${assetId}". Add chunked asset-blobs sidecar modules and register them from src/game/generated/asset-manifest.ts instead of using a raw path or URL.`
  );
}
