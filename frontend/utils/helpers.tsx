import React from 'react';
import { Icons, SocialIcons } from '../components/Icons';
import { ViewState } from '../types';

export const getSocialIcon = (platform: string, className?: string) => {
  const key = platform.toLowerCase();
  const IconComponent = SocialIcons[key] || Icons.globe;
  return <IconComponent className={className || "w-5 h-5"} />;
};

export const pathFromView = (v: ViewState): string => {
  switch (v.type) {
    case 'HOME': return '/';
    case 'PROJECTS': return '/projects';
    case 'PROJECT_DETAIL': return `/projects/${v.slug}`;
    case 'BLOG': return '/blog';
    case 'BLOG_DETAIL': return `/blog/${v.slug}`;
    case 'EXPERIENCE': return '/experience';
    case 'EXPERIENCE_DETAIL': return `/experience/${v.id}`;
    case 'EDUCATION': return '/education';
    case 'EDUCATION_DETAIL': return `/education/${v.slug}`;
    case 'SKILLS': return '/skills';
    case 'SKILL_DETAIL': return `/skills/${v.slug}`;
    case 'CERTIFICATES': return '/certificates';
    case 'CERTIFICATE_DETAIL': return `/certificates/${v.slug}`;
    case 'ACHIEVEMENTS': return '/achievements';
    case 'ACHIEVEMENT_DETAIL': return `/achievements/${v.slug}`;
    case 'TESTIMONIALS': return '/testimonials';
    case 'TESTIMONIAL_DETAIL': return `/testimonials/${v.slug}`;
    case 'CONTACT': return '/contact';
    case 'GALLERY': return '/gallery';
    default: return '/';
  }
};
