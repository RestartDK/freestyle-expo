import { Asset } from 'expo-asset';
import type { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

/**
 * Loads a GLB that was bundled by Metro via `import x from '.../*.glb'` (module id = number).
 * Use only with values from `glbRegistry` — do not pass string paths.
 */
export async function loadGltfFromBundledModule(
  loader: GLTFLoader,
  assetModuleId: number
): Promise<Awaited<ReturnType<GLTFLoader['loadAsync']>>> {
  const asset = Asset.fromModule(assetModuleId);
  await asset.downloadAsync();
  const uri = asset.localUri ?? asset.uri;
  if (!uri) {
    throw new Error('Bundled GLB has no local URI after downloadAsync().');
  }

  return loader.loadAsync(uri);
}
