
import React, { useState } from 'react';
import { Home, Briefcase, BookOpen, User, Grid, GraduationCap, Zap, Award, Star, Mail, Trophy } from 'lucide-react';
import { ViewState } from '../types';

interface MobileNavProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ currentView, onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const mainItems = [
    { icon: Home, label: 'Home', view: 'HOME' as const },
    { icon: Briefcase, label: 'Projects', view: 'PROJECTS' as const },
    { icon: BookOpen, label: 'Blog', view: 'BLOG' as const },
    { icon: User, label: 'Profile', view: 'ABOUT' as const },
  ];

  const menuItems = [
    { icon: Briefcase, label: 'Experience', view: 'EXPERIENCE' as const, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { icon: GraduationCap, label: 'Education', view: 'EDUCATION' as const, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { icon: Zap, label: 'Skills', view: 'SKILLS' as const, color: 'text-green-400', bg: 'bg-green-500/10' },
    { icon: Award, label: 'Certificates', view: 'CERTIFICATES' as const, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { icon: Trophy, label: 'Achievements', view: 'ACHIEVEMENTS' as const, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
    { icon: Grid, label: 'Gallery', view: 'GALLERY' as const, color: 'text-pink-400', bg: 'bg-pink-500/10' },
    { icon: Star, label: 'Testimonials', view: 'TESTIMONIALS' as const, color: 'text-orange-400', bg: 'bg-orange-500/10' },
    { icon: Mail, label: 'Contact', view: 'CONTACT' as const, color: 'text-gray-400', bg: 'bg-white/5' },
  ];

  const handleNavigate = (view: ViewState) => {
    setIsMenuOpen(false);
    onNavigate(view);
  };

  return (
    <>
      {/* Menu Popup */}
      {isMenuOpen && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-[90%] max-w-sm z-50 animate-in slide-in-from-bottom-5 duration-200">
          <div className="bg-[#18181b]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl">
            <div className="grid grid-cols-2 gap-3">
              {menuItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleNavigate({ type: item.view })}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors text-left"
                >
                  <div className={`p-2 rounded-lg ${item.bg} ${item.color}`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium text-gray-200">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
          {/* Overlay to close */}
          <div className="fixed inset-0 -z-10" onClick={() => setIsMenuOpen(false)}></div>
        </div>
      )}

      {/* Navigation Bar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 md:hidden">
        <div className="flex items-center gap-1 bg-[#18181b]/90 backdrop-blur-xl border border-white/10 rounded-full p-2 shadow-2xl shadow-black/50">
          {mainItems.map((item) => {
            const isActive = currentView.type === item.view || (currentView.type.startsWith(item.view) && item.view !== 'HOME');
            return (
              <button
                key={item.label}
                onClick={() => { setIsMenuOpen(false); onNavigate({ type: item.view }); }}
                className={`relative p-3 rounded-full transition-all duration-300 ${
                  isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25' : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="sr-only">{item.label}</span>
              </button>
            );
          })}
          
          {/* Menu Trigger */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`relative p-3 rounded-full transition-all duration-300 ${
              isMenuOpen ? 'bg-white/20 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Grid className="w-5 h-5" />
            <span className="sr-only">Menu</span>
          </button>
        </div>
      </div>
    </>
  );
};
