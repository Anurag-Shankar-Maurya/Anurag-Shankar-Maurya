import React from 'react';
import { Link } from 'react-router-dom';
import { ProfileDetail } from '../types';
import { getSocialIcon } from '../utils/helpers';

interface FooterProps {
  profile: ProfileDetail | null;
}

export const Footer: React.FC<FooterProps> = ({ profile }) => {
  return (
    <footer className="py-12 border-t border-[#E5E5E5] mt-auto bg-white" aria-label="Site Footer">
      <div className="max-w-7xl mx-auto px-4 text-center text-[#7e7576] text-sm flex flex-col items-center gap-6">
        {/* Internal Navigation Links for Search Engine Crawlers & Users */}
        <nav aria-label="Footer Navigation" className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 font-medium">
          <Link to="/" className="text-[#4c4546] hover:text-black transition-colors">Home</Link>
          <Link to="/projects" className="text-[#4c4546] hover:text-black transition-colors">Projects</Link>
          <Link to="/blog" className="text-[#4c4546] hover:text-black transition-colors">Blog</Link>
          <Link to="/skills" className="text-[#4c4546] hover:text-black transition-colors">Skills</Link>
          <Link to="/experience" className="text-[#4c4546] hover:text-black transition-colors">Experience</Link>
          <Link to="/education" className="text-[#4c4546] hover:text-black transition-colors">Education</Link>
          <Link to="/certificates" className="text-[#4c4546] hover:text-black transition-colors">Certificates</Link>
          <Link to="/achievements" className="text-[#4c4546] hover:text-black transition-colors">Achievements</Link>
          <Link to="/testimonials" className="text-[#4c4546] hover:text-black transition-colors">Testimonials</Link>
          <Link to="/gallery" className="text-[#4c4546] hover:text-black transition-colors">Gallery</Link>
          <Link to="/contact" className="text-[#4c4546] hover:text-black transition-colors">Contact</Link>
          <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer" className="text-[#4c4546] hover:text-black transition-colors">Sitemap</a>
        </nav>

        {/* Social Links with rel="me" for Personal Identity Verification */}
        <div className="flex items-center gap-6">
          {profile?.social_links.map(link => (
            <a 
              key={link.id} 
              href={link.url} 
              target="_blank" 
              rel="me noopener noreferrer" 
              aria-label={`${profile.full_name} on ${link.platform}`}
              className="text-[#7e7576] hover:text-black transition-colors"
            >
              {getSocialIcon(link.platform)}
            </a>
          ))}
        </div>

        <p>© {new Date().getFullYear()} {profile?.full_name || 'Anurag Shankar Maurya'}. All rights reserved.</p>
      </div>
    </footer>
  );
};
