import React from 'react';
import { ViewState, ProfileDetail } from '../types';
import { Header } from './Header';
import { Footer } from './Footer';
import { MobileNav } from './MobileNav';

interface LayoutProps {
  children: React.ReactNode;
  view: ViewState;
  onNavigate: (view: ViewState) => void;
  profile: ProfileDetail | null;
}

export const Layout: React.FC<LayoutProps> = ({ children, view, onNavigate, profile }) => {
  return (
    <div className="min-h-screen bg-background text-on-background selection:bg-primary/10 selection:text-primary font-sans flex flex-col relative z-10 overflow-hidden">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-full focus:bg-primary focus:text-white"
      >
        Skip to main content
      </a>

      {/* Ambient Background Blobs removed for Aetherial Minimalist Theme */}

      <Header view={view} onNavigate={onNavigate} profile={profile} />
      {/* Hidden site-wide H1 with your full name for SEO (visually hidden but accessible) */}
      <h1 className="sr-only">{profile?.full_name || 'Anurag Shankar Maurya'}</h1>

      <main id="main-content" className="relative z-10 animate-fade-in flex-grow" tabIndex={-1}>
        {children}
      </main>
      
      <MobileNav currentView={view} onNavigate={onNavigate} />
      <Footer profile={profile} />
    </div>
  );
};
