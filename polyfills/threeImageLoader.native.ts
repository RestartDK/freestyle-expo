/**
 * THREE.TextureLoader uses ImageLoader, which assigns `img.src` — DOM Image is not available in RN.
 * Patch ImageLoader to load via fetch + createImageBitmap (same strategy as ImageBitmapLoader).
 */
import * as THREE from 'three';

const proto = THREE.ImageLoader.prototype;

proto.load = function load(
  this: THREE.ImageLoader,
  url: string,
  onLoad?: (image: HTMLImageElement | ImageBitmap) => void,
  onProgress?: (event: ProgressEvent) => void,
  onError?: (err: unknown) => void,
) {
  if (this.path !== undefined) url = this.path + url;
  url = this.manager.resolveURL(url);

  const cached = THREE.Cache.get(url);
  if (cached !== undefined) {
    this.manager.itemStart(url);
    setTimeout(() => {
      if (onLoad) onLoad(cached);
      this.manager.itemEnd(url);
    }, 0);
    return cached;
  }

  if (typeof createImageBitmap !== 'function') {
    const err = new Error(
      '[TestScene] global createImageBitmap is missing; Hermes/RN needs it for GLTF textures. Try a newer RN/Hermes or report this environment.',
    );
    if (onError) onError(err);
    this.manager.itemError(url);
    this.manager.itemEnd(url);
    return undefined as unknown as HTMLImageElement;
  }

  const scope = this;
  scope.manager.itemStart(url);

  fetch(url)
    .then((res) => {
      if (!res.ok) throw new Error(`ImageLoader: ${res.status} ${res.statusText}`);
      return res.blob();
    })
    .then((blob) => createImageBitmap(blob))
    .then((imageBitmap) => {
      THREE.Cache.add(url, imageBitmap);
      if (onLoad) onLoad(imageBitmap);
      scope.manager.itemEnd(url);
    })
    .catch((err) => {
      if (onError) onError(err);
      scope.manager.itemError(url);
      scope.manager.itemEnd(url);
    });

  return undefined as unknown as HTMLImageElement;
} as THREE.ImageLoader['load'];
