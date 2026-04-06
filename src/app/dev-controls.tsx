import { Redirect } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { ControlTemplateId, Vec2 } from '@/game/controls';
import { ControlTemplate } from '@/game/controls';
import { ControlTemplateSwitcher } from '@/game/ui/ControlTemplateSwitcher';
import { GameShell } from '@/game/ui/GameShell';
import { TestScene } from '@/game/ui/TestScene';

export default function DevControlsScreen() {
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
        <View style={styles.toolbarTitle}>
          <Text style={styles.toolbarHeading}>Control QA</Text>
          <Text style={styles.toolbarSub}>Base GLBs + templates A–D</Text>
        </View>
        <View style={styles.toolbarSwitcher}>
          <ControlTemplateSwitcher value={template} onChange={setTemplate} />
        </View>
      </View>
      <View style={styles.shellWrap}>
        <GameShell
          scene={<TestScene />}
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
    gap: 10,
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.12)',
  },
  toolbarTitle: {
    flexShrink: 0,
  },
  toolbarHeading: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  toolbarSub: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 11,
    marginTop: 2,
  },
  toolbarSwitcher: {
    flex: 1,
    minWidth: 0,
  },
});
