// @ts-check
const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');
const { resolve } = require('metro-resolver').default;

const config = getDefaultConfig(__dirname);

config.resolver.assetExts.push('glb', 'gltf');

/** Single `three` entry so @react-three/fiber and expo-gl scenes share one THREE (avoids duplicate warnings). */
const threeModulePath = path.resolve(__dirname, 'node_modules/three/build/three.module.js');
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'three') {
    return {
      filePath: threeModulePath,
      type: 'sourceFile',
    };
  }
  return resolve(context, moduleName, platform);
};

module.exports = config;
