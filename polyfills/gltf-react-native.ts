/**
 * GLTFParser (three/examples/jsm/loaders/GLTFLoader) reads `navigator.userAgent` without guarding
 * against it being undefined; Hermes/RN often expose `navigator` with no `userAgent`.
 */
const nav = globalThis.navigator as Navigator | undefined;
if (nav != null && nav.userAgent == null) {
  Object.defineProperty(nav, 'userAgent', {
    value: 'ReactNative',
    configurable: true,
    enumerable: true,
  });
}
