import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

import { MAX_DELTA_SECONDS } from '@/game/constants';
import { getInput } from '@/game/input';
import { createInitialState } from '@/game/state';
import { step } from '@/game/step';

export function Scene() {
  const stateRef = useRef(createInitialState());
  const worldRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    const dt = Math.min(delta, MAX_DELTA_SECONDS);
    const state = stateRef.current;
    step(state, dt, getInput());

    const mesh = meshRef.current;
    if (mesh) {
      mesh.rotation.x = state.box.rotation.x;
      mesh.rotation.y = state.box.rotation.y;
    }
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <group ref={worldRef}>
        <mesh ref={meshRef}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#6366f1" />
        </mesh>
      </group>
    </>
  );
}
