import { useEffect, useRef } from 'react';
import { StyleSheet } from 'react-native';
import { GLView } from 'expo-gl';
import type { ExpoWebGLRenderingContext } from 'expo-gl';
import * as THREE from 'three';

/**
 * Minimal rotating cube on `expo-gl` + Three.js — use as the “base object” under touch controls.
 * The GL view uses `pointerEvents="none"` when placed inside `GameShell` so overlays keep touches.
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

  const onContextCreate = (gl: ExpoWebGLRenderingContext) => {
    const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a12);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 0.2, 3.2);

    const geometry = new THREE.BoxGeometry(1.1, 1.1, 1.1);
    const material = new THREE.MeshNormalMaterial();
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

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

    const renderFrame = () => {
      if (!mountedRef.current) return;
      rafRef.current = requestAnimationFrame(renderFrame);
      cube.rotation.x += 0.012;
      cube.rotation.y += 0.018;
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
