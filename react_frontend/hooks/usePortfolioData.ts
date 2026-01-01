
import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  ProfileDetail, Project, BlogPost, WorkExperience, Education, 
  Certificate, Achievement, Testimonial, Skill, Image 
} from '../types';

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
    const initData = async () => {
      try {
        setLoading(true);
        const profiles = await api.getProfiles();
        if (profiles.results.length > 0) {
          const profileData = await api.getProfileDetail(profiles.results[0].id);
          setProfile(profileData);
        }

        const [projRes, featProjRes, blogRes, expRes, eduRes, certRes, achRes, testRes, skillRes, imgRes] = await Promise.all([
          api.getProjects(),
          api.getProjects({ featured: true, show_on_home: true }),
          api.getBlogPosts({ show_on_home: true }),
          api.getExperience(),
          api.getEducation(),
          api.getCertificates(),
          api.getAchievements(),
          api.getTestimonials(),
          api.getSkills(),
          api.getImages({ show_on_home: true })
        ]);

        setProjects(projRes.results);
        setFeaturedProjects(featProjRes.results);
        setBlogPosts(blogRes.results);
        setExperience(expRes.results);
        setEducation(eduRes.results);
        setCertificates(certRes.results);
        setAchievements(achRes.results);
        setTestimonials(testRes.results);
        setSkills(skillRes.results);
        setImages(imgRes.results);

      } catch (error) {
        console.error("Failed to fetch initial data", error);
      } finally {
        setLoading(false);
      }
    };

    initData();
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
    setLoading // Exporting setLoading for detail fetchers if needed elsewhere, though usually handled locally or in specific hooks
  };
};
