import { Link } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Game } from '@/game/Game';

/**
 * Main playable game. In __DEV__, a footer link opens `/dev-controls` for
 * touch-template QA (`TestScene` + `ControlTemplate`).
 */
export default function Index() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <Game />
      {__DEV__ ? (
        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 12) }]} pointerEvents="box-none">
          <Link href="/dev-controls" style={styles.devLink}>
            Control QA
          </Link>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  devLink: {
    color: '#7ab8ff',
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
