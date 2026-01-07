'use client';

import { RefObject, useEffect } from 'react';

type Params = {
  enabled?: boolean;
  target: RefObject<Element | null>;
  onIntersect: () => void;
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
};

export function useIntersectionObserver({
  enabled = true,
  target,
  onIntersect,
  root = null,
  rootMargin = '0px',
  threshold = 1.0,
}: Params) {
  useEffect(() => {
    if (!enabled) return;
    const element = target.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) onIntersect();
        });
      },
      { root, rootMargin, threshold },
    );

    observer.observe(element);
    
    return () => observer.disconnect();
  }, [enabled, onIntersect, root, rootMargin, target, threshold]);
}
