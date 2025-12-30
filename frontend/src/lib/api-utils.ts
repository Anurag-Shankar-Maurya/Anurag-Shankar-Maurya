/**
 * API Utility Functions
 * Helper functions for common API operations
 */

import type {
  PaginatedResponse,
  ProjectFilters,
  BlogFilters,
  WorkExperienceFilters,
} from '@/types/api.types';

/**
 * Extract all results from paginated responses
 * Automatically fetches all pages and combines results
 */
export async function fetchAllPages<T>(
  fetchFn: (page: number) => Promise<PaginatedResponse<T>>
): Promise<T[]> {
  const allResults: T[] = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const response = await fetchFn(page);
    allResults.push(...response.results);
    hasMore = !!response.next;
    page++;
  }

  return allResults;
}

/**
 * Get image URL or fallback
 */
export function getImageUrl(imageUrl: string | undefined, fallback: string = '/images/placeholder.png'): string {
  return imageUrl || fallback;
}

/**
 * Parse technologies string into array
 */
export function parseTechnologies(technologies: string): string[] {
  return technologies.split(',').map(tech => tech.trim()).filter(Boolean);
}

/**
 * Format date to readable string
 */
export function formatDate(dateString: string | null | undefined, locale: string = 'en-US'): string {
  if (!dateString) return 'Present';
  return new Date(dateString).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
  });
}

/**
 * Calculate duration between two dates
 */
export function calculateDuration(startDate: string, endDate: string | null): string {
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date();
  
  const months = (end.getFullYear() - start.getFullYear()) * 12 + 
                 (end.getMonth() - start.getMonth());
  
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  
  if (years === 0) {
    return `${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
  }
  
  if (remainingMonths === 0) {
    return `${years} year${years !== 1 ? 's' : ''}`;
  }
  
  return `${years} year${years !== 1 ? 's' : ''} ${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
}

/**
 * Build filter query for projects
 */
export function buildProjectFilters(options: {
  featured?: boolean;
  status?: string;
  search?: string;
  showOnHome?: boolean;
}): ProjectFilters {
  const filters: ProjectFilters = {
    ordering: '-created_at',
  };

  if (options.featured !== undefined) {
    filters.is_featured = options.featured;
  }
  
  if (options.status) {
    filters.status = options.status as any;
  }
  
  if (options.search) {
    filters.search = options.search;
  }
  
  if (options.showOnHome !== undefined) {
    filters.show_on_home = options.showOnHome;
  }

  return filters;
}

/**
 * Build filter query for blog posts
 */
export function buildBlogFilters(options: {
  featured?: boolean;
  category?: number;
  tags?: number[];
  search?: string;
  showOnHome?: boolean;
}): BlogFilters {
  const filters: BlogFilters = {
    ordering: '-published_at',
  };

  if (options.featured !== undefined) {
    filters.is_featured = options.featured;
  }
  
  if (options.category) {
    filters.category = options.category;
  }
  
  if (options.tags) {
    filters.tags = options.tags;
  }
  
  if (options.search) {
    filters.search = options.search;
  }
  
  if (options.showOnHome !== undefined) {
    filters.show_on_home = options.showOnHome;
  }

  return filters;
}

/**
 * Build filter query for work experience
 */
export function buildWorkExperienceFilters(options: {
  current?: boolean;
  employmentType?: string;
  workMode?: string;
  showOnHome?: boolean;
}): WorkExperienceFilters {
  const filters: WorkExperienceFilters = {
    ordering: '-start_date',
  };

  if (options.current !== undefined) {
    filters.is_current = options.current;
  }
  
  if (options.employmentType) {
    filters.employment_type = options.employmentType as any;
  }
  
  if (options.workMode) {
    filters.work_mode = options.workMode as any;
  }
  
  if (options.showOnHome !== undefined) {
    filters.show_on_home = options.showOnHome;
  }

  return filters;
}

/**
 * Group items by a key
 */
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((result, item) => {
    const groupKey = String(item[key]);
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {} as Record<string, T[]>);
}

/**
 * Sort items by order field
 */
export function sortByOrder<T extends { order: number }>(items: T[]): T[] {
  return [...items].sort((a, b) => a.order - b.order);
}

/**
 * Check if image is base64 data URI
 */
export function isDataURI(url: string): boolean {
  return url.startsWith('data:');
}

/**
 * Convert base64 to blob URL
 */
export function dataURItoBlob(dataURI: string): string {
  if (!isDataURI(dataURI)) return dataURI;
  
  try {
    const [header, data] = dataURI.split(',');
    const mime = header.match(/:(.*?);/)?.[1] || 'image/png';
    const binary = atob(data);
    const array = new Uint8Array(binary.length);
    
    for (let i = 0; i < binary.length; i++) {
      array[i] = binary.charCodeAt(i);
    }
    
    const blob = new Blob([array], { type: mime });
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error('Failed to convert data URI:', error);
    return dataURI;
  }
}

/**
 * Truncate text to specified length
 */
export function truncateText(text: string, maxLength: number, suffix: string = '...'): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - suffix.length) + suffix;
}

/**
 * Generate SEO-friendly slug from text
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Calculate reading time for text
 */
export function calculateReadingTime(text: string, wordsPerMinute: number = 200): number {
  const words = text.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}
