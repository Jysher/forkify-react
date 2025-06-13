import { useEffect, useState } from 'react';

function useFetch<T>(url: string): T | Error {
  const [data, setData] = useState<T | null>(null);

  useEffect(() => {
    let ignore = false;
    const fetchData = async () => {
      try {
        const res = await fetch(url);
        const data = await res.json();
        if (!ignore) {
          setData(data);
        }
      } catch {
        setData(null);
      }
    };

    fetchData();
    return () => {
      ignore = true;
    };
  }, [url]);

  if (data === null) return new Error('Could not fetch data...');
  return data;
}

export default useFetch;
