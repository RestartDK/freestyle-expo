import { StyleSheet, View } from 'react-native';

import type { ControlTemplateProps } from './types';
import { TemplateA, TemplateB, TemplateC, TemplateD } from './templates';

/**
 * Switchable on-screen controls for landscape games. Renders in a full-screen layer
 * with `pointerEvents="box-none"` so only controls absorb touches; pair with `GameShell`
 * so the GL view sits underneath with `pointerEvents="none"`.
 */
export function ControlTemplate(props: ControlTemplateProps) {
  const { template } = props;

  return (
    <View style={styles.layer} pointerEvents="box-none">
      {template === 'A' && <TemplateA {...props} />}
      {template === 'B' && <TemplateB {...props} />}
      {template === 'C' && <TemplateC {...props} />}
      {template === 'D' && <TemplateD {...props} />}
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
