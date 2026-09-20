import { useSyncExternalStore } from 'react';

const noop = () => () => {};

export function useMediaQuery(query) {
  const subscribe = (onChange) => {
    if (typeof window === 'undefined' || !window.matchMedia) return noop();
    const mql = window.matchMedia(query);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  };
  const get = () =>
    typeof window !== 'undefined' && window.matchMedia ? window.matchMedia(query).matches : false;

  return useSyncExternalStore(subscribe, get, () => false);
}

/** Desktop-class pointer: gates the cursor, magnetics and hover-only affordances. */
export function useFinePointer() {
  return useMediaQuery('(hover: hover) and (pointer: fine)');
}

export function useIsMobile() {
  return useMediaQuery('(max-width: 767px)');
}
