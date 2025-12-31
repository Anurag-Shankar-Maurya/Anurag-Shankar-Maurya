
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

const API_BASE_URL = 'http://127.0.0.1:8000/api';

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
  
  getProjects: (params: { featured?: boolean; page?: number } = {}) => 
    fetchJson<PaginatedResponse<Project>>('/projects/', { is_featured: params.featured, page: params.page }),
  getProjectDetail: (slug: string) => fetchJson<Project>(`/projects/${slug}/`),

  getBlogPosts: (params: { featured?: boolean; page?: number } = {}) => 
    fetchJson<PaginatedResponse<BlogPost>>('/blog/', { is_featured: params.featured, page: params.page }),
  getBlogPostDetail: (slug: string) => fetchJson<BlogPost>(`/blog/${slug}/`),

  getExperience: () => fetchJson<PaginatedResponse<WorkExperience>>('/work-experience/', { ordering: '-start_date' }),
  getExperienceDetail: (id: number) => fetchJson<WorkExperience>(`/work-experience/${id}/`),

  getEducation: () => fetchJson<PaginatedResponse<Education>>('/education/', { ordering: '-start_date' }),
  getEducationDetail: (slug: string) => fetchJson<Education>(`/education/${slug}/`),

  getCertificates: () => fetchJson<PaginatedResponse<Certificate>>('/certificates/', { ordering: '-issue_date' }),
  getCertificateDetail: (slug: string) => fetchJson<Certificate>(`/certificates/${slug}/`),

  getAchievements: () => fetchJson<PaginatedResponse<Achievement>>('/achievements/', { ordering: '-date' }),
  getAchievementDetail: (slug: string) => fetchJson<Achievement>(`/achievements/${slug}/`),

  getTestimonials: () => fetchJson<PaginatedResponse<Testimonial>>('/testimonials/', { is_featured: true }),
  getTestimonialDetail: (slug: string) => fetchJson<Testimonial>(`/testimonials/${slug}/`),
  
  // Fetch all skills for the mega menu
  getSkills: () => fetchJson<PaginatedResponse<Skill>>('/skills/'),
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
