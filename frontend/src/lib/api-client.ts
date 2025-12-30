/**
 * API Configuration and Base Client
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
const API_BASE_PATH = process.env.NEXT_PUBLIC_API_BASE_PATH || '/api';
const API_TIMEOUT = parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '10000', 10);

export const API_CONFIG = {
  baseURL: `${API_URL}${API_BASE_PATH}`,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
};

/**
 * Custom error class for API errors
 */
export class APIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public data?: any
  ) {
    super(message);
    this.name = 'APIError';
  }
}

/**
 * Convert object to query string
 */
function buildQueryString(params?: Record<string, any>): string {
  if (!params) return '';
  
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        value.forEach((v) => searchParams.append(key, String(v)));
      } else {
        searchParams.append(key, String(value));
      }
    }
  });
  
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}

/**
 * Base fetch wrapper with error handling and timeout
 */
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);

  const url = `${API_CONFIG.baseURL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...API_CONFIG.headers,
        ...options.headers,
      },
      signal: controller.signal,
      credentials: 'include', // For cookie-based auth
    });

    clearTimeout(timeoutId);

    // Handle empty responses
    if (response.status === 204) {
      return {} as T;
    }

    const data = await response.json();

    if (!response.ok) {
      throw new APIError(
        data.detail || data.message || 'API request failed',
        response.status,
        data
      );
    }

    return data;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof APIError) {
      throw error;
    }

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new APIError('Request timeout', 408);
      }
      throw new APIError(error.message);
    }

    throw new APIError('Unknown error occurred');
  }
}

/**
 * API Client with common HTTP methods
 */
export const apiClient = {
  /**
   * GET request
   */
  get: <T>(endpoint: string, params?: Record<string, any>): Promise<T> => {
    const queryString = buildQueryString(params);
    return apiFetch<T>(`${endpoint}${queryString}`, {
      method: 'GET',
    });
  },

  /**
   * POST request
   */
  post: <T>(endpoint: string, data?: any): Promise<T> => {
    return apiFetch<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * PUT request
   */
  put: <T>(endpoint: string, data?: any): Promise<T> => {
    return apiFetch<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  /**
   * PATCH request
   */
  patch: <T>(endpoint: string, data?: any): Promise<T> => {
    return apiFetch<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  /**
   * DELETE request
   */
  delete: <T>(endpoint: string): Promise<T> => {
    return apiFetch<T>(endpoint, {
      method: 'DELETE',
    });
  },

  /**
   * POST request with FormData (for file uploads)
   */
  postFormData: <T>(endpoint: string, formData: FormData): Promise<T> => {
    return apiFetch<T>(endpoint, {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set Content-Type for FormData
    });
  },
};

/**
 * Helper function for client-side data fetching with error handling
 */
export async function fetchWithErrorHandling<T>(
  fetchFn: () => Promise<T>,
  onError?: (error: APIError) => void
): Promise<T | null> {
  try {
    return await fetchFn();
  } catch (error) {
    if (error instanceof APIError) {
      console.error('API Error:', error.message, error.status, error.data);
      onError?.(error);
    } else {
      console.error('Unexpected error:', error);
    }
    return null;
  }
}

/**
 * Server-side fetch options for Next.js
 */
export const serverFetchOptions = {
  // Revalidate every hour
  revalidate: 3600,
};

/**
 * No-cache fetch options for dynamic data
 */
export const dynamicFetchOptions = {
  cache: 'no-store' as const,
};
