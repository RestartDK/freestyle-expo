import { Link } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

/**
 * Minimal app shell — no game demo here so agents and generated code can own this route.
 * In __DEV__, a footer link navigates to `/dev-controls` (Control QA). Production has no demo UI.
 */
export default function Index() {
  const insets = useSafeAreaInsets();

  return (
    <ThemedView style={styles.container}>
      <View style={styles.center}>
        <ThemedText type="title">Let&apos;s build.</ThemedText>
      </View>
      {__DEV__ ? (
        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 12) }]}>
          <Link href="/dev-controls" style={styles.devLink}>
            Control QA
          </Link>
        </View>
      ) : null}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    alignItems: 'center',
  },
  devLink: {
    color: '#7ab8ff',
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
