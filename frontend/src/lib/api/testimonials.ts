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
   * Get testimonial by slug
   */
  get: (slug: string) =>
    apiClient.get<Testimonial>(`/testimonials/${slug}/`),

  /**
   * Get featured testimonials
   */
  getFeatured: () =>
    apiClient.get<Testimonial[]>('/testimonials/featured/'),
};
