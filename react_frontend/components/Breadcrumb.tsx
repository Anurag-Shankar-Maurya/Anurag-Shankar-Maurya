import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { ViewState } from '../types';

interface BreadcrumbItem {
  label: string;
  view?: ViewState;
  isActive?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  onNavigate: (view: ViewState) => void;
  className?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, onNavigate, className = '' }) => {
  return (
    <nav 
      aria-label="Breadcrumb" 
      className={`mb-6 ${className}`}
    >
      <ol className="flex items-center flex-wrap gap-2 text-sm">
        {/* Home Link */}
        <li>
          <button
            onClick={() => onNavigate({ type: 'HOME' })}
            className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70 rounded px-1"
            aria-label="Go to home"
          >
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">Home</span>
          </button>
        </li>

        {items.map((item, index) => (
          <React.Fragment key={index}>
            <li aria-hidden="true">
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </li>
            <li>
              {item.isActive || !item.view ? (
                <span 
                  className={`${item.isActive ? 'text-white font-medium' : 'text-gray-400'} max-w-[200px] sm:max-w-[300px] truncate block`}
                  aria-current={item.isActive ? 'page' : undefined}
                >
                  {item.label}
                </span>
              ) : (
                <button
                  onClick={() => item.view && onNavigate(item.view)}
                  className="text-gray-400 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70 rounded px-1 max-w-[200px] sm:max-w-[300px] truncate"
                >
                  {item.label}
                </button>
              )}
            </li>
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
};

// Helper function to generate breadcrumbs based on current view
export const generateBreadcrumbs = (view: ViewState, detailName?: string): BreadcrumbItem[] => {
  switch (view.type) {
    case 'PROJECTS':
      return [{ label: 'Projects', isActive: true }];
    case 'PROJECT_DETAIL':
      return [
        { label: 'Projects', view: { type: 'PROJECTS' } },
        { label: detailName || 'Project Detail', isActive: true },
      ];
    case 'BLOG':
      return [{ label: 'Blog', isActive: true }];
    case 'BLOG_DETAIL':
      return [
        { label: 'Blog', view: { type: 'BLOG' } },
        { label: detailName || 'Post', isActive: true },
      ];
    case 'ABOUT':
      return [{ label: 'About', isActive: true }];
    case 'EXPERIENCE':
      return [{ label: 'Experience', isActive: true }];
    case 'EXPERIENCE_DETAIL':
      return [
        { label: 'Experience', view: { type: 'EXPERIENCE' } },
        { label: detailName || 'Position', isActive: true },
      ];
    case 'EDUCATION':
      return [{ label: 'Education', isActive: true }];
    case 'EDUCATION_DETAIL':
      return [
        { label: 'Education', view: { type: 'EDUCATION' } },
        { label: detailName || 'Degree', isActive: true },
      ];
    case 'SKILLS':
      return [{ label: 'Skills', isActive: true }];
    case 'SKILL_DETAIL':
      return [
        { label: 'Skills', view: { type: 'SKILLS' } },
        { label: detailName || 'Skill', isActive: true },
      ];
    case 'CERTIFICATES':
      return [{ label: 'Certificates', isActive: true }];
    case 'CERTIFICATE_DETAIL':
      return [
        { label: 'Certificates', view: { type: 'CERTIFICATES' } },
        { label: detailName || 'Certificate', isActive: true },
      ];
    case 'ACHIEVEMENTS':
      return [{ label: 'Achievements', isActive: true }];
    case 'ACHIEVEMENT_DETAIL':
      return [
        { label: 'Achievements', view: { type: 'ACHIEVEMENTS' } },
        { label: detailName || 'Achievement', isActive: true },
      ];
    case 'TESTIMONIALS':
      return [{ label: 'Testimonials', isActive: true }];
    case 'TESTIMONIAL_DETAIL':
      return [
        { label: 'Testimonials', view: { type: 'TESTIMONIALS' } },
        { label: detailName || 'Testimonial', isActive: true },
      ];
    case 'GALLERY':
      return [{ label: 'Gallery', isActive: true }];
    case 'CONTACT':
      return [{ label: 'Contact', isActive: true }];
    default:
      return [];
  }
};