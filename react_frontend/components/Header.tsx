
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
    <header className="fixed top-0 left-0 right-0 z-40 pointer-events-none transition-all duration-500 py-4 md:py-6">
      <div 
        className={`w-full mx-auto flex items-center justify-between pointer-events-auto transition-all duration-500 ${
          scrolled 
            ? 'max-w-[95%] md:max-w-5xl bg-[#09090b]/75 backdrop-blur-xl border border-white/10 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_20px_rgba(59,130,246,0.08)] py-3 px-6' 
            : 'max-w-7xl bg-transparent border border-transparent py-5 px-4 md:px-6'
        }`}
      >
        <div 
          className="text-xl font-bold text-white cursor-pointer flex items-center gap-3 group rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70"
          onClick={() => onNavigate({ type: 'HOME' })}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onNavigate({ type: 'HOME' });
            }
          }}
          aria-label="Go to home"
        >
          {profile?.profile_image && (
            <div className="relative flex-shrink-0">
              <div className="absolute inset-0 bg-blue-500 blur-lg opacity-20 group-hover:opacity-40 transition-opacity rounded-full"></div>
              <img src={profile.profile_image} alt="Profile" className="relative h-9 w-9 rounded-full border border-white/10 group-hover:border-blue-500/50 transition-colors" />
            </div>
          )}
          <span className="tracking-tight group-hover:text-blue-400 transition-colors duration-300 text-base md:text-lg">
            {profile?.full_name || 'Portfolio'}
          </span>
        </div>
        <DesktopNav currentView={view} onNavigate={onNavigate} scrolled={scrolled} />
      </div>
    </header>
  );
};

