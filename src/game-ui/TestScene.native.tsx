import '@/polyfills/threeImageLoader.native';

import { useEffect, useRef } from 'react';
import { StyleSheet } from 'react-native';
import { GLView } from 'expo-gl';
import type { ExpoWebGLRenderingContext } from 'expo-gl';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import {
  createKenneyLoadingManager,
  loadKenneyColormapUri,
  loadKenneyDemoGroup,
} from '@/game-ui/testSceneHarness';

/**
 * iOS/Android: Kenney GLBs on `expo-gl` + Three.js — base scene under touch controls.
 * The GL view uses `pointerEvents="none"` when placed inside `GameShell` so overlays keep touches.
 * Web: `TestScene.web.tsx` (no `expo-gl` / `ExpoGL`).
 */
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

    let group: THREE.Group;
    try {
      const colormapUri = await loadKenneyColormapUri();
      const manager = createKenneyLoadingManager(colormapUri);
      const loader = new GLTFLoader(manager);
      group = await loadKenneyDemoGroup(loader);
    } catch (e) {
      console.error('[TestScene] GLB load failed', e);
      group = new THREE.Group();
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
