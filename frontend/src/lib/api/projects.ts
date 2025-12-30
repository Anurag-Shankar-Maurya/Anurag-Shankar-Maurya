/**
 * API Service Layer - Project Endpoints
 */

import { apiClient } from '../api-client';
import type {
  Project,
  ProjectDetail,
  PaginatedProjects,
  ProjectFilters,
} from '@/types/api.types';

/**
 * Projects API Service
 */
export const projectsApi = {
  /**
   * Get all visible projects
   */
  list: (params?: ProjectFilters) =>
    apiClient.get<PaginatedProjects>('/projects/', params),

  /**
   * Get project by slug
   */
  get: (slug: string) =>
    apiClient.get<ProjectDetail>(`/projects/${slug}/`),

  /**
   * Get featured projects
   */
  getFeatured: () =>
    apiClient.get<Project[]>('/projects/featured/'),
};
