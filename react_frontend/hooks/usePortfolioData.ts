import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  ProfileDetail, Project, BlogPost, WorkExperience, Education, 
  Certificate, Achievement, Testimonial, Skill, Image 
} from '../types';

const CACHE_KEY = 'portfolio_homepage_data';

export const usePortfolioData = () => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileDetail | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [experience, setExperience] = useState<WorkExperience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [images, setImages] = useState<Image[]>([]);

  useEffect(() => {
    // 1. Synchronously try to load cached data from localStorage to ensure 0ms render
    const cachedDataStr = localStorage.getItem(CACHE_KEY);

    if (cachedDataStr) {
      try {
        const cached = JSON.parse(cachedDataStr);
        if (cached && typeof cached === 'object') {
          setProfile(cached.profile ?? null);
          setProjects(cached.projects ?? []);
          setFeaturedProjects(cached.featuredProjects ?? []);
          setBlogPosts(cached.blogPosts ?? []);
          setExperience(cached.experience ?? []);
          setEducation(cached.education ?? []);
          setCertificates(cached.certificates ?? []);
          setAchievements(cached.achievements ?? []);
          setTestimonials(cached.testimonials ?? []);
          setSkills(cached.skills ?? []);
          setImages(cached.images ?? []);
          setLoading(false);
        }
      } catch (err) {
        console.warn("Failed to parse cached portfolio data", err);
      }
    }

    // 2. Fetch fresh data in the background (Stale-While-Revalidate)
    const fetchFreshData = async () => {
      try {
        const data = await api.getPortfolioData();
        const freshDataStr = JSON.stringify(data);

        // Update state and cache only if data has changed
        if (freshDataStr !== cachedDataStr) {
          setProfile(data.profile);
          setProjects(data.projects);
          setFeaturedProjects(data.featuredProjects);
          setBlogPosts(data.blogPosts);
          setExperience(data.experience);
          setEducation(data.education);
          setCertificates(data.certificates);
          setAchievements(data.achievements);
          setTestimonials(data.testimonials);
          setSkills(data.skills);
          setImages(data.images);
          
          localStorage.setItem(CACHE_KEY, freshDataStr);
        }
      } catch (error) {
        console.error("Failed to fetch fresh portfolio data in background", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFreshData();
  }, []);

  return {
    loading,
    profile,
    projects,
    featuredProjects,
    blogPosts,
    experience,
    education,
    certificates,
    achievements,
    testimonials,
    skills,
    images,
    setLoading
  };
};
