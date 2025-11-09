// Image optimization utilities

/**
 * Generates optimized avatar URL with lazy loading
 */
export const getOptimizedAvatarUrl = (name: string, size: number = 40): string => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=${size}&background=random&format=svg`;
};

/**
 * Lazy load images with intersection observer
 */
export const lazyLoadImage = (img: HTMLImageElement) => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target as HTMLImageElement;
        if (target.dataset.src) {
          target.src = target.dataset.src;
          target.removeAttribute('data-src');
          observer.unobserve(target);
        }
      }
    });
  });
  
  observer.observe(img);
  return observer;
};

/**
 * Preload critical images
 */
export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
};

/**
 * Generate responsive image srcset
 */
export const generateSrcSet = (baseUrl: string, sizes: number[]): string => {
  return sizes.map(size => `${baseUrl}?w=${size} ${size}w`).join(', ');
};
