import { useState, useEffect } from 'react';

const useFetchData = (url) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const accessToken = localStorage.getItem('token');
        const headers = {};

        if (accessToken && accessToken !== 'null' && accessToken !== 'undefined') {
          headers.Authorization = `Bearer ${accessToken}`;
        }

        const res = await fetch(url, { headers });
        const result = await res.json();

        if (!res.ok) {
          if (res.status === 401) {
            // Clean up stale or expired credentials from previous sessions
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('role');
            if (window.location.pathname.includes('/profile/me')) {
              window.location.href = '/login';
            }
          }
          throw new Error(result.message || 'Failed to fetch data');
        }

        if (isMounted) {
          setData(result.data !== undefined ? result.data : result);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setLoading(false);
          setError(err.message || 'Network error');
        }
      }
    };

    if (url) {
      fetchData();
    }

    return () => {
      isMounted = false;
    };
  }, [url]);

  return { data, loading, error };
};

export default useFetchData;
