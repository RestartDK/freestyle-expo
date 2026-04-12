import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import type { ControlTemplateId } from './controls/types';

const ORDER: ControlTemplateId[] = ['A', 'B'];

type ControlTemplateSwitcherProps = {
  value: ControlTemplateId;
  onChange: (id: ControlTemplateId) => void;
  /** @default true */
  showLabel?: boolean;
};

/** Compact A / B picker for switching `ControlTemplate` while testing. */
export function ControlTemplateSwitcher({ value, onChange, showLabel = true }: ControlTemplateSwitcherProps) {
  return (
    <View style={styles.wrap}>
      {showLabel ? <Text style={styles.label}>Controls</Text> : null}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {ORDER.map((id) => (
          <Pressable
            key={id}
            onPress={() => onChange(id)}
            style={[styles.chip, value === id && styles.chipActive]}
            accessibilityRole="button"
            accessibilityState={{ selected: value === id }}
          >
            <Text style={styles.chipText}>{id}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 6,
  },
  label: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  row: {
    alignItems: 'center',
    gap: 6,
    flexDirection: 'row',
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.1)',
    minWidth: 44,
    alignItems: 'center',
  },
  chipActive: {
    backgroundColor: 'rgba(100,180,255,0.45)',
  },
  chipText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 16,
  },
});
