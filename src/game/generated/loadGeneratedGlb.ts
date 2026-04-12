import type { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import { loadGltfFromBundledModule } from '@/game/assets/loadGltf';

import { getGeneratedAssetModule } from './asset-manifest';

/**
 * Native-safe generated model loader.
 * Generated gameplay code should call this helper instead of loading raw paths,
 * Metro asset URLs, or `useGLTF` directly.
 */
export async function loadGeneratedGlb(loader: GLTFLoader, assetId: string) {
  return loadGltfFromBundledModule(loader, getGeneratedAssetModule(assetId));
}
