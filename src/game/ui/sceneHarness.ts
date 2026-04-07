import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import { HARNESS_DEMO_KEYS, glb } from '@/game/assets/glbRegistry';
import { loadGltfFromBundledModule } from '@/game/assets/loadGltf';

const BASE_COLORMAP_SIZE = 16;
const BASE_COLORMAP_ROWS = [
  '#000000 #000000 #000000 #000000 #000000 #000000 #000000 #000000 #000000 #000000 #000000 #000000 #000000 #000000 #000000 #000000',
  '#000000 #000000 #000000 #000000 #000000 #000000 #000000 #000000 #000000 #000000 #000000 #000000 #000000 #000000 #000000 #000000',
  '#000000 #000000 #000000 #000000 #000000 #000000 #000000 #000000 #000000 #000000 #000000 #000000 #000000 #000000 #000000 #000000',
  '#000000 #000000 #000000 #000000 #000000 #000000 #000000 #000000 #000000 #000000 #000000 #000000 #000000 #000000 #000000 #000000',
  '#ffc044 #ffcd5e #ff7e44 #ff9844 #cf534f #f96a42 #6794d9 #658cd5 #d0e8ff #c2ddfa #a878e8 #9e70e1 #f378f0 #e978ef #000000 #000000',
  '#ffc044 #ffbc50 #ff7e44 #ff8d44 #cf534f #ed6346 #6794d9 #617cce #d0e8ff #a8c8f0 #a878e8 #8a60d5 #f378f0 #d678ed #000000 #000000',
  '#ffc044 #ffab42 #ff7e44 #ff8144 #cf534f #e15d49 #6794d9 #5d6cc6 #d0e8ff #8eb3e7 #a878e8 #7750c9 #f378f0 #c277ea #000000 #000000',
  '#ffc044 #ff9a33 #ff7e44 #ff7644 #cf534f #d5564d #6794d9 #595cbf #d0e8ff #739edd #a878e8 #6340bd #f378f0 #af77e8 #000000 #000000',
  '#4f5260 #515463 #a0a8c9 #bbc3ea #ffffff #f6f6f9 #f1976c #e89066 #b06041 #aa5e41 #f2bf99 #ecb791 #fde4c7 #fce0c1 #61cb8b #57c186',
  '#4f5260 #4a4d5b #a0a8c9 #a7aed1 #ffffff #e5e5ee #f1976c #d8825c #b06041 #9e5b41 #f2bf99 #e2a781 #fde4c7 #f9d9b4 #61cb8b #45af7e',
  '#4f5260 #444754 #a0a8c9 #9399b8 #ffffff #d4d4e4 #f1976c #c87451 #b06041 #935841 #f2bf99 #d79871 #fde4c7 #f7d3a8 #61cb8b #349d75',
  '#4f5260 #3d404c #a0a8c9 #7e849f #ffffff #c3c3d9 #f1976c #b76746 #b06041 #875541 #f2bf99 #cd8861 #fde4c7 #f4cc9c #61cb8b #228a6c',
  '#3d3e4b #3b3c4b #61c8af #5dbfa8 #c7b6ff #bdacfa #faba2d #ecbb45 #ff8aae #f59cb6 #e2c3ab #ddbda6 #38383d #45454e #868ba1 #81859b',
  '#3d3e4b #373847 #61c8af #53ad9a #c7b6ff #aa9aef #faba2d #e4af41 #ff8aae #ea8ca7 #e2c3ab #d3b19c #38383d #404048 #868ba1 #787b90',
  '#3d3e4b #333442 #61c8af #499c8c #c7b6ff #9788e5 #faba2d #dba33d #ff8aae #e07c97 #e2c3ab #caa692 #38383d #3b3b41 #868ba1 #6f7186',
  '#3d3e4b #2f303e #61c8af #3f8a7e #c7b6ff #8477db #faba2d #d39839 #ff8aae #d66d88 #e2c3ab #c09a88 #38383d #36363a #868ba1 #66667b',
] as const;

function buildBaseColormapData() {
  const pixels = BASE_COLORMAP_ROWS.flatMap((row) => row.split(' '));
  const data = new Uint8Array(pixels.length * 4);

  for (let i = 0; i < pixels.length; i++) {
    const hex = pixels[i].slice(1);
    const offset = i * 4;
    data[offset] = Number.parseInt(hex.slice(0, 2), 16);
    data[offset + 1] = Number.parseInt(hex.slice(2, 4), 16);
    data[offset + 2] = Number.parseInt(hex.slice(4, 6), 16);
    data[offset + 3] = 255;
  }

  return data;
}

const BASE_COLORMAP_DATA = buildBaseColormapData();

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

function createBaseColormapTexture() {
  const texture = new THREE.DataTexture(
    BASE_COLORMAP_DATA.slice(),
    BASE_COLORMAP_SIZE,
    BASE_COLORMAP_SIZE,
    THREE.RGBAFormat,
  );
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  texture.flipY = false;
  texture.generateMipmaps = false;
  texture.needsUpdate = true;
  return texture;
}

class BaseColormapLoader extends THREE.Loader {
  load(
    url: string,
    onLoad?: (data: THREE.Texture) => void,
    _onProgress?: (event: ProgressEvent<EventTarget>) => void,
    onError?: (err: unknown) => void,
  ) {
    this.manager.itemStart(url);

    try {
      const texture = createBaseColormapTexture();
      onLoad?.(texture);
      this.manager.itemEnd(url);
      return texture;
    } catch (error) {
      onError?.(error);
      this.manager.itemError(url);
      this.manager.itemEnd(url);
      return createBaseColormapTexture();
    }
  }
}

export function createBaseLoadingManager() {
  const manager = new THREE.LoadingManager();
  manager.addHandler(/(?:^|\/)colormap\.png$/i, new BaseColormapLoader(manager));
  return manager;
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
