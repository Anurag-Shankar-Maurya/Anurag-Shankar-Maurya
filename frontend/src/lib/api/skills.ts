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
  list: (params?: SkillFilters) =>
    apiClient.get<PaginatedSkills>('/skills/', params),

  /**
   * Get skill by ID
   */
  get: (id: number) =>
    apiClient.get<Skill>(`/skills/${id}/`),
};
