export type GeneratedAssetEntry = {
  chunks: readonly string[] | null;
  /**
   * When set (typical Convex / preview VMs), the loader downloads bytes with
   * `FileSystem.downloadAsync`. Chunked base64 sidecars are used when this is absent.
   */
  downloadUrl?: string | null;
  exists: boolean;
  fileName: string;
  kind: 'model' | 'manifest';
  notes: string | null;
  path: string;
  sha256: string | null;
  source: 'harness' | 'tripo';
};

export type ResolvedGeneratedAssetEntry = GeneratedAssetEntry & {
  exists: true;
  kind: 'model';
  sha256: string;
};

/**
 * Single source of truth for agent-added GLBs.
 * Models are either embedded as chunked base64 sidecars under
 * `src/game/generated/asset-blobs/` or registered with a Convex `downloadUrl`.
 * `loadGeneratedGlb.ts` materializes either shape to a local file before loading.
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
  const hasChunks = Boolean(entry?.chunks && entry.chunks.length > 0);
  const hasDownloadUrl =
    typeof entry?.downloadUrl === 'string' && entry.downloadUrl.length > 0;

  if (
    entry &&
    entry.exists &&
    entry.kind === 'model' &&
    entry.sha256 !== null &&
    (hasChunks || hasDownloadUrl)
  ) {
    return entry as ResolvedGeneratedAssetEntry;
  }

  throw new Error(
    `Missing generated GLB "${assetId}". Register it in src/game/generated/asset-manifest.ts with either chunked asset-blobs (chunks) or a Convex downloadUrl, plus sha256 and fileName.`
  );
}
