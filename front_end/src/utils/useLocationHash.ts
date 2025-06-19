import { useSyncExternalStore } from 'react';

export function useLocationHash() {
  const hash = useSyncExternalStore(subscribe, getSnapshot);
  return hash;
}

function getSnapshot() {
  return window.location.hash;
}

function subscribe(callback: () => void) {
  window.addEventListener('hashchange', callback);
  return () => {
    window.removeEventListener('hashchange', callback);
  };
}
