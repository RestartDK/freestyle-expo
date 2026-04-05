import { Asset } from 'expo-asset';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import barrelGlb from '@/assets/harness/barrel.glb';
import blockGrassGlb from '@/assets/harness/block-grass.glb';
import coinGoldGlb from '@/assets/harness/coin-gold.glb';
import flagGlb from '@/assets/harness/flag.glb';
import colormapPng from '@/assets/harness/Textures/colormap.png';

export const DEMO_GLBS = [barrelGlb, flagGlb, coinGoldGlb, blockGrassGlb] as const;

export function normalizeToHeight(root: THREE.Object3D, targetHeight: number) {
  const box = new THREE.Box3().setFromObject(root);
  const size = new THREE.Vector3();
  box.getSize(size);
  const maxDim = Math.max(size.x, size.y, size.z, 1e-6);
  const scale = targetHeight / maxDim;
  root.scale.setScalar(scale);
  const box2 = new THREE.Box3().setFromObject(root);
  const center = new THREE.Vector3();
  box2.getCenter(center);
  root.position.sub(center);
}

export async function loadKenneyColormapUri() {
  const asset = Asset.fromModule(colormapPng);
  await asset.downloadAsync();
  const uri = asset.localUri ?? asset.uri;
  if (!uri) throw new Error('[TestScene] colormap asset missing');
  return uri;
}

export function createKenneyLoadingManager(colormapUri: string) {
  const manager = new THREE.LoadingManager();
  manager.setURLModifier((url) => {
    if (url.includes('colormap.png')) return colormapUri;
    return url;
  });
  return manager;
}

export async function loadKenneyDemoGroup(loader: GLTFLoader) {
  const group = new THREE.Group();
  const spacing = 1.85;
  for (let i = 0; i < DEMO_GLBS.length; i++) {
    const asset = Asset.fromModule(DEMO_GLBS[i]);
    await asset.downloadAsync();
    const uri = asset.localUri ?? asset.uri;
    if (!uri) continue;
    const gltf = await loader.loadAsync(uri);
    const clone = gltf.scene.clone(true);
    normalizeToHeight(clone, 1.1);
    clone.position.x = (i - (DEMO_GLBS.length - 1) / 2) * spacing;
    group.add(clone);
  }
  return group;
}
