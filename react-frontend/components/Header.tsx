
import React, { useEffect, useState } from 'react';
import { DesktopNav } from './DesktopNav';
import { ViewState, ProfileDetail } from '../types';

interface HeaderProps {
  view: ViewState;
  onNavigate: (view: ViewState) => void;
  profile: ProfileDetail | null;
}

export const Header: React.FC<HeaderProps> = ({ view, onNavigate, profile }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${scrolled ? 'bg-[#09090b]/70 backdrop-blur-xl border-b border-white/5 py-3 shadow-2xl shadow-black/20' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div 
          className="text-xl font-bold text-white cursor-pointer flex items-center gap-3 group"
          onClick={() => onNavigate({ type: 'HOME' })}
        >
          {profile?.profile_image && (
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500 blur-lg opacity-20 group-hover:opacity-40 transition-opacity rounded-full"></div>
              <img src={profile.profile_image} alt="Profile" className="relative h-9 w-9 rounded-full border border-white/10 group-hover:border-blue-500/50 transition-colors" />
            </div>
          )}
          <span className="tracking-tight group-hover:text-blue-400 transition-colors duration-300">
            {profile?.full_name || 'Portfolio'}
          </span>
        </div>
        <DesktopNav currentView={view} onNavigate={onNavigate} scrolled={scrolled} />
      </div>
    </header>
  );
};
