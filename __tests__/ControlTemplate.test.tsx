import type { ReactElement } from 'react';
import { render, screen } from '@testing-library/react-native';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ControlTemplate } from '@/game-ui/controls';

const safeAreaMetrics = {
  frame: { x: 0, y: 0, width: 844, height: 390 },
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
};

function wrap(ui: ReactElement) {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider initialMetrics={safeAreaMetrics}>
        <View style={{ flex: 1 }}>{ui}</View>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

describe('ControlTemplate', () => {
  it('renders template A with a primary joystick control', () => {
    render(
      wrap(
        <ControlTemplate template="A" onMove={() => {}} onPrimaryAction={() => {}} />
      )
    );

    expect(screen.getByTestId('control-template-a-joystick')).toBeTruthy();
  });
});
