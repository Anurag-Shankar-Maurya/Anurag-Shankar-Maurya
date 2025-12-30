/**
 * API Service Layer - Achievement Endpoints
 */

import { apiClient } from '../api-client';
import type {
  Achievement,
  PaginatedAchievements,
  AchievementFilters,
} from '@/types/api.types';

/**
 * Achievements API Service
 */
export const achievementsApi = {
  /**
   * Get all achievements
   */
  list: (params?: AchievementFilters) =>
    apiClient.get<PaginatedAchievements>('/achievements/', params),

  /**
   * Get achievement by ID
   */
  get: (id: number) =>
    apiClient.get<Achievement>(`/achievements/${id}/`),
};
