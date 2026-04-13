export type GeneratedAssetEntry = {
  downloadUrl: string | null;
  exists: boolean;
  fileName: string;
  kind: 'model' | 'manifest';
  notes: string | null;
  path: string;
  sha256: string | null;
  source: 'harness' | 'tripo';
  storageId: string | null;
};

export type ResolvedGeneratedAssetEntry = GeneratedAssetEntry & {
  downloadUrl: string;
  exists: true;
  kind: 'model';
  sha256: string;
  storageId: string;
};

/**
 * Single source of truth for agent-added GLBs.
 * Generated models are mirrored into Convex storage and downloaded over HTTPS
 * by `src/game/generated/loadGeneratedGlb.ts` before GLTFLoader sees a local
 * file URI.
 */
export const generatedAssets: Record<string, GeneratedAssetEntry> = {
  // Example:
  // ancientSpikeTrap: {
  //   downloadUrl:
  //     'https://<your-convex-site>/generated-assets?storageId=<storage-id>&fileName=ancient_spike_trap.glb&sha256=<sha256>',
  //   exists: true,
  //   fileName: 'ancient_spike_trap.glb',
  //   kind: 'model',
  //   notes: null,
  //   path: 'assets/generated/ancient_spike_trap.glb',
  //   sha256: '<sha256 hex>',
  //   source: 'tripo',
  //   storageId: '<storage-id>',
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
    entry.downloadUrl !== null &&
    entry.sha256 !== null &&
    entry.storageId !== null
  ) {
    return entry as ResolvedGeneratedAssetEntry;
  }

  throw new Error(
    `Missing generated GLB "${assetId}". Add Convex storage metadata to src/game/generated/asset-manifest.ts instead of using a raw path or URL.`
  );
}
