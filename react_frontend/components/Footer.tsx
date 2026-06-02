
import React from 'react';
import { ProfileDetail } from '../types';
import { getSocialIcon } from '../utils/helpers';

interface FooterProps {
  profile: ProfileDetail | null;
}

export const Footer: React.FC<FooterProps> = ({ profile }) => {
  return (
    <footer className="py-12 border-t border-[#E5E5E5] mt-auto bg-white">
      <div className="max-w-7xl mx-auto px-4 text-center text-[#7e7576] text-sm flex flex-col items-center gap-4">
          <div className="flex items-center gap-6">
            {profile?.social_links.map(link => (
              <a key={link.id} href={link.url} target="_blank" rel="noreferrer" className="text-[#7e7576] hover:text-black transition-colors">
                {getSocialIcon(link.platform)}
              </a>
            ))}
          </div>
        <p>© {new Date().getFullYear()} {profile?.full_name}. All rights reserved.</p>
      </div>
    </footer>
  );
};
