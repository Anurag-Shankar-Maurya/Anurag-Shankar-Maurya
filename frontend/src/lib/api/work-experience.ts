/**
 * API Service Layer - Work Experience Endpoints
 */

import { apiClient } from '../api-client';
import type {
  WorkExperience,
  PaginatedWorkExperience,
  WorkExperienceFilters,
} from '@/types/api.types';

/**
 * Work Experience API Service
 */
export const workExperienceApi = {
  /**
   * Get all work experiences
   */
  list: (params?: WorkExperienceFilters) =>
    apiClient.get<PaginatedWorkExperience>('/work-experience/', params),

  /**
   * Get work experience by ID
   */
  get: (id: number) =>
    apiClient.get<WorkExperience>(`/work-experience/${id}/`),
};
