/**
 * Config Provider Component
 * Fetches and applies site configuration on the client side
 * Allows for dynamic theme changes and config updates
 */
'use client';

import { useEffect } from 'react';
import { fetchSiteConfig, clearConfigCache } from '@/lib/config-client';

export function ConfigProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Fetch config and apply it
    const applyConfig = async () => {
      try {
        const config = await fetchSiteConfig();

        // Apply style configuration to root element
        const root = document.documentElement;

        // Apply theme colors and styles
        if (config.style) {
          root.setAttribute('data-brand', config.style.brand);
          root.setAttribute('data-accent', config.style.accent);
          root.setAttribute('data-neutral', config.style.neutral);
          root.setAttribute('data-solid', config.style.solid);
          root.setAttribute('data-solid-style', config.style.solidStyle);
          root.setAttribute('data-border', config.style.border);
          root.setAttribute('data-surface', config.style.surface);
          root.setAttribute('data-transition', config.style.transition);
          root.setAttribute('data-scaling', config.style.scaling);
        }

        // Apply theme
        if (config.style?.theme) {
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
          const themeToApply = savedTheme || config.style.theme;
          const resolvedTheme = resolveTheme(themeToApply);
          root.setAttribute('data-theme', resolvedTheme);
        }

        // Log successful config application
        console.log('✓ Site configuration applied from backend');
      } catch (error) {
        console.warn('Failed to apply config from backend:', error);
      }
    };

    applyConfig();

    // Optional: Re-fetch config every 5 minutes to pick up changes
    // (useful if admin makes changes while site is open)
    const interval = setInterval(() => {
      clearConfigCache();
      applyConfig();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return <>{children}</>;
}
