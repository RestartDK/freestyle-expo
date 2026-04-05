import { Canvas, useFrame } from '@react-three/fiber';
import { Suspense, useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import {
  createKenneyLoadingManager,
  loadKenneyColormapUri,
  loadKenneyDemoGroup,
} from '@/game-ui/testSceneHarness';

/**
 * Web: `expo-gl` / native `ExpoGL` is unavailable — same harness scene via R3F `Canvas`.
 */
function HarnessModels() {
  const rootRef = useRef<THREE.Group>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const colormapUri = await loadKenneyColormapUri();
        const manager = createKenneyLoadingManager(colormapUri);
        const loader = new GLTFLoader(manager);
        const group = await loadKenneyDemoGroup(loader);
        if (cancelled || !rootRef.current) return;
        rootRef.current.clear();
        rootRef.current.add(group);
      } catch (e) {
        console.error('[TestScene web] GLB load failed', e);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useFrame(() => {
    if (rootRef.current) rootRef.current.rotation.y += 0.008;
  });

  return (
    <>
      <ambientLight intensity={0.65} color="#ffffff" />
      <directionalLight position={[4, 8, 5]} intensity={1.15} color="#ffffff" />
      <group ref={rootRef} />
    </>
  );
}

export function TestScene() {
  return (
    <View style={styles.gl}>
      <Canvas
        camera={{ position: [0, 1.2, 4.2], fov: 50, near: 0.1, far: 100 }}
        gl={{ outputColorSpace: THREE.SRGBColorSpace }}
        onCreated={({ scene, gl }) => {
          scene.background = new THREE.Color(0x0a0a12);
          gl.outputColorSpace = THREE.SRGBColorSpace;
        }}
      >
        <Suspense fallback={null}>
          <HarnessModels />
        </Suspense>
      </Canvas>
    </View>
  );
}

const styles = StyleSheet.create({
  gl: {
    flex: 1,
  },
});
