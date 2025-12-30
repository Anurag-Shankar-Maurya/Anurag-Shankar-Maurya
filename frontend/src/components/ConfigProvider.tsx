/**
 * Config Provider Component
 * Fetches and applies site configuration on the client side
 * Allows for dynamic theme changes and config updates
 */
'use client';

import { useEffect, createContext, useContext, useState, useCallback, useRef } from 'react';
import { fetchSiteConfig, clearConfigCache, SiteConfig } from '@/lib/config-client';

// Context for sharing config across components
interface ConfigContextType {
  config: SiteConfig | null;
  reapplyConfig: () => void;
}

const ConfigContext = createContext<ConfigContextType>({
  config: null,
  reapplyConfig: () => {},
});

export const useBackendConfig = () => useContext(ConfigContext);

export function ConfigProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const configRef = useRef<SiteConfig | null>(null);

  // Function to apply config to DOM
  const applyConfigToDOM = useCallback((configData: SiteConfig) => {
    const root = document.documentElement;

    // Apply theme colors and styles
    if (configData.style) {
      root.setAttribute('data-brand', configData.style.brand);
      root.setAttribute('data-accent', configData.style.accent);
      root.setAttribute('data-neutral', configData.style.neutral);
      root.setAttribute('data-solid', configData.style.solid);
      root.setAttribute('data-solid-style', configData.style.solidStyle);
      root.setAttribute('data-border', configData.style.border);
      root.setAttribute('data-surface', configData.style.surface);
      root.setAttribute('data-transition', configData.style.transition);
      root.setAttribute('data-scaling', configData.style.scaling);
    }
  }, []);

  // Function to reapply config (called after theme toggle)
  const reapplyConfig = useCallback(() => {
    if (configRef.current) {
      applyConfigToDOM(configRef.current);
      console.log('✓ Backend config reapplied after theme change');
    }
  }, [applyConfigToDOM]);

  useEffect(() => {
    // Fetch config and apply it
    const loadConfig = async () => {
      try {
        const fetchedConfig = await fetchSiteConfig();
        setConfig(fetchedConfig);
        configRef.current = fetchedConfig;
        applyConfigToDOM(fetchedConfig);

        // Apply theme
        if (fetchedConfig.style?.theme) {
          const resolveTheme = (themeValue: string) => {
            if (!themeValue || themeValue === 'system') {
              return typeof window !== 'undefined' &&
                window.matchMedia('(prefers-color-scheme: dark)').matches
                ? 'dark'
                : 'light';
            }
            return themeValue;
          };

          const savedTheme = localStorage.getItem('data-theme');
          const themeToApply = savedTheme || fetchedConfig.style.theme;
          const resolvedTheme = resolveTheme(themeToApply);
          document.documentElement.setAttribute('data-theme', resolvedTheme);
        }

        console.log('✓ Site configuration applied from backend');
      } catch (error) {
        console.warn('Failed to apply config from backend:', error);
      }
    };

    loadConfig();

    // Watch for theme changes and reapply backend config
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.attributeName === 'data-theme' && configRef.current) {
          // Small delay to let theme change complete, then reapply our config
          setTimeout(() => {
            if (configRef.current) {
              applyConfigToDOM(configRef.current);
              console.log('✓ Backend config reapplied (MutationObserver)');
            }
          }, 50);
        }
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    // Re-fetch config every 5 minutes
    const interval = setInterval(() => {
      clearConfigCache();
      loadConfig();
    }, 5 * 60 * 1000);

    return () => {
      observer.disconnect();
      clearInterval(interval);
    };
  }, [applyConfigToDOM]);

  return (
    <ConfigContext.Provider value={{ config, reapplyConfig }}>
      {children}
    </ConfigContext.Provider>
  );
}
