jest.mock('react-native-reanimated', () => {
  const RN = require('react-native');
  return {
    __esModule: true,
    default: { View: RN.View },
    useSharedValue: (init) => ({ value: init }),
    useAnimatedStyle: (fn) => {
      const style = typeof fn === 'function' ? fn() : {};
      return style ?? {};
    },
    withSpring: (v) => v,
    runOnJS: (fn) => fn,
  };
});

jest.mock('react-native-gesture-handler', () => {
  const React = require('react');
  const RN = require('react-native');
  const buildPan = () => {
    const g = {
      onUpdate: () => g,
      onEnd: () => g,
      onBegin: () => g,
    };
    return g;
  };
  return {
    GestureHandlerRootView: RN.View,
    GestureDetector: ({ children }) => React.createElement(React.Fragment, null, children),
    Gesture: { Pan: buildPan },
  };
});

jest.mock('expo-screen-orientation', () => ({
  lockAsync: jest.fn(),
  unlockAsync: jest.fn(),
  OrientationLock: { LANDSCAPE: 1 },
}));
