import * as FileSystem from 'expo-file-system/legacy';
import type { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import { getGeneratedAssetEntry } from '@/game/generated/asset-manifest';
import { loadGeneratedGlb } from '@/game/generated/loadGeneratedGlb';

jest.mock('expo-file-system/legacy', () => ({
  cacheDirectory: 'file:///cache/',
  documentDirectory: 'file:///documents/',
  getInfoAsync: jest.fn(),
  makeDirectoryAsync: jest.fn(),
  writeAsStringAsync: jest.fn(),
  downloadAsync: jest.fn(),
  deleteAsync: jest.fn(),
  EncodingType: { Base64: 'base64' },
}));

jest.mock('@/game/generated/asset-manifest', () => ({
  getGeneratedAssetEntry: jest.fn(),
}));

describe('loadGeneratedGlb', () => {
  it('sanitizes generated scene and material names before returning the GLTF', async () => {
    jest.mocked(FileSystem.getInfoAsync).mockResolvedValue({ exists: true } as never);
    jest.mocked(getGeneratedAssetEntry).mockReturnValue({
      chunks: ['Z2xi'],
      exists: true,
      fileName: 'labyrinth_runner_hero.glb',
      kind: 'model',
      notes: null,
      path: 'assets/generated/labyrinth_runner_hero.glb',
      sha256: '06067acef4477ff33c8600a0578ae3b24754928eb259fb1cf2606036b8c0a5e9',
      source: 'tripo',
    });

    const sharedMaterial = { name: 'tripo_material_92075c47-daf3-4eb1-aec2-e7e3531bc26f' };
    const fallbackMaterial = { name: '123 bad material' };
    const traversedObjects = [
      { name: 'scene root' },
      { name: 'tripo_mesh_92075c47-daf3-4eb1-aec2-e7e3531bc26f', material: sharedMaterial },
      { name: '  side-car mesh  ', material: [sharedMaterial, fallbackMaterial] },
    ];
    const gltf = {
      scene: {
        traverse(callback: (object: (typeof traversedObjects)[number]) => void) {
          for (const object of traversedObjects) {
            callback(object);
          }
        },
      },
    };
    const loader = {
      loadAsync: jest.fn().mockResolvedValue(gltf),
    };

    const result = await loadGeneratedGlb(loader as unknown as GLTFLoader, 'asset_player_hero');

    expect(result).toBe(gltf);
    expect(loader.loadAsync).toHaveBeenCalledWith(
      'file:///cache/generated-glb/asset_player_hero-06067acef447-labyrinth_runner_hero.glb'
    );
    expect(traversedObjects[0]?.name).toBe('scene_root');
    expect(traversedObjects[1]?.name).toBe('tripo_mesh_92075c47_daf3_4eb1_aec2_e7e3531bc26f');
    expect(traversedObjects[2]?.name).toBe('side_car_mesh');
    expect(sharedMaterial.name).toBe('tripo_material_92075c47_daf3_4eb1_aec2_e7e3531bc26f');
    expect(fallbackMaterial.name).toBe('generated_material_123_bad_material');
  });

  it('downloads Convex-hosted models when downloadUrl is set, then sanitizes names', async () => {
    jest.mocked(FileSystem.getInfoAsync).mockResolvedValue({ exists: false } as never);
    jest.mocked(FileSystem.downloadAsync).mockResolvedValue({ status: 200 } as never);
    jest.mocked(getGeneratedAssetEntry).mockReturnValue({
      chunks: null,
      downloadUrl: 'https://example.convex.site/generated-assets?x=1',
      exists: true,
      fileName: 'labyrinth_runner_hero.glb',
      kind: 'model',
      notes: null,
      path: 'assets/generated/labyrinth_runner_hero.glb',
      sha256: '06067acef4477ff33c8600a0578ae3b24754928eb259fb1cf2606036b8c0a5e9',
      source: 'tripo',
    });

    const material = { name: 'tripo_material_92075c47-daf3-4eb1-aec2-e7e3531bc26f' };
    const gltf = {
      scene: {
        traverse(callback: (object: { name: string; material?: typeof material }) => void) {
          callback({ name: 'mesh-a', material });
        },
      },
    };
    const loader = {
      loadAsync: jest.fn().mockResolvedValue(gltf),
    };

    await loadGeneratedGlb(loader as unknown as GLTFLoader, 'asset_player_hero');

    expect(FileSystem.downloadAsync).toHaveBeenCalledWith(
      'https://example.convex.site/generated-assets?x=1',
      'file:///cache/generated-glb/asset_player_hero-06067acef447-labyrinth_runner_hero.glb'
    );
    expect(FileSystem.writeAsStringAsync).not.toHaveBeenCalled();
    expect(material.name).toBe('tripo_material_92075c47_daf3_4eb1_aec2_e7e3531bc26f');
  });
});
