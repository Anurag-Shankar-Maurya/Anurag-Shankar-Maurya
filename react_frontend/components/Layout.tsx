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
    <div className="min-h-screen bg-background text-white selection:bg-blue-500/30 font-sans flex flex-col relative z-10 overflow-hidden">
      {/* Ambient Background Blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
         <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-blob"></div>
         <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
         <div className="absolute bottom-[-10%] left-[20%] w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <Header view={view} onNavigate={onNavigate} profile={profile} />
      
      <div className="relative z-10 animate-fade-in flex-grow">
        {children}
      </div>
      
      <MobileNav currentView={view} onNavigate={onNavigate} />
      <Footer profile={profile} />
    </div>
  );
};
