import { Suspense } from 'react';
import { StyleSheet, View } from 'react-native';
import { Canvas } from '@react-three/fiber/native';

import { Scene } from '@/components/game/Scene';

export function GameScreen() {
  return (
    <View style={styles.container}>
      <Suspense fallback={null}>
        <Canvas>
          <Scene />
        </Canvas>
      </Suspense>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
