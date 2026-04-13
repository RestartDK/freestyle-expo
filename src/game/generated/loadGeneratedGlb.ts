import * as FileSystem from 'expo-file-system/legacy';
import type { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import type { Material, Object3D } from 'three';

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

  if (fileInfo.exists) {
    return localUri;
  }

  await FileSystem.makeDirectoryAsync(directory, { intermediates: true });

  const downloadUrl =
    typeof entry.downloadUrl === 'string' && entry.downloadUrl.length > 0
      ? entry.downloadUrl
      : null;

  if (downloadUrl) {
    const downloadResult = await FileSystem.downloadAsync(downloadUrl, localUri);
    if (downloadResult.status !== 200) {
      await FileSystem.deleteAsync(localUri, { idempotent: true });
      throw new Error(
        `Failed to download generated GLB "${assetId}" (${downloadResult.status}).`
      );
    }
    return localUri;
  }

  const chunks = entry.chunks;
  if (!chunks || chunks.length === 0) {
    throw new Error(`Generated GLB "${assetId}" has no chunks and no downloadUrl.`);
  }

  await FileSystem.writeAsStringAsync(localUri, chunks.join(''), {
    encoding: FileSystem.EncodingType.Base64,
  });

  return localUri;
};

const INVALID_SHADER_IDENTIFIER = /[^A-Za-z0-9_]+/g;
const TRIM_EDGE_UNDERSCORES = /^_+|_+$/g;
const VALID_SHADER_IDENTIFIER_START = /^[A-Za-z_]/;

const sanitizeShaderIdentifier = (name: string, fallback: string) => {
  const normalized = name
    .trim()
    .replace(INVALID_SHADER_IDENTIFIER, '_')
    .replace(TRIM_EDGE_UNDERSCORES, '');

  if (!normalized) {
    return fallback;
  }

  return VALID_SHADER_IDENTIFIER_START.test(normalized)
    ? normalized
    : `${fallback}_${normalized}`;
};

const sanitizeMaterialName = (material: Material, seenMaterials: WeakSet<Material>) => {
  if (seenMaterials.has(material)) {
    return;
  }

  seenMaterials.add(material);
  material.name = sanitizeShaderIdentifier(material.name, 'generated_material');
};

const sanitizeGeneratedGlb = (
  gltf: Awaited<ReturnType<GLTFLoader['loadAsync']>>
) => {
  const seenMaterials = new WeakSet<Material>();

  gltf.scene.traverse((object) => {
    const sceneObject = object as Object3D & {
      material?: Material | Material[];
    };

    sceneObject.name = sanitizeShaderIdentifier(sceneObject.name, 'generated_node');

    if (Array.isArray(sceneObject.material)) {
      for (const material of sceneObject.material) {
        sanitizeMaterialName(material, seenMaterials);
      }
      return;
    }

    if (sceneObject.material) {
      sanitizeMaterialName(sceneObject.material, seenMaterials);
    }
  });

  return gltf;
};

export async function loadGeneratedGlb(loader: GLTFLoader, assetId: string) {
  // GLTF exporters can emit names that are invalid in generated GLSL defines.
  return sanitizeGeneratedGlb(await loader.loadAsync(await materializeGeneratedGlb(assetId)));
}
