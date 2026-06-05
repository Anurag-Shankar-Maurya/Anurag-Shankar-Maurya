/**
 * API Service Layer - Skill Endpoints
 */

import { apiClient } from '../api-client';
import type {
  Skill,
  PaginatedSkills,
  SkillFilters,
} from '@/types/api.types';

/**
 * Skills API Service
 */
export const skillsApi = {
  /**
   * Get all skills
   */
  list: (params?: SkillFilters & { limit?: number }) =>
    apiClient.get<PaginatedSkills>('/skills/', params),

  /**
   * Get skill by slug
   */
  get: (slug: string) =>
    apiClient.get<Skill>(`/skills/${slug}/`),
};
