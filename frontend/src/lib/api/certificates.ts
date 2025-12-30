/**
 * API Service Layer - Certificate Endpoints
 */

import { apiClient } from '../api-client';
import type {
  Certificate,
  PaginatedCertificates,
  CertificateFilters,
} from '@/types/api.types';

/**
 * Certificates API Service
 */
export const certificatesApi = {
  /**
   * Get all certificates
   */
  list: (params?: CertificateFilters) =>
    apiClient.get<PaginatedCertificates>('/certificates/', params),

  /**
   * Get certificate by ID
   */
  get: (id: number) =>
    apiClient.get<Certificate>(`/certificates/${id}/`),
};
