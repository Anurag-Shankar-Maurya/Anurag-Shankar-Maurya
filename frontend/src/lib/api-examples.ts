/**
 * Example Usage of API Services
 * 
 * This file demonstrates how to use the API services in different scenarios
 */

import {
  profileApi,
  projectsApi,
  blogApi,
  workExperienceApi,
  educationApi,
  certificatesApi,
  achievementsApi,
  testimonialsApi,
  skillsApi,
  socialLinksApi,
  imagesApi,
  contactApi,
  fetchWithErrorHandling,
  serverFetchOptions,
} from '@/lib';

// ============================================
// SERVER COMPONENT EXAMPLES (Next.js App Router)
// ============================================

/**
 * Example: Fetch profile data in a server component
 */
export async function getProfileData(profileId: number) {
  try {
    const profile = await profileApi.get(profileId);
    return profile;
  } catch (error) {
    console.error('Failed to fetch profile:', error);
    return null;
  }
}

/**
 * Example: Fetch projects with filters
 */
export async function getProjects() {
  try {
    const projects = await projectsApi.list({
      is_featured: true,
      show_on_home: true,
      ordering: '-created_at',
    });
    return projects;
  } catch (error) {
    console.error('Failed to fetch projects:', error);
    return null;
  }
}

/**
 * Example: Fetch single project by slug
 */
export async function getProjectBySlug(slug: string) {
  try {
    const project = await projectsApi.get(slug);
    return project;
  } catch (error) {
    console.error(`Failed to fetch project ${slug}:`, error);
    return null;
  }
}

/**
 * Example: Fetch blog posts with pagination
 */
export async function getBlogPosts(page: number = 1) {
  try {
    const posts = await blogApi.list({
      page,
      ordering: '-published_at',
      show_on_home: true,
    });
    return posts;
  } catch (error) {
    console.error('Failed to fetch blog posts:', error);
    return null;
  }
}

/**
 * Example: Fetch work experience
 */
export async function getWorkExperience() {
  try {
    const experience = await workExperienceApi.list({
      ordering: '-start_date',
      show_on_home: true,
    });
    return experience;
  } catch (error) {
    console.error('Failed to fetch work experience:', error);
    return null;
  }
}

/**
 * Example: Fetch skills grouped by type
 */
export async function getSkillsByType() {
  try {
    const [technical, languages, frameworks] = await Promise.all([
      skillsApi.list({ skill_type: 'technical', show_on_home: true }),
      skillsApi.list({ skill_type: 'language', show_on_home: true }),
      skillsApi.list({ skill_type: 'framework', show_on_home: true }),
    ]);
    
    return { technical, languages, frameworks };
  } catch (error) {
    console.error('Failed to fetch skills:', error);
    return null;
  }
}

// ============================================
// CLIENT COMPONENT EXAMPLES (with hooks)
// ============================================

/**
 * Example: Client component with API hook
 */
/*
'use client';

import { useApi } from '@/lib/hooks';
import { projectsApi } from '@/lib';

export function ProjectsList() {
  const { data, loading, error } = useApi(
    () => projectsApi.list({ is_featured: true }),
    []
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return null;

  return (
    <div>
      {data.results.map((project) => (
        <div key={project.id}>
          <h3>{project.title}</h3>
          <p>{project.short_description}</p>
        </div>
      ))}
    </div>
  );
}
*/

// ============================================
// FORM SUBMISSION EXAMPLE
// ============================================

/**
 * Example: Submit contact form
 */
/*
'use client';

import { useState } from 'react';
import { useLazyApi } from '@/lib/hooks';
import { contactApi } from '@/lib';

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const { loading, error, execute } = useLazyApi(contactApi.submit);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await execute(formData);
      alert('Message sent successfully!');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        placeholder="Name"
        required
      />
      <input
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        placeholder="Email"
        required
      />
      <input
        type="text"
        value={formData.subject}
        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
        placeholder="Subject"
        required
      />
      <textarea
        value={formData.message}
        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        placeholder="Message"
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Sending...' : 'Send Message'}
      </button>
      {error && <p>Error: {error.message}</p>}
    </form>
  );
}
*/

// ============================================
// SERVER ACTION EXAMPLE (Next.js)
// ============================================

/**
 * Example: Server action for form submission
 */
/*
'use server';

import { contactApi } from '@/lib';

export async function submitContactForm(formData: FormData) {
  try {
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      subject: formData.get('subject') as string,
      message: formData.get('message') as string,
    };

    await contactApi.submit(data);
    return { success: true };
  } catch (error) {
    console.error('Failed to submit contact form:', error);
    return { success: false, error: 'Failed to send message' };
  }
}
*/

// ============================================
// ADVANCED FILTERING EXAMPLE
// ============================================

/**
 * Example: Advanced blog filtering
 */
export async function searchBlogPosts(searchTerm: string, categorySlug?: string) {
  try {
    const params: any = {
      search: searchTerm,
      ordering: '-published_at',
    };

    if (categorySlug) {
      // First get the category to get its ID
      const categories = await blogApi.categories.list({ search: categorySlug });
      if (categories.results.length > 0) {
        params.category = categories.results[0].id;
      }
    }

    const posts = await blogApi.list(params);
    return posts;
  } catch (error) {
    console.error('Failed to search blog posts:', error);
    return null;
  }
}

// ============================================
// ERROR HANDLING EXAMPLE
// ============================================

/**
 * Example: Fetch with custom error handling
 */
export async function getProjectsWithErrorHandling() {
  return await fetchWithErrorHandling(
    () => projectsApi.list({ is_featured: true }),
    (error) => {
      // Custom error handling
      if (error.status === 404) {
        console.log('No projects found');
      } else if (error.status === 500) {
        console.error('Server error:', error.message);
      }
    }
  );
}
