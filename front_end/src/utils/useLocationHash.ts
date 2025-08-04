import { useEffect, useState } from 'react';

export function useLocationHash() {
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
}
