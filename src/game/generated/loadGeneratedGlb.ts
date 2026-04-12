import * as FileSystem from 'expo-file-system/legacy';
import type { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import { getGeneratedAssetEntry } from './asset-manifest';

/**
 * Native-safe generated model loader.
 * Generated gameplay code should call this helper instead of loading raw paths,
 * Metro asset URLs, or writing files directly in gameplay code.
 */
const getGeneratedAssetDirectory = () => {
  const baseDirectory = FileSystem.cacheDirectory ?? FileSystem.documentDirectory;
  if (!baseDirectory) {
    throw new Error('Expo file system directory is unavailable.');
  }

  return `${baseDirectory}generated-glb/`;
};

const materializeGeneratedGlb = async (assetId: string) => {
  const entry = getGeneratedAssetEntry(assetId);
  const directory = getGeneratedAssetDirectory();
  const localUri = `${directory}${assetId}-${entry.sha256.slice(0, 12)}-${entry.fileName}`;
  const fileInfo = await FileSystem.getInfoAsync(localUri);

  if (!fileInfo.exists) {
    await FileSystem.makeDirectoryAsync(directory, { intermediates: true });
    await FileSystem.writeAsStringAsync(localUri, entry.chunks.join(''), {
      encoding: FileSystem.EncodingType.Base64,
    });
  }

  return localUri;
};

export async function loadGeneratedGlb(loader: GLTFLoader, assetId: string) {
  return loader.loadAsync(await materializeGeneratedGlb(assetId));
}
