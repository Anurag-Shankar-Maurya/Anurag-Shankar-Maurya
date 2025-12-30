/**
 * Central API Export
 * Import all API services from this file
 */

export { profileApi } from './api/profile';
export { projectsApi } from './api/projects';
export { blogApi } from './api/blog';
export { workExperienceApi } from './api/work-experience';
export { educationApi } from './api/education';
export { certificatesApi } from './api/certificates';
export { achievementsApi } from './api/achievements';
export { testimonialsApi } from './api/testimonials';
export { skillsApi } from './api/skills';
export { socialLinksApi } from './api/social-links';
export { imagesApi } from './api/images';
export { contactApi } from './api/contact';

// Re-export client utilities
export { apiClient, APIError, fetchWithErrorHandling, serverFetchOptions, dynamicFetchOptions } from './api-client';

// Re-export hooks
export { useApi, useLazyApi } from './hooks';

// Re-export utility functions
export * from './api-utils';

// Re-export types
export type * from '@/types/api.types';
