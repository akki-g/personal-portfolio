import { useEffect, useState } from 'react';
import apiClient from '../pages/AxiosInstance';
import { links } from '../content';

export const apiOrigin = new URL(apiClient.defaults.baseURL).origin;

// The résumé file is managed in Django admin; fall back to the known path if the API is unreachable.
function useResumeUrl() {
  const [url, setUrl] = useState(links.resume);

  useEffect(() => {
    let cancelled = false;
    apiClient.get('about/')
      .then(({ data }) => {
        const path = data?.[0]?.resume;
        if (!cancelled && path) setUrl(new URL(path, apiOrigin).href);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  return url;
}

export default useResumeUrl;
