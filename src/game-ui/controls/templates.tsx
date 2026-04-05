import { useRef } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { ControlTemplateProps } from './types';
import { VirtualJoystick } from './VirtualJoystick';

function ActionButton({
  label,
  onHold,
  testID,
}: {
  label: string;
  onHold?: (pressed: boolean) => void;
  testID?: string;
}) {
  return (
    <Pressable
      testID={testID}
      style={({ pressed }) => [styles.actionBtn, pressed && styles.actionBtnPressed]}
      onPressIn={() => onHold?.(true)}
      onPressOut={() => onHold?.(false)}
    >
      <Text style={styles.actionLabel}>{label}</Text>
    </Pressable>
  );
}

export function TemplateA({ onMove, onPrimaryAction }: ControlTemplateProps) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.row, { paddingBottom: Math.max(insets.bottom, 12), paddingHorizontal: insets.left + 8 }]}>
      <VirtualJoystick
        testID="control-template-a-joystick"
        side="left"
        onChange={(v) => onMove?.(v)}
      />
      <View style={styles.spacer} />
      <ActionButton label="A" testID="control-template-a-action" onHold={onPrimaryAction} />
    </View>
  );
}

export function TemplateB({ onMove, onMoveSecondary }: ControlTemplateProps) {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.row,
        { paddingBottom: Math.max(insets.bottom, 12), paddingHorizontal: Math.max(insets.left, insets.right, 8) },
      ]}
    >
      <VirtualJoystick side="left" onChange={(v) => onMove?.(v)} />
      <View style={styles.spacer} />
      <VirtualJoystick testID="control-template-b-aim" side="right" onChange={(v) => onMoveSecondary?.(v)} />
    </View>
  );
}

export function TemplateC({ onMove, onTap, onSecondaryAction }: ControlTemplateProps) {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.row,
        { paddingBottom: Math.max(insets.bottom, 12), paddingHorizontal: Math.max(insets.left, insets.right, 8) },
      ]}
    >
      <VirtualJoystick side="left" onChange={(v) => onMove?.(v)} />
      <View style={styles.spacer} />
      <View style={styles.cRight}>
        <Pressable
          testID="control-template-c-tap"
          style={({ pressed }) => [styles.tapZone, pressed && styles.tapZonePressed]}
          onPress={() => onTap?.()}
        >
          <Text style={styles.tapLabel}>Tap</Text>
        </Pressable>
        <ActionButton label="B" onHold={onSecondaryAction} />
      </View>
    </View>
  );
}

export function TemplateD({ onSwipe, onLane, onPrimaryAction }: ControlTemplateProps) {
  const insets = useSafeAreaInsets();
  const swipeStart = useRef({ x: 0, y: 0 });

  return (
    <View style={[styles.dWrap, { paddingBottom: Math.max(insets.bottom, 12), paddingHorizontal: insets.left + 8 }]}>
      <View
        testID="control-template-d-swipe"
        style={styles.swipeZone}
        onTouchStart={(e) => {
          swipeStart.current = { x: e.nativeEvent.pageX, y: e.nativeEvent.pageY };
        }}
        onTouchEnd={(e) => {
          const dx = e.nativeEvent.pageX - swipeStart.current.x;
          const dy = e.nativeEvent.pageY - swipeStart.current.y;
          onSwipe?.({ x: dx, y: dy });
        }}
      >
        <Text style={styles.swipeHint}>Swipe</Text>
      </View>
      <View style={styles.laneRow}>
        {(['L', 'C', 'R'] as const).map((label, i) => (
          <Pressable
            key={label}
            testID={`control-template-d-lane-${i}`}
            style={({ pressed }) => [styles.laneBtn, pressed && styles.laneBtnPressed]}
            onPress={() => onLane?.(i as 0 | 1 | 2)}
          >
            <Text style={styles.laneLabel}>{label}</Text>
          </Pressable>
        ))}
      </View>
      <ActionButton label="Action" testID="control-template-d-action" onHold={onPrimaryAction} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    width: '100%',
    pointerEvents: 'box-none',
  },
  spacer: { flex: 1 },
  actionBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,80,80,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  actionBtnPressed: {
    opacity: 0.85,
  },
  actionLabel: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 20,
  },
  cRight: {
    alignItems: 'flex-end',
    gap: 10,
  },
  tapZone: {
    width: 120,
    height: 72,
    borderRadius: 12,
    backgroundColor: 'rgba(80,160,255,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  tapZonePressed: {
    opacity: 0.8,
  },
  tapLabel: {
    color: '#fff',
    fontWeight: '600',
  },
  dWrap: {
    width: '100%',
    gap: 10,
    alignItems: 'stretch',
    pointerEvents: 'box-none',
  },
  swipeZone: {
    minHeight: 72,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  swipeHint: {
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '600',
  },
  laneRow: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between',
  },
  laneBtn: {
    flex: 1,
    minHeight: 64,
    borderRadius: 10,
    backgroundColor: 'rgba(120,200,120,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  laneBtnPressed: {
    opacity: 0.85,
  },
  laneLabel: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
  },
});
