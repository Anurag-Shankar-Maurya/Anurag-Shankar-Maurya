/**
 * API Service Layer - Social Link Endpoints
 */

import { apiClient } from '../api-client';
import type {
  SocialLink,
  PaginatedSocialLinks,
  SocialLinkFilters,
} from '@/types/api.types';

/**
 * Social Links API Service
 */
export const socialLinksApi = {
  /**
   * Get all social links
   */
  list: (params?: SocialLinkFilters) =>
    apiClient.get<PaginatedSocialLinks>('/social-links/', params),

  /**
   * Get social link by ID
   */
  get: (id: number) =>
    apiClient.get<SocialLink>(`/social-links/${id}/`),
};
