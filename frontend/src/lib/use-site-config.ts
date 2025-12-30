/**
 * Hook to use the site configuration in React components
 */
'use client';

import { useEffect, useState } from 'react';
import { fetchSiteConfig, SiteConfig } from './config-client';

export function useSiteConfig() {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        setLoading(true);
        const fetchedConfig = await fetchSiteConfig();
        setConfig(fetchedConfig);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setConfig(null);
      } finally {
        setLoading(false);
      }
    };

    loadConfig();
  }, []);

  return { config, loading, error };
}
