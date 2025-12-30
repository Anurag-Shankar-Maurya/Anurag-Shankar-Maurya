/**
 * Auto-generated TypeScript types from OpenAPI specification
 * Portfolio API v1.0.0
 */

// Enums
export type AchievementType = 'award' | 'honor' | 'recognition' | 'publication' | 'patent' | 'speaker' | 'other';
export type BlogStatus = 'draft' | 'published' | 'scheduled' | 'archived';
export type ProjectStatus = 'in-progress' | 'completed' | 'on-hold' | 'archived';
export type EmploymentType = 'full-time' | 'part-time' | 'contract' | 'freelance' | 'internship' | 'volunteer';
export type WorkMode = 'onsite' | 'remote' | 'hybrid';
export type ProficiencyLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';
export type SkillType = 'technical' | 'soft' | 'tool' | 'language' | 'framework' | 'other';
export type SocialPlatform = 'linkedin' | 'github' | 'twitter' | 'instagram' | 'facebook' | 'youtube' | 'dribbble' | 'behance' | 'medium' | 'dev' | 'stackoverflow' | 'website' | 'other';
export type ImageType = 'cover' | 'gallery' | 'thumbnail' | 'logo' | 'avatar' | 'og' | 'other';

// Base Models
export interface Image {
  id: number;
  filename: string;
  mime_type: string;
  file_size: number;
  width?: number | null;
  height?: number | null;
  image_type: ImageType;
  alt_text?: string;
  caption?: string;
  order: number;
  image_url: string;
  data_uri: string;
  created_at: string;
}

export interface SocialLink {
  id: number;
  platform: SocialPlatform;
  url: string;
  icon?: string;
  order: number;
}

export interface Skill {
  id: number;
  name: string;
  skill_type?: SkillType;
  proficiency?: ProficiencyLevel;
  icon?: string;
  order: number;
}

export interface BlogTag {
  id: number;
  name: string;
  slug: string;
  post_count: string;
}

export interface BlogCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  order: number;
  post_count: string;
  show_on_home?: boolean;
}

export interface Profile {
  id: number;
  full_name: string;
  headline: string;
  bio: string;
  profile_image: string;
  email: string;
  phone?: string;
  location?: string;
  years_of_experience?: number;
  current_role?: string;
  current_company?: string;
  available_for_hire: boolean;
  resume_filename?: string;
  resume_url?: string;
  created_at: string;
  updated_at: string;
}

export interface ProfileDetail extends Profile {
  social_links: SocialLink[];
  skills: Skill[];
  images: Image[];
}

export interface Achievement {
  id: number;
  title: string;
  achievement_type?: AchievementType;
  issuer?: string;
  date: string;
  description?: string;
  url?: string;
  image: string;
  order: number;
  images: Image[];
  show_on_home?: boolean;
}

export interface Certificate {
  id: number;
  title: string;
  issuing_organization: string;
  organization_logo: string;
  issue_date: string;
  expiry_date?: string | null;
  does_not_expire: boolean;
  credential_id?: string;
  credential_url?: string;
  certificate_image: string;
  description?: string;
  skills?: string;
  order: number;
  images: Image[];
  show_on_home?: boolean;
}

export interface Education {
  id: number;
  institution: string;
  degree: string;
  field_of_study: string;
  start_date: string;
  end_date?: string | null;
  is_current: boolean;
  grade?: string;
  description?: string;
  location?: string;
  logo: string;
  images: Image[];
  show_on_home?: boolean;
}

export interface WorkExperience {
  id: number;
  company_name: string;
  company_logo: string;
  company_url?: string;
  job_title: string;
  employment_type?: EmploymentType;
  work_mode?: WorkMode;
  location?: string;
  start_date: string;
  end_date?: string | null;
  is_current: boolean;
  description: string;
  achievements?: string;
  technologies_used?: string;
  order: number;
  images: Image[];
  show_on_home?: boolean;
}

export interface Testimonial {
  id: number;
  author_name: string;
  author_title: string;
  author_company?: string;
  author_image: string;
  content: string;
  rating?: number;
  relationship?: string;
  linkedin_url?: string;
  is_featured: boolean;
  date?: string;
  order: number;
  images: Image[];
  show_on_home?: boolean;
}

export interface Project {
  id: number;
  title: string;
  slug: string;
  short_description: string;
  featured_image: string;
  featured_image_alt?: string;
  live_url?: string;
  github_url?: string;
  demo_url?: string;
  technologies: string;
  status?: ProjectStatus;
  is_featured: boolean;
  order: number;
  created_at: string;
  updated_at: string;
  show_on_home?: boolean;
}

export interface ProjectDetail extends Project {
  description: string;
  role?: string;
  team_size?: number;
  start_date?: string | null;
  end_date?: string | null;
  images: Image[];
}

export interface BlogPostList {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  featured_image: string;
  featured_image_alt?: string;
  category: BlogCategory;
  tags: BlogTag[];
  author: string;
  status?: BlogStatus;
  published_at?: string | null;
  reading_time?: number;
  views_count?: number;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  show_on_home?: boolean;
}

export interface BlogPost extends BlogPostList {
  content: string;
}

export interface BlogPostDetail extends BlogPost {
  images: Image[];
  allow_comments: boolean;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  canonical_url?: string;
  og_title?: string;
  og_description?: string;
  og_image: string;
  schema_type?: string;
}

export interface ContactMessage {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

// Pagination wrapper
export interface PaginatedResponse<T> {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: T[];
}

// API Response types
export type PaginatedAchievements = PaginatedResponse<Achievement>;
export type PaginatedCertificates = PaginatedResponse<Certificate>;
export type PaginatedEducation = PaginatedResponse<Education>;
export type PaginatedWorkExperience = PaginatedResponse<WorkExperience>;
export type PaginatedTestimonials = PaginatedResponse<Testimonial>;
export type PaginatedProjects = PaginatedResponse<Project>;
export type PaginatedBlogPosts = PaginatedResponse<BlogPostList>;
export type PaginatedBlogCategories = PaginatedResponse<BlogCategory>;
export type PaginatedBlogTags = PaginatedResponse<BlogTag>;
export type PaginatedProfiles = PaginatedResponse<Profile>;
export type PaginatedSkills = PaginatedResponse<Skill>;
export type PaginatedSocialLinks = PaginatedResponse<SocialLink>;
export type PaginatedImages = PaginatedResponse<Image>;

// Query Parameters
export interface PaginationParams {
  page?: number;
}

export interface SearchParams {
  search?: string;
}

export interface OrderingParams {
  ordering?: string;
}

export interface AchievementFilters extends PaginationParams, SearchParams, OrderingParams {
  achievement_type?: AchievementType;
  profile?: number;
  show_on_home?: boolean;
}

export interface BlogFilters extends PaginationParams, SearchParams, OrderingParams {
  category?: number;
  tags?: number[];
  is_featured?: boolean;
  profile?: number;
  show_on_home?: boolean;
}

export interface CertificateFilters extends PaginationParams, SearchParams, OrderingParams {
  does_not_expire?: boolean;
  profile?: number;
  show_on_home?: boolean;
}

export interface EducationFilters extends PaginationParams {
  is_current?: boolean;
  profile?: number;
  show_on_home?: boolean;
}

export interface ImageFilters extends PaginationParams {
  content_type?: number;
  object_id?: number;
  image_type?: ImageType;
  show_on_home?: boolean;
}

export interface ProjectFilters extends PaginationParams, SearchParams, OrderingParams {
  status?: ProjectStatus;
  is_featured?: boolean;
  profile?: number;
  show_on_home?: boolean;
}

export interface SkillFilters extends PaginationParams {
  skill_type?: SkillType;
  proficiency?: ProficiencyLevel;
  profile?: number;
  show_on_home?: boolean;
}

export interface SocialLinkFilters extends PaginationParams {
  platform?: SocialPlatform;
  profile?: number;
  show_on_home?: boolean;
}

export interface TestimonialFilters extends PaginationParams, OrderingParams {
  rating?: number;
  is_featured?: boolean;
  profile?: number;
  show_on_home?: boolean;
}

export interface WorkExperienceFilters extends PaginationParams, SearchParams, OrderingParams {
  employment_type?: EmploymentType;
  work_mode?: WorkMode;
  is_current?: boolean;
  profile?: number;
  show_on_home?: boolean;
}
