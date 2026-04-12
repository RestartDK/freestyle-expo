import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import { HARNESS_DEMO_KEYS, glb } from '@/game/assets/glbRegistry';
import { loadGltfFromBundledModule } from '@/game/assets/loadGltf';

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

export async function loadBaseDemoGroup(loader: GLTFLoader) {
  const group = new THREE.Group();
  const spacing = 1.85;
  const keys = HARNESS_DEMO_KEYS;
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const gltf = await loadGltfFromBundledModule(loader, glb[key]);
    const clone = gltf.scene.clone(true);
    normalizeToHeight(clone, 1.1);
    clone.position.x = (i - (keys.length - 1) / 2) * spacing;
    group.add(clone);
  }
  return group;
}
