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
});
