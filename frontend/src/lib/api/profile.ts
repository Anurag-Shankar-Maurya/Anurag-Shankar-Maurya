/**
 * API Service Layer - Profile Endpoints
 */

import { apiClient } from '../api-client';
import type {
  Profile,
  ProfileDetail,
  PaginatedProfiles,
  PaginationParams,
  SearchParams,
  OrderingParams,
} from '@/types/api.types';

interface ProfileListParams extends PaginationParams, SearchParams, OrderingParams {}

/**
 * Profile API Service
 */
export const profileApi = {
  /**
   * Get all profiles
   */
  list: (params?: ProfileListParams) =>
    apiClient.get<PaginatedProfiles>('/profiles/', params),

  /**
   * Get profile by ID with full details
   */
  get: (id: number) =>
    apiClient.get<ProfileDetail>(`/profiles/${id}/`),

  /**
   * Download resume file
   */
  getResume: (id: number) =>
    apiClient.get<Blob>(`/profiles/${id}/resume/`),
};
