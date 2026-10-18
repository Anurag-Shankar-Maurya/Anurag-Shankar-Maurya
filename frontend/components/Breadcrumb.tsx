import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ChevronRight, Home } from 'lucide-react';
import { ViewState } from '../types';
import { pathFromView } from '../utils/helpers';

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
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://www.anuragshankarmaurya.in';

  // Construct BreadcrumbList structured data
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": `${origin}/`
      },
      ...items.map((item, index) => {
        const itemUrl = item.view ? `${origin}${pathFromView(item.view)}` : (typeof window !== 'undefined' ? window.location.href : undefined);
        return {
          "@type": "ListItem",
          "position": index + 2,
          "name": item.label,
          ...(itemUrl ? { "item": itemUrl } : {})
        };
      })
    ]
  };

  return (
    <>
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      </Helmet>

      <nav 
        aria-label="Breadcrumb" 
        className={`mb-6 ${className}`}
      >
        <ol className="flex items-center flex-wrap gap-2 text-sm">
          {/* Home Link */}
          <li>
            <Link
              to="/"
              onClick={() => onNavigate({ type: 'HOME' })}
              className="flex items-center gap-1.5 text-[#7e7576] hover:text-black transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/50 rounded px-1 font-semibold"
              aria-label="Go to home"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Home</span>
            </Link>
          </li>

          {items.map((item, index) => (
            <React.Fragment key={index}>
              <li aria-hidden="true">
                <ChevronRight className="w-4 h-4 text-[#cfc4c5]" />
              </li>
              <li>
                {item.isActive || !item.view ? (
                  <span 
                    className={`${item.isActive ? 'text-black font-bold' : 'text-[#7e7576] font-semibold'} max-w-[200px] sm:max-w-[300px] truncate block`}
                    aria-current={item.isActive ? 'page' : undefined}
                  >
                    {item.label}
                  </span>
                ) : (
                  <Link
                    to={pathFromView(item.view)}
                    onClick={() => item.view && onNavigate(item.view)}
                    className="text-[#7e7576] hover:text-black transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/50 rounded px-1 max-w-[200px] sm:max-w-[300px] truncate font-semibold block"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            </React.Fragment>
          ))}
        </ol>
      </nav>
    </>
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