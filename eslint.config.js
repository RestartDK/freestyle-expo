// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const reactThree = require('@react-three/eslint-plugin');

module.exports = defineConfig([
  expoConfig,
  {
    plugins: {
      '@react-three': reactThree,
    },
    rules: {
      '@react-three/no-clone-in-loop': 'error',
      '@react-three/no-new-in-loop': 'error',
    },
  },
  {
    files: ['components/game/Scene*.tsx', 'src/game-ui/TestScene.tsx'],
    rules: {
      // R3F JSX uses Three.js props, not DOM attributes; the official R3F plugin does not replace this rule.
      'react/no-unknown-property': 'off',
    },
  },
  {
    ignores: ['dist/*'],
  },
]);
