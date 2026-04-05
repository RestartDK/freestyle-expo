import { Redirect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { GameShell } from '@/game/GameShell';
import type { ControlTemplateId, Vec2 } from '@/game/controls';
import { ControlTemplate } from '@/game/controls';

const ORDER: ControlTemplateId[] = ['A', 'B', 'C', 'D'];

export default function DevControlsScreen() {
  const router = useRouter();
  const [template, setTemplate] = useState<ControlTemplateId>('A');

  const log = useCallback((label: string, payload?: unknown) => {
    console.log(`[controls:${template}] ${label}`, payload ?? '');
  }, [template]);

  if (!__DEV__) {
    return <Redirect href="/" />;
  }

  const stubCallbacks = {
    onMove: (v: Vec2) => log('onMove', v),
    onMoveSecondary: (v: Vec2) => log('onMoveSecondary', v),
    onPrimaryAction: (pressed: boolean) => log('onPrimaryAction', pressed),
    onSecondaryAction: (pressed: boolean) => log('onSecondaryAction', pressed),
    onTap: () => log('onTap'),
    onSwipe: (d: Vec2) => log('onSwipe', d),
    onLane: (lane: 0 | 1 | 2) => log('onLane', lane),
  };

  return (
    <View style={styles.screen}>
      <View style={styles.toolbar}>
        <Pressable onPress={() => router.back()} style={styles.toolbarBtn}>
          <Text style={styles.toolbarBtnText}>Back</Text>
        </Pressable>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          {ORDER.map((id) => (
            <Pressable
              key={id}
              onPress={() => setTemplate(id)}
              style={[styles.chip, template === id && styles.chipActive]}
            >
              <Text style={styles.chipText}>{id}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>
      <View style={styles.shellWrap}>
        <GameShell
          scene={<View style={styles.scene} />}
          overlay={<ControlTemplate template={template} {...stubCallbacks} />}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#07070d' },
  shellWrap: { flex: 1 },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.12)',
  },
  toolbarBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  toolbarBtnText: { color: '#fff', fontWeight: '600' },
  chips: { alignItems: 'center', gap: 6 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  chipActive: {
    backgroundColor: 'rgba(100,180,255,0.35)',
  },
  chipText: { color: '#fff', fontWeight: '700' },
  scene: {
    flex: 1,
    backgroundColor: '#0a0a12',
  },
});
