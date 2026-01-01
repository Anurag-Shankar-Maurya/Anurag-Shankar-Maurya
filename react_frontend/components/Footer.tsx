
import React from 'react';
import { ProfileDetail } from '../types';
import { getSocialIcon } from '../utils/helpers';

interface FooterProps {
  profile: ProfileDetail | null;
}

export const Footer: React.FC<FooterProps> = ({ profile }) => {
  return (
    <footer className="py-12 border-t border-white/10 mt-auto bg-[#09090b]">
      <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm flex flex-col items-center gap-4">
          <div className="flex items-center gap-6">
            {profile?.social_links.map(link => (
              <a key={link.id} href={link.url} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition-colors">
                {getSocialIcon(link.platform)}
              </a>
            ))}
          </div>
        <p>© {new Date().getFullYear()} {profile?.full_name}. All rights reserved.</p>
      </div>
    </footer>
  );
};
