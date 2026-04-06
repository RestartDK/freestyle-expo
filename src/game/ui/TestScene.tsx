import { Suspense, useEffect, useRef, type ComponentType } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import { createBaseLoadingManager, loadBaseDemoGroup } from './testSceneHarness';

type FiberApi = {
  Canvas: ComponentType<Record<string, unknown>>;
  useFrame: (callback: (_state: unknown, delta: number) => void) => void;
};

const fiber = (
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  Platform.OS === 'web' ? require('@react-three/fiber') : require('@react-three/fiber/native')
) as FiberApi;

const Canvas = fiber.Canvas;
const useFrame = fiber.useFrame;

function HarnessModels() {
  const rootRef = useRef<THREE.Group>(null);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      try {
        const loader = new GLTFLoader(createBaseLoadingManager());
        const group = await loadBaseDemoGroup(loader);
        if (cancelled || !rootRef.current) return;
        rootRef.current.clear();
        rootRef.current.add(group);
      } catch (error) {
        console.error('[TestScene] GLB load failed', error);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useFrame((_, delta) => {
    if (rootRef.current) {
      rootRef.current.rotation.y += delta * 0.48;
    }
  });

  return (
    <>
      <ambientLight intensity={0.65} color="#ffffff" />
      <directionalLight position={[4, 8, 5]} intensity={1.15} color="#ffffff" />
      <group ref={rootRef} />
    </>
  );
}

/** Single Expo scene implementation for native and web. */
export function TestScene() {
  return (
    <View style={styles.root}>
      <Suspense fallback={null}>
        <Canvas
          style={styles.canvas}
          camera={{ position: [0, 1.2, 4.2], fov: 50, near: 0.1, far: 100 }}
          onCreated={({ scene, gl }: { scene: THREE.Scene; gl: THREE.WebGLRenderer }) => {
            scene.background = new THREE.Color(0x0a0a12);
            gl.outputColorSpace = THREE.SRGBColorSpace;
          }}
        >
          <HarnessModels />
        </Canvas>
      </Suspense>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  canvas: {
    flex: 1,
  },
});
