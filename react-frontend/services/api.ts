
import { 
  PaginatedResponse, 
  ProfileDetail, 
  Project, 
  BlogPost, 
  WorkExperience, 
  Education, 
  Certificate, 
  Achievement, 
  Testimonial, 
  Skill
} from '../types';

// Use Vite environment variables when available (set in `.env.local`).
// - VITE_API_URL (e.g. http://127.0.0.1:8000)
// - VITE_API_BASE_PATH (e.g. /api)
// Fallback to sensible defaults when variables are not provided.
const API_URL = (import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000').replace(/\/+$/,'');
const API_BASE_PATH = (import.meta.env.VITE_API_BASE_PATH ?? '/api').replace(/^\/?/, '/').replace(/\/+$/,'');
const API_BASE_URL = `${API_URL}${API_BASE_PATH}`;

async function fetchJson<T>(endpoint: string, params: Record<string, any> = {}): Promise<T> {
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== null) {
      url.searchParams.append(key, String(params[key]));
    }
  });

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }
  return response.json();
}

export const api = {
  getProfiles: () => fetchJson<PaginatedResponse<{id: number}>>('/profiles/'),
  getProfileDetail: (id: number) => fetchJson<ProfileDetail>(`/profiles/${id}/`),
  
  getProjects: (params: { featured?: boolean; page?: number; show_on_home?: boolean } = {}) => 
    fetchJson<PaginatedResponse<Project>>('/projects/', { is_featured: params.featured ? 'true' : undefined, show_on_home: params.show_on_home ? 'true' : undefined, page: params.page }),
  getProjectDetail: (slug: string) => fetchJson<Project>(`/projects/${slug}/`),

  getBlogPosts: (params: { featured?: boolean; page?: number; show_on_home?: boolean } = {}) => 
    fetchJson<PaginatedResponse<BlogPost>>('/blog/', { is_featured: params.featured ? 'true' : undefined, show_on_home: params.show_on_home ? 'true' : undefined, page: params.page }),
  getBlogPostDetail: (slug: string) => fetchJson<BlogPost>(`/blog/${slug}/`),

  getExperience: (params: { show_on_home?: boolean; page?: number } = {}) => fetchJson<PaginatedResponse<WorkExperience>>('/work-experience/', { show_on_home: params.show_on_home ? 'true' : undefined, ordering: '-start_date', page: params.page }),
  getExperienceDetail: (id: number) => fetchJson<WorkExperience>(`/work-experience/${id}/`),

  getEducation: (params: { show_on_home?: boolean; page?: number } = {}) => fetchJson<PaginatedResponse<Education>>('/education/', { show_on_home: params.show_on_home ? 'true' : undefined, ordering: '-start_date', page: params.page }),
  getEducationDetail: (slug: string) => fetchJson<Education>(`/education/${slug}/`),

  getCertificates: (params: { show_on_home?: boolean; page?: number } = {}) => fetchJson<PaginatedResponse<Certificate>>('/certificates/', { show_on_home: params.show_on_home ? 'true' : undefined, ordering: '-issue_date', page: params.page }),
  getCertificateDetail: (slug: string) => fetchJson<Certificate>(`/certificates/${slug}/`),

  getAchievements: (params: { show_on_home?: boolean; page?: number } = {}) => fetchJson<PaginatedResponse<Achievement>>('/achievements/', { show_on_home: params.show_on_home ? 'true' : undefined, ordering: '-date', page: params.page }),
  getAchievementDetail: (slug: string) => fetchJson<Achievement>(`/achievements/${slug}/`),

  getTestimonials: (params: { featured?: boolean; show_on_home?: boolean; page?: number } = {}) => fetchJson<PaginatedResponse<Testimonial>>('/testimonials/', { is_featured: (params.featured ?? true) ? 'true' : undefined, show_on_home: params.show_on_home ? 'true' : undefined, page: params.page }),
  getTestimonialDetail: (slug: string) => fetchJson<Testimonial>(`/testimonials/${slug}/`),
  
  // Fetch all skills for the mega menu
  getSkills: (params: { show_on_home?: boolean; page?: number } = {}) => fetchJson<PaginatedResponse<Skill>>('/skills/', { show_on_home: params.show_on_home ? 'true' : undefined, page: params.page }),
  getSkillDetail: (slug: string) => fetchJson<Skill>(`/skills/${slug}/`),

  sendContact: async (data: { name: string; email: string; subject: string; message: string; phone?: string }) => {
    const response = await fetch(`${API_BASE_URL}/contact/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to send message');
    return response.json();
  }
};
