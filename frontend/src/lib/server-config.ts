/**
 * Server-side configuration loader
 * Fetches configuration from the backend API during build/runtime
 */

import { SiteConfig, fetchSiteConfig } from '@/lib/config-client';

// Cache the config during the build/request
let serverConfig: SiteConfig | null = null;

/**
 * Get server-side configuration
 * This should be called during build or at request time
 */
export async function getServerConfig(): Promise<SiteConfig> {
  if (serverConfig) {
    return serverConfig;
  }

  try {
    const config = await fetchSiteConfig();
    serverConfig = config;
    return config;
  } catch (error) {
    console.warn('Failed to fetch server config, using defaults:', error);
    return getDefaultServerConfig();
  }
}

/**
 * Default server configuration (fallback)
 */
export function getDefaultServerConfig(): SiteConfig {
  return {
    site_name: 'Magic Portfolio',
    site_description: 'A portfolio website',
    base_url: 'https://demo.magic-portfolio.com',
    display: {
      location: true,
      time: true,
      themeSwitcher: true,
    },
    style: {
      theme: 'system',
      neutral: 'gray',
      brand: 'cyan',
      accent: 'red',
      solid: 'contrast',
      solidStyle: 'flat',
      border: 'playful',
      surface: 'translucent',
      transition: 'all',
      scaling: '100',
    },
    schema: {
      logo: '',
      type: 'Organization',
      name: 'Magic Portfolio',
      description: 'A portfolio website',
      email: '',
    },
    same_as: {
      threads: 'https://www.threads.com/@once_ui',
      linkedin: 'https://www.linkedin.com/company/once-ui/',
      discord: 'https://discord.com/invite/5EyAQ4eNdS',
    },
    social_sharing: {
      display: true,
      platforms: {
        x: true,
        linkedin: true,
        facebook: false,
        pinterest: false,
        whatsapp: false,
        reddit: false,
        telegram: false,
        email: true,
        copyLink: true,
      },
    },
    protected_routes: [],
    routes: {
      '/': true,
      '/about': true,
      '/work': true,
      '/blog': true,
      '/gallery': true,
    },
  };
}
