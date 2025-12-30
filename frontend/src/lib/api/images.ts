/**
 * API Service Layer - Image/Gallery Endpoints
 */

import { apiClient } from '../api-client';
import type {
  Image,
  PaginatedImages,
  ImageFilters,
} from '@/types/api.types';

/**
 * Images API Service
 */
export const imagesApi = {
  /**
   * Get all gallery images
   */
  list: (params?: ImageFilters) =>
    apiClient.get<PaginatedImages>('/images/', params),

  /**
   * Get image by ID
   */
  get: (id: number) =>
    apiClient.get<Image>(`/images/${id}/`),
};
