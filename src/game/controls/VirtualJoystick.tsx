import { useCallback } from 'react';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

const DEFAULT_SIZE = 140;
const KNOB_SIZE = 52;
const MAX_RADIUS = (DEFAULT_SIZE - KNOB_SIZE) / 2;

type VirtualJoystickProps = {
  onChange: (v: { x: number; y: number }) => void;
  onRelease?: () => void;
  testID?: string;
  side: 'left' | 'right';
};

export function VirtualJoystick({ onChange, onRelease, testID, side }: VirtualJoystickProps) {
  const width = useSharedValue(DEFAULT_SIZE);
  const height = useSharedValue(DEFAULT_SIZE);
  const tx = useSharedValue(0);
  const ty = useSharedValue(0);

  const emit = useCallback(
    (x: number, y: number) => {
      onChange({ x: x / MAX_RADIUS, y: -y / MAX_RADIUS });
    },
    [onChange]
  );

  const emitRelease = useCallback(() => {
    onRelease?.();
  }, [onRelease]);

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      'worklet';
      const cx = width.value / 2;
      const cy = height.value / 2;
      const dx = e.x - cx;
      const dy = e.y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const r = Math.min(dist, MAX_RADIUS);
      const angle = Math.atan2(dy, dx);
      const nx = Math.cos(angle) * r;
      const ny = Math.sin(angle) * r;
      tx.value = nx;
      ty.value = ny;
      runOnJS(emit)(nx, ny);
    })
    .onEnd(() => {
      tx.value = withSpring(0);
      ty.value = withSpring(0);
      runOnJS(emit)(0, 0);
      runOnJS(emitRelease)();
    });

  const knobStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: tx.value }, { translateY: ty.value }],
  }));

  const onLayout = (e: LayoutChangeEvent) => {
    width.value = e.nativeEvent.layout.width;
    height.value = e.nativeEvent.layout.height;
  };

  return (
    <GestureDetector gesture={pan}>
      <View
        testID={testID}
        onLayout={onLayout}
        style={[styles.pad, side === 'right' ? styles.padRight : styles.padLeft]}
      >
        <View style={styles.ring} />
        <Animated.View style={[styles.knob, knobStyle]} />
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  pad: {
    width: DEFAULT_SIZE,
    height: DEFAULT_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  padLeft: {},
  padRight: {},
  ring: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.35)',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  knob: {
    width: KNOB_SIZE,
    height: KNOB_SIZE,
    borderRadius: KNOB_SIZE / 2,
    backgroundColor: 'rgba(255,255,255,0.85)',
    position: 'absolute',
  },
});
