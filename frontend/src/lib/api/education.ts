/**
 * API Service Layer - Education Endpoints
 */

import { apiClient } from '../api-client';
import type {
  Education,
  PaginatedEducation,
  EducationFilters,
} from '@/types/api.types';

/**
 * Education API Service
 */
export const educationApi = {
  /**
   * Get all education records
   */
  list: (params?: EducationFilters) =>
    apiClient.get<PaginatedEducation>('/education/', params),

  /**
   * Get education by slug
   */
  get: (slug: string) =>
    apiClient.get<Education>(`/education/${slug}/`),
};
