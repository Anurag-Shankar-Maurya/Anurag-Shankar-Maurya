
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface Image {
  id: number;
  image_url: string;
  data_uri: string;
  alt_text: string;
  caption?: string;
  show_on_home?: boolean;
}

export interface SocialLink {
  id: number;
  platform: string;
  url: string;
  icon?: string;
  show_on_home?: boolean;
}

export interface Skill {
  id: number;
  name: string;
  slug: string;
  skill_type: string;
  proficiency: string;
  icon?: string;
  show_on_home?: boolean;
}

export interface ProfileDetail {
  id: number;
  full_name: string;
  headline: string;
  bio: string;
  profile_image: string;
  email: string;
  phone: string;
  location: string;
  years_of_experience: number;
  current_role: string;
  current_company: string;
  available_for_hire: boolean;
  resume_url: string;
  social_links: SocialLink[];
  skills: Skill[];
  images: Image[];
}

export interface Project {
  id: number;
  title: string;
  slug: string;
  short_description: string;
  description?: string;
  featured_image: string;
  featured_image_alt: string;
  live_url?: string;
  github_url?: string;
  demo_url?: string;
  technologies: string;
  status: 'in-progress' | 'completed' | 'on-hold' | 'archived';
  is_featured: boolean;
  show_on_home?: boolean;
  start_date?: string;
  end_date?: string;
  images?: Image[];
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: string;
  images?: Image[];
  published_at: string;
  reading_time: number;
  category: { name: string; slug: string; show_on_home?: boolean };
  tags: { name: string; slug: string; show_on_home?: boolean }[];
  author: string;
  show_on_home?: boolean;
}

export interface WorkExperience {
  id: number;
  company_name: string;
  company_logo: string;
  job_title: string;
  start_date: string;
  end_date?: string;
  is_current: boolean;
  description: string;
  employment_type: string;
  work_mode: string;
  location: string;
  technologies_used: string;
  images?: Image[];
  show_on_home?: boolean;
}

export interface Education {
  id: number;
  institution: string;
  degree: string;
  field_of_study: string;
  start_date: string;
  end_date?: string;
  is_current: boolean;
  logo: string;
  description: string;
  slug: string;
  images?: Image[];
  show_on_home?: boolean;
}

export interface Certificate {
  id: number;
  title: string;
  issuing_organization: string;
  issue_date: string;
  credential_url: string;
  certificate_image: string;
  skills: string;
  slug: string;
  images?: Image[];
  show_on_home?: boolean;
}

export interface Achievement {
  id: number;
  slug: string;
  title: string;
  achievement_type: string;
  issuer: string;
  date: string;
  description: string;
  url: string;
  image: string;
  images?: Image[];
  show_on_home?: boolean;
}

export interface Testimonial {
  id: number;
  slug: string;
  author_name: string;
  author_title: string;
  author_company: string;
  author_image: string;
  content: string;
  rating: number;
  relationship: string;
  linkedin_url: string;
  images?: Image[];
  show_on_home?: boolean;
}

export type ViewState = 
  | { type: 'HOME' }
  | { type: 'PROJECTS' }
  | { type: 'PROJECT_DETAIL'; slug: string }
  | { type: 'BLOG' }
  | { type: 'BLOG_DETAIL'; slug: string }
  | { type: 'ABOUT' }
  | { type: 'CONTACT' }
  | { type: 'EXPERIENCE' }
  | { type: 'EXPERIENCE_DETAIL'; id: number }
  | { type: 'EDUCATION' }
  | { type: 'EDUCATION_DETAIL'; slug: string }
  | { type: 'SKILLS' }
  | { type: 'SKILL_DETAIL'; slug: string }
  | { type: 'AWARDS_CERTS' }
  | { type: 'CERTIFICATE_DETAIL'; slug: string }
  | { type: 'ACHIEVEMENT_DETAIL'; slug: string }
  | { type: 'TESTIMONIALS' }
  | { type: 'TESTIMONIAL_DETAIL'; slug: string };
