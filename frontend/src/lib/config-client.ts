/**
 * Fetches site configuration from the backend API
 * This allows the frontend configuration to be managed from the Django admin
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const API_BASE_PATH = process.env.NEXT_PUBLIC_API_BASE_PATH || '/api';

export interface SiteConfig {
  site_name: string;
  site_description: string;
  base_url: string;
  display: {
    location: boolean;
    time: boolean;
    themeSwitcher: boolean;
  };
  style: {
    theme: 'dark' | 'light' | 'system';
    neutral: string;
    brand: string;
    accent: string;
    solid: string;
    solidStyle: string;
    border: string;
    surface: string;
    transition: string;
    scaling: string;
    'viz-style': string;
  };
  schema: {
    logo: string;
    type: string;
    name: string;
    description: string;
    email: string;
  };
  same_as: Record<string, string>;
  social_sharing: {
    display: boolean;
    platforms: Record<string, boolean>;
  };
  protected_routes: string[];
  routes: Record<string, boolean>;
}

let cachedConfig: SiteConfig | null = null;

/**
 * Fetch site configuration from the backend API
 */
export async function fetchSiteConfig(): Promise<SiteConfig> {
  // Return cached config if available
  if (cachedConfig) {
    return cachedConfig;
  }

  try {
    const url = `${API_BASE_URL}${API_BASE_PATH}/config/current/`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Disable caching for fresh data
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch config: ${response.status}`);
    }

    const config: SiteConfig = await response.json();
    cachedConfig = config;
    return config;
  } catch (error) {
    console.error('Error fetching site configuration:', error);
    // Return a default configuration as fallback
    return getDefaultConfig();
  }
}

/**
 * Get default configuration (fallback)
 */
function getDefaultConfig(): SiteConfig {
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
      'viz-style': 'gradient',
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

/**
 * Clear the cached configuration (useful for hot-reloading or updates)
 */
export function clearConfigCache(): void {
  cachedConfig = null;
}
