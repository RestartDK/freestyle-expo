import { Link } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { GameShell } from '@/game/GameShell';
import { ControlTemplate } from '@/game/controls';

export default function Index() {
  return (
    <GameShell
      scene={
        <View style={styles.scene}>
          {__DEV__ ? (
            <Link href="/dev-controls" style={styles.devLink}>
              Open control template QA (dev)
            </Link>
          ) : null}
        </View>
      }
      overlay={
        <ControlTemplate
          template="A"
          onMove={() => {}}
          onPrimaryAction={() => {}}
        />
      }
    />
  );
}

const styles = StyleSheet.create({
  scene: {
    flex: 1,
    backgroundColor: '#0a0a12',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 12,
  },
  devLink: {
    color: '#7ab8ff',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});
