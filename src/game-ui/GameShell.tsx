import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

type GameShellProps = {
  /** `expo-gl` / Three canvas — receives no touches so gestures stay on the overlay. */
  scene: ReactNode;
  /** Controls from `ControlTemplate` (or custom HUD). */
  overlay: ReactNode;
};

/**
 * Stacks the 3D/WebGL layer under a touchable HUD. The scene must not steal pointer events;
 * controls sit in a full-screen sibling with `pointerEvents="box-none"` so only buttons/sticks hit-test.
 */
export function GameShell({ scene, overlay }: GameShellProps) {
  return (
    <View style={styles.root} pointerEvents="box-none">
      <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
        {scene}
      </View>
      <View style={StyleSheet.absoluteFillObject} pointerEvents="box-none">
        {overlay}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
