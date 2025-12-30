/**
 * API Service Layer - Testimonial Endpoints
 */

import { apiClient } from '../api-client';
import type {
  Testimonial,
  PaginatedTestimonials,
  TestimonialFilters,
} from '@/types/api.types';

/**
 * Testimonials API Service
 */
export const testimonialsApi = {
  /**
   * Get all testimonials
   */
  list: (params?: TestimonialFilters) =>
    apiClient.get<PaginatedTestimonials>('/testimonials/', params),

  /**
   * Get testimonial by ID
   */
  get: (id: number) =>
    apiClient.get<Testimonial>(`/testimonials/${id}/`),

  /**
   * Get featured testimonials
   */
  getFeatured: () =>
    apiClient.get<Testimonial[]>('/testimonials/featured/'),
};
