import { useSyncExternalStore } from 'react';

/* export function useLocationHash() {
  const [locationHash, setLocationHash] = useState<string>('');

  useEffect(() => {
    const handler = () => {
      setLocationHash(prev => {
        const newHash = window.location.hash;
        if (prev !== newHash) {
          return newHash;
        }
        return prev;
      });
    };
    window.addEventListener('hashchange', handler);
    return () => {
      window.removeEventListener('hashchange', handler);
    };
  }, []);

  return locationHash;
} */

export function useLocationHash() {
  const locationHash = useSyncExternalStore(subscribe, getSnapshot);
  return locationHash;
}

function subscribe(callback: () => void) {
  window.addEventListener('hashchange', callback);
  return () => {
    window.removeEventListener('hashchange', callback);
  };
}

function getSnapshot() {
  return window.location.hash;
}
