// Cache preloaded HTMLImageElements for instantaneous canvas rendering

const imageCache = new Map<string, HTMLImageElement>();
const loadingPromises = new Map<string, Promise<HTMLImageElement>>();

export function getCachedImage(url: string): HTMLImageElement | null {
  const cached = imageCache.get(url);
  if (cached && cached.complete && cached.naturalWidth > 0) {
    return cached;
  }
  return null;
}

export function preloadImage(url: string): Promise<HTMLImageElement> {
  if (imageCache.has(url)) {
    const img = imageCache.get(url)!;
    if (img.complete && img.naturalWidth > 0) {
      return Promise.resolve(img);
    }
  }

  if (loadingPromises.has(url)) {
    return loadingPromises.get(url)!;
  }

  const promise = new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imageCache.set(url, img);
      loadingPromises.delete(url);
      resolve(img);
    };
    img.onerror = (err) => {
      loadingPromises.delete(url);
      reject(err);
    };
    img.src = url;
  });

  loadingPromises.set(url, promise);
  return promise;
}

export function preloadAllImages(urls: string[]): Promise<HTMLImageElement[]> {
  return Promise.all(urls.map((url) => preloadImage(url).catch(() => new Image())));
}
