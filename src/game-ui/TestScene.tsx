import { useEffect, useRef } from 'react';
import { StyleSheet } from 'react-native';
import { Asset } from 'expo-asset';
import { GLView } from 'expo-gl';
import type { ExpoWebGLRenderingContext } from 'expo-gl';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import barrelGlb from '@/assets/harness/barrel.glb';
import blockGrassGlb from '@/assets/harness/block-grass.glb';
import coinGoldGlb from '@/assets/harness/coin-gold.glb';
import flagGlb from '@/assets/harness/flag.glb';
import colormapPng from '@/assets/harness/Textures/colormap.png';

/**
 * Rotating row of Kenney platformer GLBs on `expo-gl` + Three.js — base scene under touch controls.
 * The GL view uses `pointerEvents="none"` when placed inside `GameShell` so overlays keep touches.
 */
const DEMO_GLBS = [barrelGlb, flagGlb, coinGoldGlb, blockGrassGlb] as const;

function normalizeToHeight(root: THREE.Object3D, targetHeight: number) {
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

export function TestScene() {
  const mountedRef = useRef(true);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, []);

  const onContextCreate = async (gl: ExpoWebGLRenderingContext) => {
    const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a12);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 4.2);
    camera.lookAt(0, 0.4, 0);

    scene.add(new THREE.AmbientLight(0xffffff, 0.65));
    const dir = new THREE.DirectionalLight(0xffffff, 1.15);
    dir.position.set(4, 8, 5);
    scene.add(dir);

    const canvasStub = {
      width,
      height,
      style: {},
      addEventListener: () => {},
      removeEventListener: () => {},
      clientHeight: height,
      clientWidth: width,
    } as unknown as HTMLCanvasElement;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasStub,
      context: gl as WebGLRenderingContext,
    });
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const group = new THREE.Group();
    const spacing = 1.85;

    /** Kenney GLBs reference `Textures/colormap.png` next to the file; Expo copies each asset separately, so remap to the bundled texture. */
    const colormapAsset = Asset.fromModule(colormapPng);
    await colormapAsset.downloadAsync();
    const colormapUri = colormapAsset.localUri ?? colormapAsset.uri;

    const loadingManager = new THREE.LoadingManager();
    loadingManager.setURLModifier((url) => {
      if (url.includes('colormap.png')) {
        return colormapUri ?? url;
      }
      return url;
    });

    const loader = new GLTFLoader(loadingManager);

    try {
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
    } catch (e) {
      console.error('[TestScene] GLB load failed', e);
    }

    scene.add(group);

    const renderFrame = () => {
      if (!mountedRef.current) return;
      rafRef.current = requestAnimationFrame(renderFrame);
      group.rotation.y += 0.008;
      renderer.render(scene, camera);
      gl.endFrameEXP();
    };

    renderFrame();
  };

  return <GLView style={styles.gl} onContextCreate={onContextCreate} />;
}

const styles = StyleSheet.create({
  gl: {
    flex: 1,
  },
});
