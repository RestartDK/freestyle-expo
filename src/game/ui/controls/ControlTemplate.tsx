import { StyleSheet, View } from 'react-native';

import type { ControlTemplateProps } from './types';
import { TemplateA } from './templates';

/**
 * On-screen controls for landscape games. Renders in a full-screen layer
 * with `pointerEvents="box-none"` so only controls absorb touches; pair with `GameShell`
 * so the GL view sits underneath with `pointerEvents="none"`.
 */
export function ControlTemplate(props: ControlTemplateProps) {
  return (
    <View style={styles.layer} pointerEvents="box-none">
      <TemplateA {...props} />
    </View>
  );
}

const styles = StyleSheet.create({
  layer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    pointerEvents: 'box-none',
  },
});
