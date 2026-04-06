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
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'zustand',
              message:
                'Use React useState/useReducer/useRef (or small local context) instead of Zustand in this template.',
            },
            {
              name: 'jotai',
              message:
                'Use React useState/useReducer/useRef instead of Jotai in this template.',
            },
            {
              name: 'recoil',
              message:
                'Use React useState/useReducer/useRef instead of Recoil in this template.',
            },
            {
              name: 'mobx',
              message:
                'Use React useState/useReducer/useRef instead of MobX in this template.',
            },
            {
              name: 'mobx-react-lite',
              message:
                'Use React useState/useReducer/useRef instead of MobX in this template.',
            },
            {
              name: 'valtio',
              message:
                'Use React useState/useReducer/useRef instead of Valtio in this template.',
            },
            {
              name: 'redux',
              message:
                'Use React useState/useReducer/useRef instead of Redux in this template.',
            },
            {
              name: 'react-redux',
              message:
                'Use React useState/useReducer/useRef instead of react-redux in this template.',
            },
            {
              name: '@reduxjs/toolkit',
              message:
                'Use React useState/useReducer/useRef instead of Redux Toolkit in this template.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['components/game/Scene*.tsx', 'src/game/ui/TestScene.tsx'],
    rules: {
      // R3F JSX uses Three.js props, not DOM attributes; the official R3F plugin does not replace this rule.
      'react/no-unknown-property': 'off',
    },
  },
  {
    ignores: ['dist/*'],
  },
]);
