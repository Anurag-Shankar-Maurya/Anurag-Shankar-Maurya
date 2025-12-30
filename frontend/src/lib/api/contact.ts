/**
 * API Service Layer - Contact Form Endpoints
 */

import { apiClient } from '../api-client';
import type { ContactMessage } from '@/types/api.types';

/**
 * Contact API Service
 */
export const contactApi = {
  /**
   * Submit contact form
   */
  submit: (data: ContactMessage) =>
    apiClient.post<ContactMessage>('/contact/', data),
};
