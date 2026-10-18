import React from 'react';
import { Link } from 'react-router-dom';
import { ProfileDetail } from '../types';
import { getSocialIcon } from '../utils/helpers';

interface FooterProps {
  profile: ProfileDetail | null;
}

export const Footer: React.FC<FooterProps> = ({ profile }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="pt-16 pb-32 md:pb-16 border-t border-[#E5E5E5] mt-auto bg-white" aria-label="Site Footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section: Brand Info & Categorized Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 pb-12 border-b border-[#E5E5E5]">
          {/* Brand & Bio (Left Column) */}
          <div className="md:col-span-5 space-y-4">
            <Link to="/" className="inline-flex items-center gap-3 group">
              {profile?.profile_image && (
                <img 
                  src={profile.profile_image} 
                  alt={profile.full_name || 'Profile'} 
                  className="w-10 h-10 rounded-full object-cover border border-[#E5E5E5] group-hover:border-black transition-colors"
                />
              )}
              <span className="text-xl font-extrabold text-black tracking-tight group-hover:text-black transition-colors">
                {profile?.full_name || 'Anurag Shankar Maurya'}
              </span>
            </Link>
            
            <p className="text-sm text-[#4c4546] leading-relaxed max-w-sm">
              {profile?.headline || 'Android & Full-Stack Developer | AI & Software Developer | Django Backend Architect'}
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f9f9f9] border border-[#E5E5E5] text-xs font-semibold text-[#4c4546]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              {profile?.available_for_hire ? 'Available for opportunities' : 'Open to discussions'}
            </div>
          </div>

          {/* Categorized Semantic Navigation (Right Columns) */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {/* Work & Code */}
            <div>
              <h3 className="text-xs font-bold text-black uppercase tracking-widest mb-4">Work</h3>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link to="/projects" className="text-[#4c4546] hover:text-black transition-colors">Projects</Link>
                </li>
                <li>
                  <Link to="/blog" className="text-[#4c4546] hover:text-black transition-colors">Blog & Articles</Link>
                </li>
                <li>
                  <Link to="/skills" className="text-[#4c4546] hover:text-black transition-colors">Skills & Stack</Link>
                </li>
                <li>
                  <Link to="/experience" className="text-[#4c4546] hover:text-black transition-colors">Experience</Link>
                </li>
              </ul>
            </div>

            {/* Background & Credentials */}
            <div>
              <h3 className="text-xs font-bold text-black uppercase tracking-widest mb-4">Profile</h3>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link to="/education" className="text-[#4c4546] hover:text-black transition-colors">Education</Link>
                </li>
                <li>
                  <Link to="/certificates" className="text-[#4c4546] hover:text-black transition-colors">Certificates</Link>
                </li>
                <li>
                  <Link to="/achievements" className="text-[#4c4546] hover:text-black transition-colors">Achievements</Link>
                </li>
                <li>
                  <Link to="/testimonials" className="text-[#4c4546] hover:text-black transition-colors">Testimonials</Link>
                </li>
              </ul>
            </div>

            {/* Resources & Contact */}
            <div className="col-span-2 sm:col-span-1">
              <h3 className="text-xs font-bold text-black uppercase tracking-widest mb-4">Connect</h3>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link to="/contact" className="text-[#4c4546] hover:text-black transition-colors">Get in Touch</Link>
                </li>
                <li>
                  <Link to="/gallery" className="text-[#4c4546] hover:text-black transition-colors">Media Gallery</Link>
                </li>
                <li>
                  <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer" className="text-[#4c4546] hover:text-black transition-colors">Sitemap XML</a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Social Pill Icons */}
        <div className="pt-8 flex flex-col-reverse sm:flex-row items-center justify-between gap-6 text-xs text-[#7e7576]">
          <p className="text-center sm:text-left">
            © {currentYear} {profile?.full_name || 'Anurag Shankar Maurya'}. All rights reserved.
          </p>

          <div className="flex items-center gap-3">
            {profile?.social_links.map(link => (
              <a 
                key={link.id} 
                href={link.url} 
                target="_blank" 
                rel="me noopener noreferrer" 
                aria-label={`${profile?.full_name || 'Profile'} on ${link.platform}`}
                className="w-10 h-10 rounded-full bg-[#f9f9f9] border border-[#E5E5E5] flex items-center justify-center text-[#4c4546] hover:text-black hover:border-black hover:bg-white transition-all duration-300"
              >
                {getSocialIcon(link.platform, "w-4 h-4")}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
