import { Suspense, useMemo, useRef, useState, type ComponentType } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import type {} from '@react-three/fiber';
import * as THREE from 'three';

import { MAX_DELTA_SECONDS } from '@/game/constants';
import { ControlTemplate, type Vec2 } from '@/game/controls';
import type { InputSnapshot } from '@/game/input';
import { createInitialState } from '@/game/state';
import { step } from '@/game/step';
import { GameShell } from '@/game/ui/GameShell';

type FiberApi = {
  Canvas: ComponentType<Record<string, unknown>>;
  useFrame: (callback: (_state: unknown, delta: number) => void) => void;
};

type RuntimeSceneProps = {
  input: InputSnapshot;
  onCollectedCountChange: (count: number) => void;
};

type FrameState = {
  camera: THREE.PerspectiveCamera;
};

const fiber = (
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  Platform.OS === 'web' ? require('@react-three/fiber') : require('@react-three/fiber/native')
) as FiberApi;

const Canvas = fiber.Canvas;
const useFrame = fiber.useFrame;

const PLAYER_Y = 0.34;
const CAMERA_OFFSET = new THREE.Vector3(0, 6.6, 5.6);
const CAMERA_LOOK_OFFSET = new THREE.Vector3(0, 0.2, -1.5);
const vCameraTarget = new THREE.Vector3();
const vDesiredPosition = new THREE.Vector3();
const vLookAt = new THREE.Vector3();

function RuntimeScene({ input, onCollectedCountChange }: RuntimeSceneProps) {
  const stateRef = useRef(createInitialState());
  const playerRef = useRef<THREE.Group>(null);
  const pulseRef = useRef<THREE.Mesh>(null);
  const beaconRefs = useRef<Record<string, THREE.Mesh | null>>({});
  const lastCollectedCountRef = useRef(-1);

  useFrame((frameState, delta) => {
    const dt = Math.min(delta, MAX_DELTA_SECONDS);
    const state = stateRef.current;

    step(state, dt, input);

    const collectedCount = state.beacons.filter((beacon) => beacon.collected).length;
    if (collectedCount !== lastCollectedCountRef.current) {
      lastCollectedCountRef.current = collectedCount;
      onCollectedCountChange(collectedCount);
    }

    const player = playerRef.current;
    if (player) {
      player.position.set(state.player.position.x, PLAYER_Y, state.player.position.y);
      player.rotation.y = state.player.heading;
    }

    for (const beacon of state.beacons) {
      const mesh = beaconRefs.current[beacon.id];
      if (!mesh) {
        continue;
      }

      mesh.visible = !beacon.collected;
      mesh.position.set(
        beacon.position.x,
        0.55 + Math.sin(state.worldTime * 2 + beacon.phase) * 0.12,
        beacon.position.y,
      );
      mesh.rotation.y += dt * 1.3;
    }

    const pulse = pulseRef.current;
    if (pulse) {
      const intensity = state.actionPulse;
      pulse.visible = intensity > 0.01;
      const pulseScale = 0.8 + (1 - intensity) * 1.9;
      pulse.scale.setScalar(pulseScale);
      pulse.position.set(state.player.position.x, 0.03, state.player.position.y);
      const material = pulse.material;
      if (material instanceof THREE.MeshBasicMaterial) {
        material.opacity = intensity * 0.45;
      }
    }

    const { camera } = frameState as FrameState;
    vCameraTarget.set(state.player.position.x, PLAYER_Y, state.player.position.y);
    vDesiredPosition.copy(vCameraTarget).add(CAMERA_OFFSET);
    camera.position.lerp(vDesiredPosition, 0.08);
    vLookAt.copy(vCameraTarget).add(CAMERA_LOOK_OFFSET);
    camera.lookAt(vLookAt);
  });

  return (
    <>
      <color attach="background" args={['#0b1220']} />
      <fog attach="fog" args={['#0b1220', 10, 20]} />
      <ambientLight intensity={0.9} />
      <directionalLight position={[4, 8, 5]} intensity={1.45} color="#fff4cc" />
      <hemisphereLight intensity={0.55} groundColor="#0b3d2e" color="#5ec8ff" />

      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[6.3, 48]} />
        <meshStandardMaterial color="#153a2c" />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[3.8, 4.5, 48]} />
        <meshBasicMaterial color="#173f56" transparent opacity={0.75} />
      </mesh>

      {stateRef.current.beacons.map((beacon) => (
        <mesh
          key={beacon.id}
          ref={(mesh: THREE.Mesh | null) => {
            beaconRefs.current[beacon.id] = mesh;
          }}
          position={[beacon.position.x, 0.55, beacon.position.y]}
        >
          <octahedronGeometry args={[0.28, 0]} />
          <meshStandardMaterial color={beacon.color} emissive={beacon.color} emissiveIntensity={0.55} />
        </mesh>
      ))}

      <mesh ref={pulseRef} rotation={[-Math.PI / 2, 0, 0]} visible={false}>
        <ringGeometry args={[0.6, 0.76, 36]} />
        <meshBasicMaterial color="#8ee6ff" transparent opacity={0.2} />
      </mesh>

      <group ref={playerRef} position={[0, PLAYER_Y, 0]}>
        <mesh castShadow>
          <capsuleGeometry args={[0.2, 0.45, 6, 12]} />
          <meshStandardMaterial color="#d6dee8" />
        </mesh>
        <mesh position={[0, 0.4, 0.03]}>
          <sphereGeometry args={[0.14, 18, 18]} />
          <meshStandardMaterial color="#1f6feb" emissive="#0f2740" emissiveIntensity={0.45} />
        </mesh>
      </group>
    </>
  );
}

export function Game() {
  const [move, setMove] = useState<Vec2>({ x: 0, y: 0 });
  const [actionPressed, setActionPressed] = useState(false);
  const [collectedCount, setCollectedCount] = useState(0);

  const input = useMemo<InputSnapshot>(() => ({ actionPressed, move }), [actionPressed, move]);
  const totalBeacons = createInitialState().beacons.length;

  return (
    <GameShell
      scene={
        <Suspense fallback={null}>
          <Canvas camera={{ far: 30, fov: 48, near: 0.1, position: [0, 6.6, 5.6] }}>
            <RuntimeScene input={input} onCollectedCountChange={setCollectedCount} />
          </Canvas>
        </Suspense>
      }
      overlay={
        <>
          <View style={styles.hud} pointerEvents="none">
            <Text style={styles.title}>Beacon Run</Text>
            <Text style={styles.subtitle}>
              Use the joystick to move and hold A near a beacon to collect it.
            </Text>
            <Text style={styles.counter}>
              {collectedCount === totalBeacons
                ? 'All beacons collected'
                : `Collected ${collectedCount}/${totalBeacons}`}
            </Text>
          </View>
          <ControlTemplate template="A" onMove={setMove} onPrimaryAction={setActionPressed} />
        </>
      }
    />
  );
}

const styles = StyleSheet.create({
  hud: {
    position: 'absolute',
    top: 18,
    left: 18,
    right: 18,
    gap: 4,
  },
  title: {
    color: '#f8fafc',
    fontSize: 24,
    fontWeight: '800',
  },
  subtitle: {
    color: 'rgba(248,250,252,0.78)',
    fontSize: 14,
    fontWeight: '500',
    maxWidth: 460,
  },
  counter: {
    color: '#8ee6ff',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 2,
  },
});
